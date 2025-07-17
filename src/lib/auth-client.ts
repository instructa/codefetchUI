import { createAuthClient } from 'better-auth/react';
import { magicLinkClient } from 'better-auth/client/plugins';

/**
 * Client-side authentication setup.
 * This creates the auth client with all necessary plugins.
 */
export const authClient = createAuthClient({
  plugins: [
    magicLinkClient(),
    // Cloudflare client plugin (currently a no-op, but keeps the plugin interface)
    {
      id: 'cloudflare-client',
      // No custom request mutation needed for now
      $InferServerPlugin: {} as any,
      // Currently a no-op, but we could add headers here if needed
      // e.g., for Turnstile tokens or other Cloudflare-specific headers
    },
  ],
});

// Re-export commonly used client methods for convenience
export const { signIn, signUp, signOut, useSession } = authClient;
