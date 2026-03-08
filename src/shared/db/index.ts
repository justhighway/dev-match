import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) throw new Error('DATABASE_URL is missing');

// 글로벌 싱글톤으로 클라이언트 재사용
const globalForDb = global as typeof global & { pgClient?: postgres.Sql };

const client =
  globalForDb.pgClient ?? postgres(connectionString, { prepare: false });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pgClient = client;
}

export const db = drizzle(client, { schema });
