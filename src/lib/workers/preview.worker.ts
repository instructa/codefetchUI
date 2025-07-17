// Web Worker for generating markdown preview
import { filterFileTree } from '../../utils/filter-file-tree';
import { FetchResultImpl, countTokens, type FileNode as SDKFileNode, type FetchMetadata } from 'codefetch-sdk';
// @ts-ignore - prompts is a default export
import prompts from 'codefetch-sdk/prompts';
import type { FileNode } from '../../lib/stores/scraped-data.store';

// Helper function to convert our FileNode to SDK FileNode
function convertToSDKFileNode(node: FileNode): SDKFileNode {
  const sdkNode: SDKFileNode = {
    name: node.name,
    path: node.path,
    type: node.type,
    content: node.content,
    language: node.language,
    size: node.size,
    tokens: node.tokens,
    lastModified: node.lastModified ? new Date(node.lastModified) : undefined,
    children: node.children?.map(convertToSDKFileNode),
  };
  return sdkNode;
}

// Helper function to count files in the tree
function countFiles(node: FileNode): number {
  if (node.type === 'file') return 1;
  return node.children?.reduce((sum, child) => sum + countFiles(child), 0) || 0;
}

// Helper function to calculate total size
function calculateTotalSize(node: FileNode): number {
  if (node.type === 'file') return node.size || 0;
  return node.children?.reduce((sum, child) => sum + calculateTotalSize(child), 0) || 0;
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
    // Create FetchResultImpl first to get markdown
    const fetchResult = new FetchResultImpl(convertToSDKFileNode(filteredTree), {
      source: url,
      totalFiles: countFiles(filteredTree),
      totalSize: calculateTotalSize(filteredTree),
      totalTokens: 0, // Will be calculated after generating markdown
      fetchedAt: new Date(),
    });
    let markdown = fetchResult.toMarkdown();
    
    // Tokens will be calculated later after applying prompt template

    // Apply prompt template if selected
    if (selectedPrompt && selectedPrompt !== 'none') {
      let promptText = '';

      // Access the prompts directly from the imported object
      if (prompts && typeof prompts === 'object') {
        switch (selectedPrompt) {
          case 'codegen':
            promptText = prompts.codegen || '';
            break;
          case 'fix':
            promptText = prompts.fix || '';
            break;
          case 'improve':
            promptText = prompts.improve || '';
            break;
          case 'testgen':
            promptText = prompts.testgen || '';
            break;
        }
      }

      if (promptText) {
        // Replace template variables
        promptText = promptText.replace('{{CURRENT_CODEBASE}}', markdown);
        promptText = promptText.replace('{{MESSAGE}}', ''); // Empty for now
        markdown = promptText;
      }
    }

    // Count tokens
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
