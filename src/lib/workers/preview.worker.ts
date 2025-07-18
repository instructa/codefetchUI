// Web Worker for generating markdown preview
import { filterFileTree } from '../../utils/filter-file-tree';
import { generateMarkdownFromContent, countTokens, type FileContent } from 'codefetch-sdk/worker';
import type { FileNode } from '../../lib/stores/scraped-data.store';

// Import local prompts
import codegenPrompt from '../prompts/codegen';
import fixPrompt from '../prompts/fix';
import improvePrompt from '../prompts/improve';
import testgenPrompt from '../prompts/testgen';

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
