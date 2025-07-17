// Web Worker for generating markdown preview
import { filterFileTree } from '../../utils/filter-file-tree';
import type { FileNode } from '../../lib/stores/scraped-data.store';

// Simple token counting implementation
async function countTokens(text: string, encoder: string): Promise<number> {
  // Simple approximation: ~4 characters per token for English text
  // This is a rough estimate that works reasonably well
  if (encoder === 'cl100k' || encoder === 'o200k') {
    return Math.ceil(text.length / 4);
  } else if (encoder === 'p50k') {
    return Math.ceil(text.length / 3.5);
  }
  // Default simple word-based counting
  return text.split(/\s+/).length;
}

// Built-in prompts
const prompts = {
  codegen: `You are an expert software developer. Review the following codebase and generate new code based on the requirements.

{{CURRENT_CODEBASE}}

Requirements: {{MESSAGE}}

Generate clean, well-documented code following the patterns and conventions found in the codebase.`,

  fix: `You are an expert software developer. Review the following codebase and fix any issues or bugs.

{{CURRENT_CODEBASE}}

Issue description: {{MESSAGE}}

Provide a detailed fix with explanations.`,

  improve: `You are an expert software developer. Review the following codebase and suggest improvements.

{{CURRENT_CODEBASE}}

Areas to improve: {{MESSAGE}}

Suggest specific improvements for code quality, performance, and maintainability.`,

  testgen: `You are an expert software developer. Review the following codebase and generate comprehensive tests.

{{CURRENT_CODEBASE}}

Testing requirements: {{MESSAGE}}

Generate thorough test cases covering edge cases and main functionality.`,
};

// Simple markdown generator
class SimpleMarkdownGenerator {
  private root: FileNode;
  private url: string;

  constructor(root: FileNode, url: string) {
    this.root = root;
    this.url = url;
  }

  toMarkdown(): string {
    const metadata = this.getMetadata();
    const content = this.generateContent(this.root);

    return `# ${metadata.title}

Source: ${this.url}
Generated: ${new Date().toISOString()}

${content}`;
  }

  private getMetadata() {
    return {
      title: this.root.name || 'Code Repository',
      totalFiles: this.countFiles(this.root),
      totalSize: this.calculateSize(this.root),
    };
  }

  private countFiles(node: FileNode): number {
    if (node.type === 'file') return 1;
    return (node.children || []).reduce((sum, child) => sum + this.countFiles(child), 0);
  }

  private calculateSize(node: FileNode): number {
    if (node.type === 'file') return node.size || 0;
    return (node.children || []).reduce((sum, child) => sum + this.calculateSize(child), 0);
  }

  private generateContent(node: FileNode, depth: number = 0): string {
    const indent = '  '.repeat(depth);

    if (node.type === 'file') {
      let content = `${indent}## ${node.path}\n\n`;
      if (node.content) {
        const language = this.getLanguage(node.name);
        content += `${indent}\`\`\`${language}\n${node.content}\n${indent}\`\`\`\n\n`;
      }
      return content;
    }

    // Directory
    let content = '';
    if (depth > 0) {
      content += `${indent}### ${node.name}/\n\n`;
    }

    for (const child of node.children || []) {
      content += this.generateContent(child, depth + 1);
    }

    return content;
  }

  private getLanguage(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const langMap: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      cs: 'csharp',
      rb: 'ruby',
      go: 'go',
      rs: 'rust',
      php: 'php',
      swift: 'swift',
      kt: 'kotlin',
      scala: 'scala',
      r: 'r',
      md: 'markdown',
      json: 'json',
      yaml: 'yaml',
      yml: 'yaml',
      xml: 'xml',
      html: 'html',
      css: 'css',
      scss: 'scss',
      sass: 'sass',
    };
    return langMap[ext] || 'text';
  }
}

// Helper function to convert our FileNode to SDK FileNode
function convertToSDKFileNode(node: FileNode): any {
  const sdkNode: any = {
    name: node.name,
    path: node.path,
    type: node.type,
    content: node.content,
    language: node.language,
    size: node.size,
    tokens: node.tokens,
    lastModified: node.lastModified,
    children: node.children?.map(convertToSDKFileNode),
  };
  return sdkNode;
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

    // Generate markdown using SimpleMarkdownGenerator
    const markdownGenerator = new SimpleMarkdownGenerator(filteredTree, url);
    let markdown = markdownGenerator.toMarkdown();

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
