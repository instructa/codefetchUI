import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TokenEncoder = 'cl100k' | 'p50k' | 'r50k' | 'o200k';
export type TokenLimiter = 'truncated' | 'spread';

interface CodefetchFilters {
  // File extensions
  extensions: string[];
  customExtensions: string;

  // Token settings
  maxTokens: number | null;
  tokenEncoder: TokenEncoder;
  tokenLimiter: TokenLimiter;

  // File/Directory patterns
  includeFiles: string[];
  excludeFiles: string[];
  includeDirs: string[];
  excludeDirs: string[];

  // Display options
  projectTreeDepth: number;
  disableLineNumbers: boolean;

  // Actions
  setExtensions: (extensions: string[]) => void;
  setCustomExtensions: (value: string) => void;
  setMaxTokens: (tokens: number | null) => void;
  setTokenEncoder: (encoder: TokenEncoder) => void;
  setTokenLimiter: (limiter: TokenLimiter) => void;
  addIncludeFile: (pattern: string) => void;
  removeIncludeFile: (pattern: string) => void;
  addExcludeFile: (pattern: string) => void;
  removeExcludeFile: (pattern: string) => void;
  addIncludeDir: (pattern: string) => void;
  removeIncludeDir: (pattern: string) => void;
  addExcludeDir: (pattern: string) => void;
  removeExcludeDir: (pattern: string) => void;
  setProjectTreeDepth: (depth: number) => void;
  setDisableLineNumbers: (disable: boolean) => void;
  resetFilters: () => void;
  getAppliedExtensions: () => string[];
  hasModifiedFilters: () => boolean;
}

// Common file extensions for web projects
export const COMMON_EXTENSIONS = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.vue',
  '.svelte',
  '.html',
  '.css',
  '.scss',
  '.sass',
  '.less',
  '.json',
  '.md',
  '.mdx',
  '.yml',
  '.yaml',
  '.py',
  '.java',
  '.cpp',
  '.c',
  '.h',
  '.rs',
  '.go',
  '.php',
  '.rb',
  '.swift',
  '.kt',
];

// Token limit presets for different AI models
export const TOKEN_PRESETS = [
  { label: 'GPT-3.5 (4K)', value: 4000 },
  { label: 'GPT-3.5 (16K)', value: 16000 },
  { label: 'GPT-4 (8K)', value: 8000 },
  { label: 'GPT-4 (32K)', value: 32000 },
  { label: 'GPT-4 (128K)', value: 128000 },
  { label: 'Claude 2 (100K)', value: 100000 },
  { label: 'Claude 3 (200K)', value: 200000 },
  { label: 'No Limit', value: null },
];

// Filter presets for common use cases
export const FILTER_PRESETS = {
  'web-development': {
    name: 'Web Development',
    description: 'JavaScript, TypeScript, CSS, HTML',
    config: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.html', '.json'],
      excludeDirs: ['node_modules/', 'dist/', 'build/', '.next/', '.cache/'],
      projectTreeDepth: 3,
    },
  },
  python: {
    name: 'Python Projects',
    description: 'Python, requirements, configs',
    config: {
      extensions: ['.py', '.pyi', '.pyx', '.ipynb', '.yml', '.yaml', '.toml', '.ini', '.cfg'],
      excludeDirs: ['__pycache__/', '.pytest_cache/', 'venv/', 'env/', '.tox/'],
      excludeFiles: ['*.pyc', '*.pyo'],
      projectTreeDepth: 2,
    },
  },
  documentation: {
    name: 'Documentation Only',
    description: 'Markdown, text, and config files',
    config: {
      extensions: ['.md', '.mdx', '.txt', '.rst', '.adoc', '.yml', '.yaml', '.json'],
      projectTreeDepth: 2,
      disableLineNumbers: true,
    },
  },
  backend: {
    name: 'Backend APIs',
    description: 'Focus on server-side code',
    config: {
      extensions: ['.ts', '.js', '.py', '.java', '.go', '.rs', '.php', '.rb'],
      includeDirs: ['src/', 'api/', 'server/', 'backend/', 'services/'],
      excludeDirs: ['tests/', 'test/', '__tests__/', 'frontend/', 'client/'],
      projectTreeDepth: 3,
    },
  },
  minimal: {
    name: 'Minimal Output',
    description: 'Optimized for small token limits',
    config: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      maxTokens: 4000,
      tokenLimiter: 'truncated' as TokenLimiter,
      projectTreeDepth: 1,
      disableLineNumbers: true,
    },
  },
};

const defaultFilters = {
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  customExtensions: '',
  maxTokens: 100000,
  tokenEncoder: 'cl100k' as TokenEncoder,
  tokenLimiter: 'truncated' as TokenLimiter,
  includeFiles: [],
  excludeFiles: [],
  includeDirs: [],
  excludeDirs: [],
  projectTreeDepth: 2,
  disableLineNumbers: false,
};

export const useCodefetchFilters = create<CodefetchFilters>()(
  persist(
    (set, get) => ({
      ...defaultFilters,

      setExtensions: (extensions) => set({ extensions }),
      setCustomExtensions: (value) => set({ customExtensions: value }),
      setMaxTokens: (tokens) => set({ maxTokens: tokens }),
      setTokenEncoder: (encoder) => set({ tokenEncoder: encoder }),
      setTokenLimiter: (limiter) => set({ tokenLimiter: limiter }),

      addIncludeFile: (pattern) =>
        set((state) => ({
          includeFiles: [...state.includeFiles, pattern],
        })),
      removeIncludeFile: (pattern) =>
        set((state) => ({
          includeFiles: state.includeFiles.filter((p) => p !== pattern),
        })),

      addExcludeFile: (pattern) =>
        set((state) => ({
          excludeFiles: [...state.excludeFiles, pattern],
        })),
      removeExcludeFile: (pattern) =>
        set((state) => ({
          excludeFiles: state.excludeFiles.filter((p) => p !== pattern),
        })),

      addIncludeDir: (pattern) =>
        set((state) => ({
          includeDirs: [...state.includeDirs, pattern],
        })),
      removeIncludeDir: (pattern) =>
        set((state) => ({
          includeDirs: state.includeDirs.filter((p) => p !== pattern),
        })),

      addExcludeDir: (pattern) =>
        set((state) => ({
          excludeDirs: [...state.excludeDirs, pattern],
        })),
      removeExcludeDir: (pattern) =>
        set((state) => ({
          excludeDirs: state.excludeDirs.filter((p) => p !== pattern),
        })),

      setProjectTreeDepth: (depth) =>
        set({
          projectTreeDepth: Math.max(0, Math.min(10, depth)),
        }),
      setDisableLineNumbers: (disable) => set({ disableLineNumbers: disable }),

      resetFilters: () => set(defaultFilters),

      getAppliedExtensions: () => {
        const { extensions, customExtensions } = get();
        const customExts = customExtensions
          .split(',')
          .map((ext) => ext.trim())
          .filter((ext) => ext && ext.startsWith('.'));
        return [...new Set([...extensions, ...customExts])];
      },

      hasModifiedFilters: () => {
        const state = get();
        return (
          JSON.stringify(state.extensions) !== JSON.stringify(defaultFilters.extensions) ||
          state.customExtensions !== defaultFilters.customExtensions ||
          state.maxTokens !== defaultFilters.maxTokens ||
          state.tokenEncoder !== defaultFilters.tokenEncoder ||
          state.tokenLimiter !== defaultFilters.tokenLimiter ||
          state.includeFiles.length > 0 ||
          state.excludeFiles.length > 0 ||
          state.includeDirs.length > 0 ||
          state.excludeDirs.length > 0 ||
          state.projectTreeDepth !== defaultFilters.projectTreeDepth ||
          state.disableLineNumbers !== defaultFilters.disableLineNumbers
        );
      },
    }),
    {
      name: 'codefetch-filters-storage',
    }
  )
);
