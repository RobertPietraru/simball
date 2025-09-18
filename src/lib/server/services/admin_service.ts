import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as table from '$lib/server/db/schema';
import { eq, desc, like, count, ilike, or, isNotNull, and } from 'drizzle-orm';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export class AdminService {
	async getWordById(id: string) {
		const word = await this.db.select().from(table.word).where(eq(table.word.id, id));
		if (word.length === 0) {
			return null;
		}
		const definitions = await this.db.select().from(table.definition).where(eq(table.definition.wordId, word[0].id)).leftJoin(table.source, eq(table.definition.sourceId, table.source.id));
		if (definitions.length === 0) {
			return null;
		}
		return {
			...word[0],
			definitions: definitions.map(definition => ({
				text: definition.definition.explanation,
				source: definition.source ? {
					id: definition.source.id,
					label: definition.source.label,
					links: definition.source.links,
				} : null,
			})),
		};
	}
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

	async getSourceById(id: string) {
		const source = await this.db.select().from(table.source).where(eq(table.source.id, id));
		if (source.length === 0) {
			return null;
		}
		return source[0];
	}

	async getSourceByLabel(label: string) {
		return await this.db.select().from(table.source).where(eq(table.source.label, label));
	}

	async deleteSource(id: string) {
		await this.db.delete(table.definition).where(eq(table.definition.sourceId, id));
		await this.db.delete(table.source).where(eq(table.source.id, id));
	}

	async updateSource(id: string, label: string, description: string, links: string[]) {
		await this.db.update(table.source).set({
			label,
			description,
			links,
		}).where(eq(table.source.id, id));
	}
	async createSource(label: string, description: string, links: string[]) {
		await this.db.insert(table.source).values({
			label,
			description,
			links,
		});
	}

	async getSources() {
		return await this.db.select().from(table.source).orderBy(desc(table.source.createdAt));
	}

	async getWords(params: {
		search: string;
		page: number;
		limit: number;
	}) {
		const offset = (params.page - 1) * params.limit;
		const counted = await this.db.select({ count: count() }).from(table.word).where(or(ilike(table.word.text, `%${params.search}%`), isNotNull(table.definition.explanation), ilike(table.definition.explanation, `%${params.search}%`)));
		const words = await this.db.select().from(table.word).orderBy(desc(table.word.createdAt)).limit(params.limit).offset(offset);
		return {
			words,
			total: counted[0].count
		};
	}
	async searchWords(params: {
		search: string;
		searchInDefinition: boolean;
		searchInWord: boolean;
		page: number;
		limit: number;
	}) {
		const offset = (params.page - 1) * params.limit;
		const counted = await this.db
			.select({ count: count() })
			.from(table.word)
			.leftJoin(table.definition, eq(table.word.id, table.definition.wordId))
			.where(or(params.searchInWord ? ilike(table.word.text, `%${params.search}%`) : undefined, params.searchInDefinition ? and(isNotNull(table.definition.explanation), ilike(table.definition.explanation, `%${params.search}%`)) : undefined));

		let words = await this.db
			.select({
				id: table.word.id,
				text: table.word.text,
				createdAt: table.word.createdAt,
				definition: table.definition.explanation
			})
			.from(table.word)
			.orderBy(desc(table.word.createdAt))
			.where(or(params.searchInWord ? ilike(table.word.text, `%${params.search}%`) : undefined, params.searchInDefinition ? and(isNotNull(table.definition.explanation), ilike(table.definition.explanation, `%${params.search}%`)) : undefined))
			.leftJoin(table.definition, eq(table.word.id, table.definition.wordId))
			.limit(params.limit)
			.offset(offset);

		return {
			words: words.map(word => {
				if (!word.definition) {
					return {
						...word,
						definition: 'Fără definiție',
					};
				}

				if (!params.searchInDefinition || !params.search) {
					return {
						...word,
						definition: word.definition!.substring(0,25) + '...',
					}
				}
				let index = word.definition.toLowerCase().indexOf(word.text.toLowerCase());

				let eps = 25;
				let def = '';

				if (index - 25 > 0){
					def+='...';
				}

				def += word.definition!.substring(Math.max(0, index - eps), Math.min(index + eps, word.definition.length));
				if (index + 25 < word.definition.length){
					def+='...';
				}


				return {
					...word,
					definition: def.replaceAll(params.search, `**${params.search}**`),
				}
			}),
			total: counted[0].count
		};
	}
}

