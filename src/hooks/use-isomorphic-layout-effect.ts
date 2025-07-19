import { useEffect, useLayoutEffect } from 'react';

// This hook uses useLayoutEffect on the client and useEffect on the server
// to avoid SSR warnings and errors
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
