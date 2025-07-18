/**
 * Minimal replacement for `better-auth-cloudflare`’s `withCloudflare`.
 * Only the fields used by our app are forwarded to BetterAuth.
 * Extra options are kept for API compatibility but are currently ignored.
 */
import type { IncomingRequestCfProperties } from '@cloudflare/workers-types';
import type { KVNamespace, D1Database } from 'alchemy/cloudflare';
import type { BetterAuthOptions } from 'better-auth';

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
  // Only forward what BetterAuth actually understands.
  return {
    kv: env.kv,
    d1: env.d1,
    ...overrides,
  };
}