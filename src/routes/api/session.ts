import { getWebRequest } from '@tanstack/react-start/server';
import { auth } from '../../server/auth.server';

export const GET = async () => {
  try {
    const { headers } = getWebRequest();
    const session = await auth.api.getSession({
      headers,
    });

    if (!session?.user) {
      return Response.json(null);
    }

    return Response.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        emailVerified: session.user.emailVerified,
      },
    });
  } catch (error) {
    console.error('Session verification failed:', error);
    return Response.json(null);
  }
};
