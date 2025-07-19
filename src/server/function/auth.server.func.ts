import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { createAuth } from '../auth.server';
import { env } from 'cloudflare:workers';

/**
 * Server function to get the current session.
 * This integrates with TanStack Start and properly handles Cloudflare environments.
 */
export const getSession = createServerFn({ method: 'GET' }).handler(async ({ context }) => {
  try {
    const { headers } = getWebRequest();

    // Use the imported env directly
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
 * Server function to sign out.
 * Clears the session and cookies.
 */
export const signOut = createServerFn({ method: 'POST' }).handler(async ({ context }) => {
  const { headers } = getWebRequest();

  // Use the imported env directly
  const authInstance = createAuth(env);

  await authInstance.api.signOut({
    headers,
  });

  return { success: true };
});
