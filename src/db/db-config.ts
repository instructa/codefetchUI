import { drizzle } from 'drizzle-orm/d1';
import type { CloudflareEnv } from '../../types/env';
import { schema } from './schema';

/**
 * Get a Drizzle‑ORM client for the **AUTH_DB** D1 database.
 *
 * @param context - The request context containing Cloudflare env bindings
 * @returns Drizzle ORM client instance
 */
export function getDb(context: CloudflareEnv) {
  if (!context?.AUTH_DB) {
    throw new Error(
      'D1 binding "AUTH_DB" is not available – are you running inside the Cloudflare worker?'
    );
  }

  return drizzle(context.AUTH_DB, {
    schema,
    logger: true, // Set to false in production if you don't want query logs
  });
}

// Re‑export Drizzle helpers & project schemas for convenience
export * from 'drizzle-orm';
export * from './schema/auth.schema';
export * from './schema/profile.schema';
export * from './schema';
