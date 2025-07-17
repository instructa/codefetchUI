/**
 * Minimal replacement for `better-auth-cloudflare`'s `withCloudflare`.
 * Only the fields used by our app are forwarded to BetterAuth.
 * Extra options are kept for API compatibility but are currently ignored.
 */
import type { IncomingRequestCfProperties } from '@cloudflare/workers-types';
import type { KVNamespace, D1Database } from '@cloudflare/workers-types';
import type { BetterAuthOptions } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/d1';
import { schema } from '~/db/schema';

export interface CloudflareAdapterEnv {
  /** Cloudflare Workers KV namespace used for session storage */
  kv?: KVNamespace;
  /** Cloudflare D1 database with optional Drizzle options */
  d1?: {
    db: D1Database;
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
 * betterAuth({
 *   ...withCloudflare({ kv, d1 }),
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
    // Create a Drizzle instance for D1
    const db = drizzle(env.d1.db, {
      schema,
      logger: env.d1.options?.debugLogs,
    });

    // Use the drizzle adapter from better-auth
    authOptions.database = drizzleAdapter(db, {
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