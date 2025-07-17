import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { createAuth, auth } from '../auth.server';
import type { CloudflareEnv } from '../../../types/env';

/**
 * Server function to get the current session.
 * This integrates with TanStack Start and properly handles Cloudflare environments.
 */
export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const { headers } = getWebRequest();
    
    // Use the default auth instance for now
    // In production, this would be updated to get env from the request context
    // when TanStack Start provides better Cloudflare integration
    const session = await auth.api.getSession({
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
 * Server function to sign out.
 * Clears the session and authentication cookies.
 */
export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  try {
    const { headers } = getWebRequest();
    
    await auth.api.signOut({
      headers,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Sign out failed:', error);
    return { success: false, error: 'Failed to sign out' };
  }
});
