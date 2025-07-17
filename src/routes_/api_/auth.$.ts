import { createServerFileRoute } from '@tanstack/react-start/server';
import { auth } from '~/server/auth.server';

export const ServerRoute = createServerFileRoute('/api/auth/$' as any).methods({
  GET: async ({ request }) => {
    return auth.handler(request);
  },
  POST: async ({ request }) => {
    return auth.handler(request);
  },
});
