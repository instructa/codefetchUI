/**
 * Lightweight client plugin that currently does nothing except satisfy
 * the BetterAuth client plugin contract. Kept in its own file so we
 * can extend it later (e.g. add Turnstile headers).
 */
export function cloudflareClient() {
  return {
    name: 'cloudflare-client',
    // No custom request mutation needed for now.
    onRequest(init: RequestInit) {
      // Currently a no-op, but we could add headers here if needed
      return init;
    },
  };
}