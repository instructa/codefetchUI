import type { BetterAuthClientPlugin } from 'better-auth/react';

/**
 * Lightweight client plugin that currently does nothing except satisfy
 * the BetterAuth client plugin contract.  Kept in its own file so we
 * can extend it later (e.g. add Turnstile headers).
 */
export function cloudflareClient(): BetterAuthClientPlugin {
  return {
    name: 'cloudflare-client',
    // eslint-disable-next-line @typescript-eslint/require-await
    async onRequest(init) {
      // No custom request mutation needed for now.
      return init;
    },
  };
}