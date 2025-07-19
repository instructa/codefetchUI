import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { createAuth } from '../auth.server';
import type { CloudflareEnv } from '../../../types/env';

/**
 * Server function to get the current session.
 * This integrates with TanStack Start and properly handles Cloudflare environments.
 */
export const getSession = createServerFn({ method: 'GET' }).handler(async ({ context }) => {
  try {
    const { headers } = getWebRequest();

    // Get env from context when running on Cloudflare
    const env = (context || {}) as CloudflareEnv;
    const authInstance = createAuth(env);

    const session = await authInstance.api.getSession({
      headers,
    });

    if (!session?.user) {
      return null;
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        emailVerified: session.user.emailVerified,
      },
    };
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
});

/**
 * Server function to sign out the user
 */
export const signOut = createServerFn({ method: 'POST' }).handler(async ({ context }) => {
  try {
    const { headers } = getWebRequest();

    // Get env from context when running on Cloudflare
    const env = (context || {}) as CloudflareEnv;
    const authInstance = createAuth(env);

    await authInstance.api.signOut({
      headers,
    });

    return { success: true };
  } catch (error) {
    console.error('Sign out failed:', error);
    return { success: false };
  }
});
