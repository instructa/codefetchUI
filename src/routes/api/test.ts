import { json } from '@tanstack/react-start';
import { createServerFileRoute } from '@tanstack/react-start/server';

export const ServerRoute = createServerFileRoute('/api/test').methods({
  GET: async () => {
    return json({
      message: 'Hello from the test API!',
      timestamp: new Date().toISOString(),
      data: {
        status: 'success',
        value: Math.random() * 100,
      },
    });
  },
});
