import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';
import * as schema from '~/db/schema';

/** Cloudflare Workers `env` type fragment needed by database helper */
export interface HasDB {
  AUTH_DB: D1Database;
}

/** Initialise Drizzle ORM for the edge‑local D1 instance */
export const createDB = (env: HasDB) => drizzle(env.AUTH_DB, { schema });