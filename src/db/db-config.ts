import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import { schema } from './schema';
import type { D1Database } from '@cloudflare/workers-types';
import type { worker } from '../../alchemy.run';

// Infer the types from alchemy.run.ts
type CloudflareEnv = typeof worker.Env;

type DatabaseName = keyof Pick<CloudflareEnv, 'AUTH_DB' | 'ANALYTICS' | 'DATABASE'>;

function createDbClient(d1: D1Database, dbName: DatabaseName): DrizzleD1Database<typeof schema> {
  if (!d1) {
    throw new Error(
      `D1 binding "${dbName}" is not available – are you running inside the Cloudflare worker?`
    );
  }

  return drizzle(d1, {
    schema,
    // Set to false in production if you don't want query logs
    logger: process.env.NODE_ENV !== 'production',
  });
}

/**
 * Get a Drizzle-ORM client for the **AUTH_DB** D1 database.
 * @param context - The request context containing Cloudflare env bindings
 * @returns Drizzle ORM client instance
 */
export function getAuthDb(context: CloudflareEnv) {
  return createDbClient(context.AUTH_DB, 'AUTH_DB');
}

/**
 * Get a Drizzle-ORM client for the **ANALYTICS** D1 database.
 * @param context - The request context containing Cloudflare env bindings
 * @returns Drizzle ORM client instance
 */
export function getAnalyticsDb(context: CloudflareEnv) {
  return createDbClient(context.ANALYTICS, 'ANALYTICS');
}

/**
 * Get a Drizzle-ORM client for the **DATABASE** D1 database.
 * @param context - The request context containing Cloudflare env bindings
 * @returns Drizzle ORM client instance
 */
export function getMainDb(context: CloudflareEnv) {
  return createDbClient(context.DATABASE, 'DATABASE');
}

// Re‑export Drizzle helpers & project schemas for convenience
export * from 'drizzle-orm';
export * from './schema';
