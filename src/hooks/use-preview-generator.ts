import { useEffect } from 'react';
import { usePreviewStore } from '~/lib/stores/preview.store';
import { useScrapedDataStore, type ScrapedData } from '~/lib/stores/scraped-data.store';
import { useCodefetchFilters } from '~/lib/stores/codefetch-filters.store';

/**
 * Hook to manage preview generation lifecycle
 * This hook bridges the gap between user actions (file selection, filter changes)
 * and the preview generation web worker.
 */
export function usePreviewGenerator() {
  const regeneratePreview = usePreviewStore((state) => state.regeneratePreview);
  const cleanup = usePreviewStore((state) => state.cleanup);

  useEffect(() => {
    // Initial preview generation if data exists
    const scrapedData = useScrapedDataStore.getState().scrapedData;
    if (scrapedData) {
      regeneratePreview();
    }

    // Subscribe to scraped data changes
    const unsubScrapedData = useScrapedDataStore.subscribe((state, prevState) => {
      // Check if scraped data or manual selections changed
      const scrapedDataChanged = state.scrapedData !== prevState.scrapedData;
      const selectionsChanged =
        state.manualSelections.checked.size !== prevState.manualSelections.checked.size ||
        state.manualSelections.unchecked.size !== prevState.manualSelections.unchecked.size ||
        !Array.from(state.manualSelections.checked).every((item) =>
          prevState.manualSelections.checked.has(item)
        ) ||
        !Array.from(state.manualSelections.unchecked).every((item) =>
          prevState.manualSelections.unchecked.has(item)
        );

      // Only regenerate if we have data and something changed
      if (state.scrapedData && (scrapedDataChanged || selectionsChanged)) {
        regeneratePreview();
      }
    });

    // Subscribe to filter changes
    const unsubFilters = useCodefetchFilters.subscribe((state, prevState) => {
      // Check if any filter changed
      const filtersChanged =
        JSON.stringify(state.extensions) !== JSON.stringify(prevState.extensions) ||
        state.customExtensions !== prevState.customExtensions ||
        JSON.stringify(state.includeFiles) !== JSON.stringify(prevState.includeFiles) ||
        JSON.stringify(state.excludeFiles) !== JSON.stringify(prevState.excludeFiles) ||
        JSON.stringify(state.includeDirs) !== JSON.stringify(prevState.includeDirs) ||
        JSON.stringify(state.excludeDirs) !== JSON.stringify(prevState.excludeDirs) ||
        state.selectedPrompt !== prevState.selectedPrompt ||
        state.tokenEncoder !== prevState.tokenEncoder;

      // Only regenerate if we have data and filters changed
      const currentScrapedData = useScrapedDataStore.getState().scrapedData;
      if (currentScrapedData && filtersChanged) {
        regeneratePreview();
      }
    });

    // Cleanup on unmount
    return () => {
      unsubScrapedData();
      unsubFilters();
      cleanup();
    };
  }, [regeneratePreview, cleanup]);
}
