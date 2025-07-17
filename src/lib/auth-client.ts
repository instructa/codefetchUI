import { createAuthClient } from 'better-auth/react';
import { magicLinkClient } from 'better-auth/client/plugins';
import { cloudflareClient } from './cloudflare-client-plugin';

export const authClient = createAuthClient({
  plugins: [cloudflareClient(), magicLinkClient()],
});
