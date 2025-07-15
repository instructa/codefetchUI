import { createAuthClient } from 'better-auth/react';
import { magicLinkClient } from 'better-auth/client/plugins';
import { cloudflareClient } from 'better-auth-cloudflare/client';

export const authClient = createAuthClient({
  plugins: [cloudflareClient(), magicLinkClient()],
});
