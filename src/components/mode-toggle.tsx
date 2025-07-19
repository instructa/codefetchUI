import { lazy, Suspense } from 'react';

// Dynamically import the client component only on the client side
const ModeToggleClient = lazy(() =>
  import('./mode-toggle.client').then((mod) => ({
    default: mod.ModeToggleClient,
  }))
);

// SSR-friendly placeholder that matches the button dimensions
function ModeTogglePlaceholder() {
  return (
    <div
      className="flex items-center justify-center h-8 w-8 rounded-md border border-input bg-background"
      aria-hidden="true"
    />
  );
}

export function ModeToggle() {
  return (
    <Suspense fallback={<ModeTogglePlaceholder />}>
      <ModeToggleClient />
    </Suspense>
  );
}
