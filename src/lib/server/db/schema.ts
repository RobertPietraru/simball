import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, integer, jsonb } from 'drizzle-orm/pg-core';


export const users = pgTable('user', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	name: text('name').notNull(),
	passwordHash: text('password_hash').notNull(),
	roles: text('roles', { enum: ['admin', 'contributor'] }).array().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().default(sql`now()`),
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
	roles: text('roles', { enum: ['admin', 'contributor'] }).array().notNull(),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

export const source = pgTable('source', {
	id: uuid('id').primaryKey().defaultRandom(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().default(sql`now()`),
	label: text('label').notNull(),
	description: text('description').notNull(),
	links: text('links').array().notNull(),
});

export const word = pgTable('word', {
	id: uuid('id').primaryKey().defaultRandom(),
	text: text('text').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().default(sql`now()`),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().default(sql`now()`),
});

export const definition = pgTable('definition', {
	id: uuid('id').primaryKey().defaultRandom(),
	wordId: uuid('word_id').notNull().references(() => word.id),
	explanation: text('explanation').notNull(),
	sourceId: uuid('source_id').notNull().references(() => source.id),
});


export type Session = typeof session.$inferSelect;
export type User = typeof users.$inferSelect;
export type Invitation = typeof invitation.$inferSelect;

export type Id = string;

export const tableSchema = [
	invitation,
	session,
	word,
	definition,
	source,
	users,
];
