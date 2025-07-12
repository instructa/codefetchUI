import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useScrapedDataStore } from './scraped-data.store';
import { useCodefetchFilters } from './codefetch-filters.store';

interface PreviewStore {
  previewMarkdown: string;
  tokenCount: number | null;
  isGenerating: boolean;
  error: string | null;
  worker: Worker | null;
  regeneratePreview: () => void;
  cleanup: () => void;
}

export const usePreviewStore = create<PreviewStore>()(
  subscribeWithSelector((set, get) => ({
    previewMarkdown: '',
    tokenCount: null,
    isGenerating: false,
    error: null,
    worker: null,

    regeneratePreview: () => {
      const { worker } = get();
      const scrapedDataState = useScrapedDataStore.getState();
      const filtersState = useCodefetchFilters.getState();

      // Don't generate if no scraped data
      if (!scrapedDataState.scrapedData || !scrapedDataState.metadata) {
        set({ previewMarkdown: '', tokenCount: null, isGenerating: false });
        return;
      }

      set({ isGenerating: true, error: null });

      // Create worker if it doesn't exist
      let currentWorker = worker;
      if (!currentWorker) {
        currentWorker = new Worker(new URL('../../workers/preview.worker.ts', import.meta.url), {
          type: 'module',
        });

        // Set up message handler
        currentWorker.onmessage = (event) => {
          if (event.data.type === 'result') {
            set({
              previewMarkdown: event.data.data.markdown,
              tokenCount: event.data.data.tokenCount,
              isGenerating: false,
              error: null,
            });
          } else if (event.data.type === 'error') {
            set({
              previewMarkdown: '',
              tokenCount: null,
              isGenerating: false,
              error: event.data.error,
            });
          }
        };

        // Handle worker errors
        currentWorker.onerror = (error) => {
          console.error('Worker error:', error);
          set({
            previewMarkdown: '',
            tokenCount: null,
            isGenerating: false,
            error: 'Worker error occurred',
          });
        };

        set({ worker: currentWorker });
      }

      // Send message to worker
      currentWorker.postMessage({
        type: 'generate',
        data: {
          fileTree: scrapedDataState.scrapedData.root,
          filters: {
            extensions: filtersState.extensions,
            customExtensions: filtersState.customExtensions,
            includeFiles: filtersState.includeFiles,
            excludeFiles: filtersState.excludeFiles,
            includeDirs: filtersState.includeDirs,
            excludeDirs: filtersState.excludeDirs,
          },
          manualSelectionsChecked: Array.from(scrapedDataState.manualSelections.checked),
          manualSelectionsUnchecked: Array.from(scrapedDataState.manualSelections.unchecked),
          selectedPrompt: filtersState.selectedPrompt,
          url: scrapedDataState.metadata.url,
          tokenEncoder: filtersState.tokenEncoder,
        },
      });
    },

    cleanup: () => {
      const { worker } = get();
      if (worker) {
        worker.terminate();
        set({ worker: null });
      }
    },
  }))
);

// Subscribe to changes in scraped data and filters
useScrapedDataStore.subscribe(
  (state) => ({
    scrapedData: state.scrapedData,
    manualSelections: state.manualSelections,
  }),
  () => {
    usePreviewStore.getState().regeneratePreview();
  },
  {
    equalityFn: (a, b) =>
      a.scrapedData === b.scrapedData &&
      a.manualSelections.checked.size === b.manualSelections.checked.size &&
      a.manualSelections.unchecked.size === b.manualSelections.unchecked.size &&
      Array.from(a.manualSelections.checked).every((item) =>
        b.manualSelections.checked.has(item)
      ) &&
      Array.from(a.manualSelections.unchecked).every((item) =>
        b.manualSelections.unchecked.has(item)
      ),
  }
);

useCodefetchFilters.subscribe(
  (state) => ({
    extensions: state.extensions,
    customExtensions: state.customExtensions,
    includeFiles: state.includeFiles,
    excludeFiles: state.excludeFiles,
    includeDirs: state.includeDirs,
    excludeDirs: state.excludeDirs,
    selectedPrompt: state.selectedPrompt,
    tokenEncoder: state.tokenEncoder,
  }),
  () => {
    usePreviewStore.getState().regeneratePreview();
  }
);

// Clean up worker on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    usePreviewStore.getState().cleanup();
  });
}
