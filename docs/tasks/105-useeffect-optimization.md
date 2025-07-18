# useEffect Optimization Documentation

## Overview
This document outlines the optimization of `useEffect` usage in the codebase to leverage Zustand stores for better performance.

## Completed Optimizations

### 1. **simple-file-tree.tsx** - Filter Change Detection
- **Before**: Used `useEffect` to watch for filter changes
- **After**: Direct state comparison using `useMemo` and `useRef`
- **Benefit**: Eliminates unnecessary effect scheduling and improves performance

```tsx
// Before
useEffect(() => {
  const hasFiltersChanged = JSON.stringify(filters) !== JSON.stringify(prevFilters);
  if (hasFiltersChanged) {
    setManualSelections({ checked: new Set(), unchecked: new Set() });
    setPrevFilters(filters);
  }
}, [filters, prevFilters, setManualSelections]);

// After
const filtersKey = useMemo(() => 
  JSON.stringify({
    extensions: filters.extensions,
    // ... other filter properties
  }), [/* dependencies */]
);

const prevFiltersKey = useRef(filtersKey);
if (prevFiltersKey.current !== filtersKey) {
  setManualSelections({ checked: new Set(), unchecked: new Set() });
  prevFiltersKey.current = filtersKey;
}
```

## Necessary useEffects to Keep

### 1. **DOM Event Listeners** (chat/$url.tsx)
```tsx
useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => { /* ... */ };
  const handleMouseUp = () => { /* ... */ };
  
  if (isResizing) {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
  
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
}, [isResizing]);
```
**Reason**: DOM event listeners must be managed with useEffect for proper cleanup.

### 2. **Store Subscriptions** (use-preview-generator.ts)
```tsx
useEffect(() => {
  const unsubScrapedData = useScrapedDataStore.subscribe((state, prevState) => {
    // React to store changes
  });
  
  const unsubFilters = useCodefetchFilters.subscribe((state, prevState) => {
    // React to filter changes
  });
  
  return () => {
    unsubScrapedData();
    unsubFilters();
    cleanup();
  };
}, [regeneratePreview, cleanup]);
```
**Reason**: Store subscriptions need proper setup and cleanup lifecycle.

### 3. **One-time Client-side Operations** (chat/$url.tsx)
```tsx
useEffect(() => {
  if (typeof window === 'undefined') return;
  
  if (!hasStartedScraping.current && url) {
    hasStartedScraping.current = true;
    startScraping();
  }
}, [url, startScraping]);
```
**Reason**: Ensures scraping starts only once on client-side and handles URL changes.

### 4. **Theme Management** (theme-provider.tsx, mode-toggle.tsx)
```tsx
useEffect(() => {
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}, [theme]);
```
**Reason**: DOM manipulation for theme changes requires effect.

### 5. **Window Event Listeners** (use-mobile.ts)
```tsx
React.useEffect(() => {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  const onChange = () => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
  };
  mql.addEventListener("change", onChange);
  setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
  return () => mql.removeEventListener("change", onChange);
}, []);
```
**Reason**: Media query listeners need proper lifecycle management.

## Best Practices Going Forward

1. **Prefer Direct State Updates**: When reacting to prop/state changes, use direct comparisons instead of useEffect
2. **Use Store Subscriptions**: For cross-component state synchronization, use Zustand subscriptions
3. **Keep Effects for Side Effects Only**: Reserve useEffect for DOM manipulation, event listeners, and external API calls
4. **Leverage Zustand Middleware**: Use subscribeWithSelector for fine-grained reactivity
5. **Use Computed Values**: Replace effects that compute derived state with useMemo or direct calculations

## Performance Benefits

1. **Reduced Re-renders**: Direct state updates avoid the render-effect-render cycle
2. **Better Predictability**: Synchronous state updates are easier to reason about
3. **Improved Performance**: Fewer effect schedulings mean less work for React's reconciler
4. **Cleaner Code**: Less boilerplate and more straightforward logic flow 