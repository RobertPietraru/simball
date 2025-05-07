import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';


export const users = pgTable('user', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: text('role', { enum: ['admin', 'user'] }).notNull(),
});
// Session
export const session = pgTable('session', {
	/// has to be text
	id: text('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

export const invitation = pgTable('invitation', {
	id: uuid('id').primaryKey().defaultRandom(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().default(sql`now()`),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});


export type Session = typeof session.$inferSelect;
export type User = typeof users.$inferSelect;
export type Invitation = typeof invitation.$inferSelect;

export type Id = string;

export const tableSchema = [
	invitation,
	session,
	users,
];
