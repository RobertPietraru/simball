import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { hash } from '@node-rs/argon2';
import postgres from 'postgres';
import * as tables from '$lib/server/db/schema';
import fs from 'fs';
if (!process.env.POSTGRES_URL) throw new Error('POSTGRES_URL is not set');
const client = postgres(process.env.POSTGRES_URL, { prepare: false });
export const db = drizzle(client);



async function seeding(db: PostgresJsDatabase) {
    const outputJson = fs.readFileSync('output.json', 'utf8');
    const words = JSON.parse(outputJson);
    console.log(words);
    /// empty the table
    await db.delete(tables.word);
    await db.delete(tables.source);
    await db.delete(tables.definition);

    const sources = await db.insert(tables.source).values({
        label: 'Dictionar de simboluri credinte traditionale românești - Romulus Antonescu',
        description: 'Dictionar de simboluri credinte traditionale românești',
        links: ['https://cimec.ro/Etnografie/Antonescu-dictionar/Dictionar-de-Simboluri-Credinte-Traditionale-Romanesti-l-o.html'],
    }).returning({ id: tables.source.id });

    for (const word of words) {
        const x = await db.insert(tables.word).values({
            text: word.label,
        }).returning({ id: tables.word.id });
        const wordId = x[0].id;
        await db.insert(tables.definition).values({
            wordId,
            explanation: word.description,
            sourceId: sources[0].id,
        });
    }


    console.log('Seeding complete!');
    process.exit(0);
}
setTimeout(() => {
    seeding(db);
}, 1);