import { useEffect, useState } from 'react';

/**
 * Client-side only hook that returns `true` once the component
 * has hydrated on the client. Useful for avoiding mismatch warnings
 * when server-side rendered markup differs.
 */
export function useIsHydrated(): boolean {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}