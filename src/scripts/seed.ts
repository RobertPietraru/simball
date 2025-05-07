import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { hash } from '@node-rs/argon2';
import postgres from 'postgres';
import * as tables from '$lib/server/db/schema';
if (!process.env.POSTGRES_URL) throw new Error('POSTGRES_URL is not set');
const client = postgres(process.env.POSTGRES_URL, { prepare: false });
export const db = drizzle(client);



async function Auth(db: PostgresJsDatabase) {
  const passwordHash = await hash('password', {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });

  // Insert users
  const [admin] = await db.insert(tables.users).values([
    {
      email: 'admin@pietrocka.com',
      name: 'Robert Pietraru',
      passwordHash: passwordHash,
      roles: ['admin', 'contributor'],
    },
  ]).returning({ id: tables.users.id });

  console.log('Seeding complete!');
  process.exit(0);
}
Auth(db);