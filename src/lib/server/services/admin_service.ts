import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

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

    async getAllUsers() {
        return await this.db.select().from(table.users);
    }

    async getAllInvitations() {
        return await this.db.select().from(table.invitation);
    }

    async deleteInvitation(id: string) {
        await this.db.delete(table.invitation).where(eq(table.invitation.id, id));
    }
}








