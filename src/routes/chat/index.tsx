import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/chat/')({
  beforeLoad: () => {
    throw redirect({
      to: '/',
    });
  },
});