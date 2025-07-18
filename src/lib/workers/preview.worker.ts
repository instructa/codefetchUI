// Web Worker for generating markdown preview
import { filterFileTree } from '../../utils/filter-file-tree';
import { generateMarkdownFromContent, countTokens, type FileContent } from 'codefetch-sdk/worker';
import type { FileNode } from '../../lib/stores/scraped-data.store';

// Import local prompts
import codegenPrompt from '../prompts/codegen';
import fixPrompt from '../prompts/fix';
import improvePrompt from '../prompts/improve';
import testgenPrompt from '../prompts/testgen';

// Cache for tokenizer data files
const tokenizerDataCache = new Map<string, Response>();

// Wrap the global fetch to cache tokenizer data files
const originalFetch = self.fetch;
self.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url =
    typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

  // Check if this is a tokenizer vocabulary file request
  if (
    url &&
    (url.includes('p50k_base.json') ||
      url.includes('cl100k_base.json') ||
      url.includes('o200k_base.json'))
  ) {
    // Check cache first
    if (tokenizerDataCache.has(url)) {
      console.log(`[Preview Worker] Using cached tokenizer data for: ${url.split('/').pop()}`);
      return tokenizerDataCache.get(url)!.clone();
    }

    console.log(`[Preview Worker] Fetching tokenizer data: ${url.split('/').pop()}`);

    // Fetch and cache
    const response = await originalFetch(input, init);

    // Clone the response before caching (since responses can only be read once)
    const responseToCache = response.clone();
    tokenizerDataCache.set(url, responseToCache);

    return response;
  }

  // For non-tokenizer requests, use original fetch
  return originalFetch(input, init);
};

// Cache for tokenizer initialization
let tokenizerCache: Map<string, any> = new Map();
let tokenizerInitPromises: Map<string, Promise<void>> = new Map();

// Helper function to ensure tokenizer is initialized only once
async function ensureTokenizerInitialized(encoder: string): Promise<void> {
  // If already initialized, return immediately
  if (tokenizerCache.has(encoder)) {
    return;
  }

  // If initialization is in progress, wait for it
  if (tokenizerInitPromises.has(encoder)) {
    return tokenizerInitPromises.get(encoder)!;
  }

  // Start initialization
  const initPromise = (async () => {
    try {
      console.log(`[Preview Worker] Initializing tokenizer: ${encoder}`);
      // Pre-warm the tokenizer by doing a small count
      // This forces the SDK to load the tokenizer data
      await countTokens('test', encoder as any);
      tokenizerCache.set(encoder, true);
      console.log(`[Preview Worker] Tokenizer initialized: ${encoder}`);
    } catch (error) {
      console.error(`[Preview Worker] Failed to initialize tokenizer ${encoder}:`, error);
      throw error;
    } finally {
      tokenizerInitPromises.delete(encoder);
    }
  })();

  tokenizerInitPromises.set(encoder, initPromise);
  return initPromise;
}

// Helper function to convert our FileNode to SDK FileContent
function convertToFileContent(node: FileNode, basePath: string = ''): FileContent[] {
  const files: FileContent[] = [];

  if (node.type === 'file' && node.content) {
    files.push({
      path: node.path,
      content: node.content,
      tokens: node.tokens,
    });
  } else if (node.type === 'directory' && node.children) {
    for (const child of node.children) {
      files.push(...convertToFileContent(child, node.path));
    }
  }

  return files;
}

// Message types
interface GeneratePreviewMessage {
  type: 'generate';
  data: {
    fileTree: FileNode;
    filters: {
      extensions: string[];
      customExtensions: string;
      includeFiles: string[];
      excludeFiles: string[];
      includeDirs: string[];
      excludeDirs: string[];
    };
    manualSelectionsChecked: string[]; // Array instead of Set
    manualSelectionsUnchecked: string[]; // Array instead of Set
    selectedPrompt: string;
    url: string;
    tokenEncoder: string;
  };
}

interface PreviewResultMessage {
  type: 'result';
  data: {
    markdown: string;
    tokenCount: number;
  };
}

interface PreviewErrorMessage {
  type: 'error';
  error: string;
}

// Listen for messages from the main thread
self.addEventListener('message', async (event: MessageEvent<GeneratePreviewMessage>) => {
  if (event.data.type !== 'generate') return;

  try {
    const {
      fileTree,
      filters,
      manualSelectionsChecked,
      manualSelectionsUnchecked,
      selectedPrompt,
      url,
      tokenEncoder,
    } = event.data.data;

    // Ensure tokenizer is initialized before processing
    await ensureTokenizerInitialized(tokenEncoder);

    // Convert arrays back to Sets
    const manualSelections = {
      checked: new Set(manualSelectionsChecked),
      unchecked: new Set(manualSelectionsUnchecked),
    };

    // Get applied extensions
    const customExts = filters.customExtensions
      .split(',')
      .map((ext) => ext.trim())
      .filter((ext) => ext && ext.startsWith('.'));
    const appliedExtensions = [...new Set([...filters.extensions, ...customExts])];

    // Filter the file tree
    const filteredTree = filterFileTree(
      fileTree,
      {
        extensions: appliedExtensions,
        customExtensions: filters.customExtensions,
        includeFiles: filters.includeFiles,
        excludeFiles: filters.excludeFiles,
        includeDirs: filters.includeDirs,
        excludeDirs: filters.excludeDirs,
      },
      manualSelections
    );

    // Check if filteredTree is null
    if (!filteredTree) {
      // Send empty result if no files match filters
      const result: PreviewResultMessage = {
        type: 'result',
        data: {
          markdown:
            '# No files match the current filters\n\nPlease adjust your filters to see content.',
          tokenCount: 0,
        },
      };
      self.postMessage(result);
      return;
    }

    // Generate markdown using FetchResultImpl
    const fileContents = convertToFileContent(filteredTree);
    let markdown = await generateMarkdownFromContent(fileContents, {
      includeTreeStructure: true,
      tokenEncoder: tokenEncoder as any,
    });

    // Apply prompt template if selected
    if (selectedPrompt && selectedPrompt !== 'none') {
      const promptTemplates: Record<string, string> = {
        codegen: codegenPrompt,
        fix: fixPrompt,
        improve: improvePrompt,
        testgen: testgenPrompt,
      };

      const promptTemplate = promptTemplates[selectedPrompt];
      if (promptTemplate) {
        // Replace the {{CURRENT_CODEBASE}} placeholder with the generated markdown
        markdown = promptTemplate.replace('{{CURRENT_CODEBASE}}', markdown);
        // Handle any {{MESSAGE}} placeholder if present (can be empty for now)
        markdown = markdown.replace('{{MESSAGE}}', '');
      }
    }

    // Count tokens (tokenizer should already be cached)
    const tokenCount = await countTokens(markdown, tokenEncoder as any);

    // Send result back to main thread
    const result: PreviewResultMessage = {
      type: 'result',
      data: {
        markdown,
        tokenCount,
      },
    };

    self.postMessage(result);
  } catch (error) {
    // Send error back to main thread
    const errorMessage: PreviewErrorMessage = {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };

    self.postMessage(errorMessage);
  }
});

// Export empty object to make this a module
export {};
