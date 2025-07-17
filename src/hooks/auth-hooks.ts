import { createAuthHooks } from '@daveyplate/better-auth-tanstack';
import { authClient } from '~/lib/auth-client';

/**
 * Client-side authentication hooks.
 * These hooks integrate BetterAuth with TanStack Query for optimal data fetching.
 * All auth-related UI components should use these hooks.
 */
export const authHooks = createAuthHooks(authClient);

// Export all available hooks for easy access
export const {
  useSession,
  usePrefetchSession,
  useToken,
  useListAccounts,
  useListSessions,
  useListDeviceSessions,
  useListPasskeys,
  useUpdateUser,
  useUnlinkAccount,
  useRevokeOtherSessions,
  useRevokeSession,
  useRevokeSessions,
  useSetActiveSession,
  useRevokeDeviceSession,
  useDeletePasskey,
  useAuthQuery,
  useAuthMutation,
} = authHooks;
