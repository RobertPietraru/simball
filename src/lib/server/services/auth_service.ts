import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { hash, verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';
import type { RequestEvent } from '@sveltejs/kit';
import assert from 'node:assert';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import type { Id } from '$lib/server/db/schema';
const DAY_IN_MS = 1000 * 60 * 60 * 24;
export type SessionValidationResult = { session: null, user: null } | { session: table.Session, user: Omit<table.User, 'passwordHash'> };

export class AuthService {
    private db: PostgresJsDatabase;
    public sessionCookieName: string;

    constructor(db: PostgresJsDatabase) {
        this.db = db;
        this.sessionCookieName = 'auth-session';
    }


    async createUserAccount(params: {
        email: string,
        name: string,
        password: string,
        invitationId: Id
    }) {
        /// if the password is too long, throw an error
        assert(params.name.length < 100, 'Name too long');
        assert(params.email.length < 100, 'Email too long');
        assert(params.name.length > 0, 'Name too short');
        assert(params.email.length > 0, 'Email too short');
        assert(params.password.length >= 8, 'Password too short');
        assert(params.email.includes('@'), 'Email must contain an @');

        const invitation = await this.db.select().from(table.invitation).where(eq(table.invitation.id, params.invitationId)).limit(1);
        if (invitation.length === 0 || invitation[0].expiresAt < new Date()) {
            return 'invitationNotFound';
        }
        const passwordHash = await hash(params.password, {
            // recommended minimum parameters
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });
        /// check if email already exists
        const existingUser = await this.db.select().from(table.users).where(eq(table.users.email, params.email));
        if (existingUser.length > 0) {
            return 'emailAlreadyExists';
        }

        const user_id = await this.db.transaction(async (tx) => {
            const [userCreationResult] = await tx
                .insert(table.users)
                .values({
                    email: params.email,
                    passwordHash,
                    role: 'user',
                })
                .returning({ id: table.users.id });
            await tx.delete(table.invitation).where(eq(table.invitation.id, params.invitationId));
            return userCreationResult.id;
        });
        return user_id;
    }


    async login(email: string, password: string): Promise<Id | 'wrongCredentials'> {
        assert(email.length < 100, 'Email too long');
        assert(password.length < 100, 'Password too long');
        const results = await this.db.select().from(table.users).where(eq(table.users.email, email));

        const existingUser = results.at(0);

        if (!existingUser) {
            return 'wrongCredentials';
        }

        const validPassword = await verify(existingUser.passwordHash, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });
        if (!validPassword) {
            return 'wrongCredentials';
        }
        return existingUser.id;
    }

    async invalidateSession(sessionId: string): Promise<boolean> {
        try {
            await this.db.delete(table.session).where(eq(table.session.id, sessionId));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async generateSessionToken() {
        const bytes = crypto.getRandomValues(new Uint8Array(18));
        const token = encodeBase64url(bytes);
        return token;
    }

    async createSession(token: string, userId: Id) {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
        const session: table.Session = {
            id: sessionId,
            userId,
            expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
        };
        await this.db.insert(table.session).values(session);
        return session;
    }

    async validateSessionTokenAndReturnUser(token: string): Promise<SessionValidationResult> {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
        const [result] = await this.db
            .select({
                // Adjust user table here to tweak returned data
                user: {
                    id: table.users.id,
                    email: table.users.email,
                    role: table.users.role,
                },
                session: table.session,
            })
            .from(table.session)
            .innerJoin(table.users, eq(table.session.userId, table.users.id))
            .where(eq(table.session.id, sessionId));

        if (!result) {
            return { session: null, user: null };
        }
        const { session, user } = result;


        const sessionExpired = Date.now() >= session.expiresAt.getTime();
        if (sessionExpired) {
            await this.db.delete(table.session).where(eq(table.session.id, session.id));
            return { session: null, user: null, };
        }

        const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
        if (renewSession) {
            session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
            await this.db
                .update(table.session)
                .set({ expiresAt: session.expiresAt })
                .where(eq(table.session.id, session.id));
        }

        return { session, user };
    }

    setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
        event.cookies.set(this.sessionCookieName, token, {
            expires: expiresAt,
            path: '/'
        });
    }

    deleteSessionTokenCookie(event: RequestEvent) {
        event.cookies.delete(this.sessionCookieName, {
            path: '/'
        });
    }
}








