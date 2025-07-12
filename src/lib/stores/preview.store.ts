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

// Clean up worker on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    usePreviewStore.getState().cleanup();
  });
}
