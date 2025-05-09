import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as table from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export class AdminService {
    private db: PostgresJsDatabase;
    constructor(db: PostgresJsDatabase) {
        this.db = db;
    }


    async createInvitation(roles: table.User['roles']) {
        const invitation = await this.db.insert(table.invitation).values({
            roles,
            expiresAt: new Date(Date.now() + DAY_IN_MS),
        })
            .returning({ id: table.invitation.id });
        return invitation[0].id;
    }

    async deleteInvitation(id: string) {
        await this.db.delete(table.invitation).where(eq(table.invitation.id, id));
    }

    async deleteUser(id: string) {
        await this.db.delete(table.users).where(eq(table.users.id, id));
    }

    async showAllUsers() {
        return await this.db.select().from(table.users).orderBy(desc(table.users.createdAt));
    }

    async showAllInvitations() {
        return await this.db.select().from(table.invitation).orderBy(desc(table.invitation.createdAt));
    }
}






