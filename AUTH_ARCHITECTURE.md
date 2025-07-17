# Authentication Architecture

This document describes the consolidated authentication setup for the Constructa application with Cloudflare Workers support.

## Overview

The authentication system is built on BetterAuth and is organized into clear server and client boundaries:

### Server-Side (`src/server/`)

#### `auth.server.ts`
The main authentication configuration file that:
- Creates the BetterAuth instance with Cloudflare D1 database support
- Configures email/password authentication with verification
- Sets up social providers (GitHub, Google)
- Implements magic link authentication
- Handles rate limiting
- Provides a `createAuth()` factory function that accepts Cloudflare environment variables
- Exports a `getSession()` helper for direct session retrieval

#### `function/auth.server.func.ts`
TanStack Start server functions that:
- Provide `getSession()` - retrieves the current user session
- Provide `signOut()` - clears the session and cookies
- Integrate with TanStack Start's request context
- Handle Cloudflare environment variables properly

### Client-Side

#### `src/lib/auth-client.ts`
The client authentication setup that:
- Creates the BetterAuth client instance
- Configures magic link plugin
- Includes a Cloudflare client plugin (currently a no-op, ready for future features)
- Exports commonly used methods like `signIn`, `signUp`, `signOut`, `useSession`

#### `src/hooks/auth-hooks.ts`
React hooks for authentication that:
- Integrate BetterAuth with TanStack Query
- Provide all authentication-related hooks
- Handle optimistic updates and caching

## Usage Examples

### Server-Side (in API routes or server functions)
```typescript
import { createAuth } from '~/server/auth.server';

// In a Cloudflare Worker context
export async function handleRequest(request: Request, env: CloudflareEnv) {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  // ...
}
```

### Client-Side (in React components)
```typescript
import { useSession } from '~/hooks/auth-hooks';
import { signIn, signOut } from '~/lib/auth-client';

function MyComponent() {
  const { data: session, isPending } = useSession();
  
  if (isPending) return <div>Loading...</div>;
  if (!session) return <button onClick={() => signIn.social({ provider: 'github' })}>Sign In</button>;
  
  return <div>Welcome {session.user.email}</div>;
}
```

### In TanStack Start Routes
```typescript
import { getSession } from '~/server/function/auth.server.func';

export const Route = createFileRoute('/protected')({
  async beforeLoad() {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: '/auth/signin' });
    }
  },
});
```

## Environment Variables

The following environment variables are used:

- `AUTH_DB` - Cloudflare D1 database binding
- `SESSIONS` - Cloudflare KV namespace for sessions (optional)
- `NODE_ENV` - Environment (production/development)
- `ENABLE_EMAIL_VERIFICATION` - Enable email verification (true/false)
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

## Key Benefits of This Architecture

1. **Clear Separation**: Server and client code are clearly separated
2. **Cloudflare Ready**: Full support for Cloudflare Workers, D1, and KV
3. **Type Safety**: Full TypeScript support throughout
4. **Framework Integration**: Seamless integration with TanStack Start
5. **Extensible**: Easy to add new auth providers or features
6. **Performance**: Optimized with TanStack Query for caching and updates