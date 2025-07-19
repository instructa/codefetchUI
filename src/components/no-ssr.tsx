import { useIsomorphicLayoutEffect } from '~/hooks/use-isomorphic-layout-effect';
import { useState, type ReactNode } from 'react';

interface NoSSRProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// This component only renders its children on the client side
// It uses a more efficient approach than the typical mounting pattern
export function NoSSR({ children, fallback = null }: NoSSRProps) {
  const [isClient, setIsClient] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setIsClient(true);
  }, []);

  return <>{isClient ? children : fallback}</>;
}
