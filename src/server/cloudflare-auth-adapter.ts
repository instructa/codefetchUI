/**
 * Minimal replacement for `better-auth-cloudflare`'s `withCloudflare`.
 * Only the fields used by our app are forwarded to BetterAuth.
 * Extra options are kept for API compatibility but are currently ignored.
 */
import type { IncomingRequestCfProperties } from '@cloudflare/workers-types';
import type { KVNamespace } from '@cloudflare/workers-types';
import type { BetterAuthOptions } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { schema } from '~/db/schema';

export interface CloudflareAdapterEnv {
  /** Cloudflare Workers KV namespace used for session storage */
  kv?: KVNamespace;
  /** Cloudflare D1 database with optional Drizzle options */
  d1?: {
    db: DrizzleD1Database<typeof schema> | any; // Already initialized Drizzle instance from getAuthDb
    options?: {
      /** Whether Drizzle should pluralise table names (passed through) */
      usePlural?: boolean;
      /** Enable verbose query logging */
      debugLogs?: boolean;
    };
  };
  /** Optional CF request metadata; currently unused */
  cf?: IncomingRequestCfProperties;
  /** Compatibility flags (not implemented) */
  autoDetectIpAddress?: boolean;
  geolocationTracking?: boolean;
}

/**
 * Drop-in replacement for `withCloudflare`.
 *
 * ```ts
 * const db = getAuthDb(env); // Get initialized Drizzle instance
 * betterAuth({
 *   ...withCloudflare({ 
 *     kv: env.SESSIONS,
 *     d1: { db, options: { usePlural: true } }
 *   }),
 *   // other BetterAuth options…
 * })
 * ```
 */
export function withCloudflare(
  env: CloudflareAdapterEnv,
  overrides: Partial<BetterAuthOptions> = {},
): Partial<BetterAuthOptions> {
  const authOptions: Partial<BetterAuthOptions> = {};

  // Set up database if D1 is provided
  if (env.d1) {
    // The db is already a Drizzle instance from getAuthDb(), so we use it directly
    authOptions.database = drizzleAdapter(env.d1.db, {
      provider: 'sqlite', // D1 is SQLite-based
      usePlural: env.d1.options?.usePlural,
    });
  }

  // Set up session storage if KV is provided
  // Note: better-auth doesn't have built-in KV support, so we'll need to handle this differently
  // For now, we'll rely on the default session storage (database)
  if (env.kv) {
    // TODO: Implement custom session storage adapter if needed
    // For now, sessions will be stored in the database
  }

  // Merge with any overrides
  return {
    ...authOptions,
    ...overrides,
  };
}