<file_map>
/Users/kregenrek/projects/codefetchUI
├── src
│   ├── components
│   │   ├── code-search-results.tsx
│   │   ├── codefetch-filters.tsx
│   │   └── simple-file-tree.tsx
│   ├── hooks
│   │   ├── use-interactive-grep.ts
│   │   ├── use-preview-generator.ts
│   │   ├── use-streaming-ast-grep.ts
│   │   └── use-streaming-scrape.ts
│   ├── lib
│   │   └── stores
│   │       ├── codefetch-filters.store.ts
│   │       ├── preview.store.ts
│   │       └── scraped-data.store.ts
│   ├── routes
│   │   ├── api
│   │   │   ├── context.ts
│   │   │   ├── interactive-grep.ts
│   │   │   └── scrape.ts
│   │   └── chat
│   │       └── $url.tsx
│   ├── server
│   │   └── repo-storage.ts
│   ├── utils
│   │   ├── ast-grep-ai.ts
│   │   └── filter-file-tree.ts
│   └── workers
│       └── preview.worker.ts
├── .env.example
├── alchemy.run.ts
└── package.json

</file_map>

<file_contents>
File: /Users/kregenrek/projects/codefetchUI/src/hooks/use-interactive-grep.ts
```ts
import { useCallback, useRef, useState } from 'react';

export interface GrepMatch {
  type: 'match';
  file: string;
  lines: [number, number];
  snippet: string;
  score: number;
}

export interface GrepMetadata {
  type: 'metadata';
  rule: string;
  languages: string[];
  intent?: 'refactor' | 'debug' | 'add' | 'find' | 'other';
  suggestedPaths?: string[];
}

export interface GrepSummary {
  type: 'summary';
  totalFiles: number;
  totalMatches: number;
  wasAiTransformed?: boolean;
  intent?: 'refactor' | 'debug' | 'add' | 'find' | 'other';
}

export interface GrepSuggestion {
  type: 'suggestion';
  path: string;
  reason: string;
}

export type GrepResult = GrepMatch | GrepMetadata | GrepSummary | GrepSuggestion;

interface UseInteractiveGrepReturn {
  searchCode: (prompt: string, repoUrl?: string) => Promise<void>;
  isSearching: boolean;
  results: GrepResult[];
  error: string | null;
  clearResults: () => void;
}

export function useInteractiveGrep(): UseInteractiveGrepReturn {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<GrepResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef(new Map<string, GrepResult[]>());

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  const searchCode = useCallback(async (prompt: string, repoUrl?: string) => {
    const key = `${repoUrl || ''}_${prompt}`;
    if (cache.current.has(key)) {
      setResults(cache.current.get(key)!);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch('/api/interactive-grep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, repoUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Check for ast-grep panic errors
        if (
          (errorData.error && errorData.error.includes('panic')) ||
          errorData.error.includes('MultipleNode')
        ) {
          throw new Error(
            'Invalid search pattern generated. Try rephrasing your query or use direct ast-grep syntax.'
          );
        }

        throw new Error(errorData.error || 'Failed to search code');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      const localResults: GrepResult[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line) as GrepResult;
              localResults.push(data);
            } catch (e) {
              console.error('Failed to parse line:', line, e);
            }
          }
        }
      }

      // Process any remaining data in buffer
      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer) as GrepResult;
          localResults.push(data);
        } catch (e) {
          console.error('Failed to parse final buffer:', buffer, e);
        }
      }

      setResults(localResults);
      cache.current.set(key, localResults);
    } catch (err) {
      console.error('Interactive grep error:', err);

      // Provide more helpful error messages
      if (err instanceof Error) {
        if (err.message.includes('Gemini API key not found')) {
          setError('Please add your Gemini API key to use AI-enhanced search');
        } else if (err.message.includes('Invalid search pattern')) {
          setError(err.message);
        } else if (err.message.includes('Failed to transform prompt')) {
          setError('Failed to understand your query. Try using more specific code-related terms.');
        } else if (err.message.includes('Repository data not found')) {
          setError('Repository not found. Please scrape the repository first.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Search failed');
      }
    } finally {
      setIsSearching(false);
    }
  }, []);

  return {
    searchCode,
    isSearching,
    results,
    error,
    clearResults,
  };
}

```

File: /Users/kregenrek/projects/codefetchUI/src/routes/chat/$url.tsx
```tsx
import { createFileRoute } from '@tanstack/react-router';
import AssistantChat from '~/components/chat/assistant-chat';
import { SimpleFileTree } from '~/components/simple-file-tree';
import { CodefetchFilters } from '~/components/codefetch-filters';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { cn } from '~/lib/utils';
import {
  FileCode,
  Eye,
  X,
  AlertCircle,
  RefreshCw,
  Loader2,
  FolderOpen,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Hash,
} from 'lucide-react';
import { Input } from '~/components/ui/input';
import { isUrl } from '~/utils/is-url';
import { Skeleton } from '~/components/ui/skeleton';
import { useScrapedDataStore } from '~/lib/stores/scraped-data.store';
import { useCodefetchFilters } from '~/lib/stores/codefetch-filters.store';
import { usePreviewStore } from '~/lib/stores/preview.store';
import { useInteractiveGrep } from '~/hooks/use-interactive-grep';
import { useStreamingScrape } from '~/hooks/use-streaming-scrape';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';
import { Badge } from '~/components/ui/badge';
import { FetchResultImpl, FileNode, countTokens } from 'codefetch-sdk';
import prompts from 'codefetch-sdk/prompts';
import { filterFileTree } from '~/utils/filter-file-tree';
import { MarkdownPreview } from '~/components/markdown-preview';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { CodeSearchResults } from '~/components/code-search-results';
import { GeminiApiKeyModal } from '~/components/gemini-api-key-modal';
import {
  getGeminiApiKey,
  isNaturalLanguagePrompt,
  transformPromptToAstGrepRule,
  isVagueQuery,
  validateAstGrepRule,
  createFallbackRule,
  generateAiContext,
} from '~/utils/ast-grep-ai';
import { Settings } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { ScrollArea } from '~/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';

// Custom hook to detect mobile viewport
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    // Initial check for SSR safety
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount (in case SSR initial state was wrong)
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

import { decodeUrlFromRoute } from '~/utils/url-encoding';

export const Route = createFileRoute('/chat/$url')({
  component: ChatRoute,
  validateSearch: (search: Record<string, unknown>): { file?: string } => {
    return {
      file: typeof search.file === 'string' ? search.file : undefined,
    };
  },
  loader: async ({ params }) => {
    try {
      const decodedUrl = decodeUrlFromRoute(params.url);
      if (!isUrl(decodedUrl)) {
        return { isValidUrl: false, url: decodedUrl };
      }
      return { isValidUrl: true, url: decodedUrl };
    } catch (error) {
      console.error('Failed to decode URL:', error);
      return { isValidUrl: false, url: params.url };
    }
  },
  pendingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  onLeave: () => {
    useScrapedDataStore.getState().clearData();
  },
});

function LoadingComponent() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Error Loading Page</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {error.message || 'An unexpected error occurred while loading this page.'}
      </p>
      <Button variant="outline" onClick={() => window.location.reload()}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}

function ChatRoute() {
  const { isValidUrl, url } = Route.useLoaderData();
  const { file: filePath } = Route.useSearch();

  if (!isValidUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Invalid URL</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          The provided URL is not valid. Please check the URL and try again.
        </p>
        <code className="bg-destructive/10 text-destructive px-3 py-2 rounded-md text-sm">
          {url}
        </code>
      </div>
    );
  }

  return <ChatLayout url={url} initialFilePath={filePath} />;
}

function ChatLayout({ url, initialFilePath }: { url: string; initialFilePath?: string }) {
  const isMobile = useIsMobile();
  const [leftPanelWidth, setLeftPanelWidth] = useState(30); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState<'chat' | 'filters' | 'search'>('filters');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [openFiles, setOpenFiles] = useState<Array<{ id: string; name: string; path: string }>>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [codeSearchQuery, setCodeSearchQuery] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [codeSearchWarning, setCodeSearchWarning] = useState<string | null>(null);
  const [isFileTreeCollapsed, setIsFileTreeCollapsed] = useState(true); // For mobile
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false); // For mobile filter sheet
  const [isSearchSheetOpen, setIsSearchSheetOpen] = useState(false); // Added for mobile search sheet
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    searchCode,
    isSearching,
    results: codeSearchResults,
    error: codeSearchError,
    clearResults: clearCodeSearchResults,
  } = useInteractiveGrep();

  // Get store state and actions
  const {
    setScrapedData,
    selectedFilePath,
    setSelectedFilePath,
    getFileByPath,
    scrapedData,
    manualSelections,
    setManualSelections,
  } = useScrapedDataStore();

  const filters = useCodefetchFilters();
  const { selectedPrompt, setSelectedPrompt } = useCodefetchFilters();

  const { previewMarkdown, tokenCount, isGenerating } = usePreviewStore();

  // Reset mobile states when switching between mobile and desktop
  useEffect(() => {
    if (!isMobile) {
      setIsFileTreeCollapsed(true);
      setIsFilterSheetOpen(false);
      setIsSearchSheetOpen(false);
    }
  }, [isMobile]);

  const hasSetInitialFilePath = useRef(false);
  const hasStartedScraping = useRef(false);
  const currentUrlRef = useRef(url);

  // Only run the hook on client side
  const isBrowser = typeof window !== 'undefined';

  const { startScraping, cancel, isLoading, error, progress, metadata } = useStreamingScrape(
    isBrowser ? url : null, // Pass null on server side
    {
      onComplete: (data, meta) => {
        setScrapedData(data, meta);
        if (initialFilePath && !hasSetInitialFilePath.current) {
          setTimeout(() => {
            setSelectedFilePath(initialFilePath);
            hasSetInitialFilePath.current = true;
          }, 0);
        }
      },
      onError: (err) => {
        console.error('[ChatLayout] Scraping error:', err);
      },
    }
  );

  // Start scraping only once per URL
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    // Check if URL has changed
    if (currentUrlRef.current !== url) {
      currentUrlRef.current = url;
      hasStartedScraping.current = false;
      hasSetInitialFilePath.current = false;
    }

    if (!hasStartedScraping.current && url) {
      hasStartedScraping.current = true;
      startScraping();
    }

    // Don't cleanup on every unmount - this causes issues with StrictMode
    // Only cleanup when the component is truly unmounting (URL change or navigation)
  }, [url, startScraping]); // Include startScraping in deps

  useEffect(() => {
    if (initialFilePath && scrapedData && !hasSetInitialFilePath.current) {
      setSelectedFilePath(initialFilePath);
      const file = getFileByPath(initialFilePath);
      if (file) {
        handleFileOpen({ id: file.path, name: file.name, path: file.path });
      }
      hasSetInitialFilePath.current = true;
    }
  }, [initialFilePath, scrapedData, setSelectedFilePath, getFileByPath]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Constrain between 20% and 70%
      if (newWidth >= 20 && newWidth <= 70) {
        setLeftPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Mock function to handle file selection from FileTree
  const handleFileOpen = (file: { id: string; name: string; path: string }) => {
    if (!openFiles.find((f) => f.id === file.id)) {
      setOpenFiles([...openFiles, file]);
    }
    setActiveFileId(file.id);
  };

  const handleFileClose = (fileId: string) => {
    const newFiles = openFiles.filter((f) => f.id !== fileId);
    setOpenFiles(newFiles);
    if (activeFileId === fileId && newFiles.length > 0) {
      setActiveFileId(newFiles[newFiles.length - 1].id);
    } else if (newFiles.length === 0) {
      setActiveFileId(null);
    }
  };

  // Download functionality
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `codebase-${timestamp}.md`;
    downloadFile(previewMarkdown, filename, 'text/markdown');
  };

  const handleDownloadXML = () => {
    // Convert markdown to simple XML structure
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<codebase>
  <source>${url}</source>
  <timestamp>${new Date().toISOString()}</timestamp>
  <content><![CDATA[${previewMarkdown}]]></content>
</codebase>`;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `codebase-${timestamp}.xml`;
    downloadFile(xmlContent, filename, 'application/xml');
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(previewMarkdown);
      setCopiedToClipboard(true);
      setTimeout(() => {
        setCopiedToClipboard(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Handle code search with AI transformation
  /**
   * Handles code search with AI enhancement for all queries.
   *
   * All searches now go through AI for context-aware results:
   * 1. Natural language queries are transformed to ast-grep patterns
   * 2. Direct ast-grep syntax is validated and enhanced with repo context
   * 3. AI generates rich context from the repository structure
   * 4. Fallbacks ensure searches work even if AI fails
   *
   * Examples:
   * - "find all test files" → AI generates context-aware test patterns
   * - "show async functions" → AI finds async function declarations
   * - "test($$$)" → AI validates and enhances with relevant paths
   * - "where are the api endpoints" → AI searches based on repo structure
   */
  const handleCodeSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // Check for stored repo data before searching, fallback to trigger scraping
    if (!scrapedData?.root) {
      if (!isLoading) {
        startScraping();
      }
      console.warn('Waiting for scraping to complete');
      return;
    }

    if (!codeSearchQuery.trim()) return;

    // Clear previous results and warnings before new search
    clearCodeSearchResults();
    setCodeSearchWarning(null);

    // Always use AI - check API key
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }

    try {
      // Generate AI context
      const aiContext = await generateAiContext(scrapedData);

      // Transform prompt to ast-grep rule using AI
      const result = await transformPromptToAstGrepRule(codeSearchQuery, aiContext);

      // Check if any transformations were applied
      if (result.rule && 'pattern' in result.rule && result.rule.pattern) {
        // Check if lowercase metavariables were transformed
        const originalPattern = codeSearchQuery;
        if (originalPattern.includes('$') && /\$[a-z]/.test(originalPattern)) {
          setCodeSearchWarning(
            'Lowercase metavariables were automatically converted to uppercase for compatibility.'
          );
        }
      }

      // Search with the transformed rule
      await searchCode(JSON.stringify(result), url);
    } catch (error) {
      console.error('AI search failed:', error);
      // Error will be handled by the hook and displayed in the UI
    }
  };

  return (
    <>
      {/* Mobile Layout - Hidden on desktop with CSS */}
      <div className="flex md:hidden flex-col h-screen bg-background relative">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-3 border-b bg-background">
          <div className="flex-1 mr-2">
            <h1 className="text-sm font-medium truncate">{metadata?.title || 'Codefetch'}</h1>
            <p className="text-xs text-muted-foreground truncate">{url}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Filter Button */}
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Configure file filters for the codebase</SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                  <CodefetchFilters />
                </div>
              </SheetContent>
            </Sheet>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopyToClipboard} disabled={!previewMarkdown}>
                  <Copy className="mr-2 h-4 w-4" />
                  {copiedToClipboard ? 'Copied!' : 'Copy Markdown'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadMarkdown} disabled={!previewMarkdown}>
                  <Download className="mr-2 h-4 w-4" />
                  Download as MD
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadXML} disabled={!previewMarkdown}>
                  <Download className="mr-2 h-4 w-4" />
                  Download as XML
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Content Area - Now with padding bottom for fixed nav */}
        <div className="flex-1 overflow-hidden mb-14">
          <Tabs
            value={activeRightTab}
            onValueChange={setActiveRightTab}
            className="h-full flex flex-col"
          >
            <TabsContent value="code" className="flex-1 m-0 overflow-hidden">
              <div className="h-full flex flex-col">
                {/* Collapsible File Tree Header */}
                {scrapedData && (
                  <button
                    onClick={() => setIsFileTreeCollapsed(!isFileTreeCollapsed)}
                    className="flex items-center justify-between p-3 border-b bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {activeFileId ? getFileByPath(activeFileId)?.name : 'Select a file'}
                      </span>
                    </div>
                    {isFileTreeCollapsed ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  </button>
                )}

                {/* File Tree (Collapsible) */}
                {!isFileTreeCollapsed && (
                  <div className="border-b max-h-[50vh] overflow-y-auto">
                    {isLoading ? (
                      <div className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Scraping content...</span>
                          </div>
                          <Progress value={progress * 100} className="h-1.5" />
                        </div>
                      </div>
                    ) : error ? (
                      <div className="p-4">
                        <div className="flex flex-col items-center text-center">
                          <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                          <p className="text-sm font-medium">Scraping Failed</p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-3"
                            onClick={() => {
                              hasStartedScraping.current = false;
                              startScraping();
                            }}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Retry
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <SimpleFileTree
                        data={scrapedData?.root}
                        onFileSelect={(file) => {
                          handleFileOpen(file);
                          setIsFileTreeCollapsed(true);
                        }}
                        selectedPath={activeFileId || undefined}
                      />
                    )}
                  </div>
                )}

                {/* Code Content */}
                <div className="flex-1 overflow-y-auto">
                  {activeFileId ? (
                    (() => {
                      const file = getFileByPath(activeFileId);
                      if (!file) return null;

                      return (
                        <div className="p-4">
                          <div className="mb-3">
                            <h2 className="text-lg font-semibold">{file.name}</h2>
                            <p className="text-xs text-muted-foreground">{file.path}</p>
                            <div className="flex gap-2 mt-2">
                              {file.language && (
                                <Badge variant="secondary" className="text-xs">
                                  {file.language}
                                </Badge>
                              )}
                              {file.size && (
                                <Badge variant="outline" className="text-xs">
                                  {(file.size / 1024).toFixed(1)} KB
                                </Badge>
                              )}
                            </div>
                          </div>
                          {file.content ? (
                            <pre className="p-3 bg-muted/50 rounded-md overflow-auto text-xs">
                              <code>{file.content}</code>
                            </pre>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              No content available for this file.
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                      <FolderOpen className="w-12 h-12 mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Tap the file selector above to choose a file
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <div className="p-4">
                  {/* Prompt Selector */}
                  <div className="mb-4">
                    <Select value={selectedPrompt} onValueChange={setSelectedPrompt}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Add prompt" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No prompt</SelectItem>
                        <SelectItem value="codegen">Code Generation</SelectItem>
                        <SelectItem value="fix">Fix Issues</SelectItem>
                        <SelectItem value="improve">Improve Code</SelectItem>
                        <SelectItem value="testgen">Generate Tests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Card className="shadow-none border-0">
                    <CardHeader className="px-0 pt-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">Markdown Preview</CardTitle>
                          <CardDescription className="text-xs">
                            Filtered content from {metadata?.title || url}
                          </CardDescription>
                        </div>
                        {tokenCount !== null && (
                          <div className="text-right">
                            <Badge variant="secondary" className="gap-1">
                              {isGenerating ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Hash className="h-3 w-3" />
                              )}
                              {tokenCount.toLocaleString()} tokens
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {filters.tokenEncoder}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="px-0">
                      <MarkdownPreview content={previewMarkdown} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Fixed Bottom Tab Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
          <div className="grid grid-cols-2 h-14">
            <button
              onClick={() => setActiveRightTab('code')}
              className={cn(
                'flex items-center justify-center h-full transition-colors',
                activeRightTab === 'code' ? 'bg-muted text-foreground' : 'text-muted-foreground'
              )}
            >
              <FileCode className="w-4 h-4 mr-2" />
              Code
            </button>
            <button
              onClick={() => setActiveRightTab('preview')}
              className={cn(
                'flex items-center justify-center h-full transition-colors',
                activeRightTab === 'preview' ? 'bg-muted text-foreground' : 'text-muted-foreground'
              )}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Hidden on mobile with CSS */}
      <div
        ref={containerRef}
        className="hidden md:flex w-screen overflow-visible md:px-2 md:pb-2 flex-row h-full bg-background"
        id="block-panel-group"
        data-panel-group=""
        data-panel-group-direction="horizontal"
        data-panel-group-id="block-panel-group"
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '100%',
          overflow: 'hidden',
          width: '100%',
          cursor: isResizing ? 'col-resize' : 'default',
        }}
      >
        {/* Left Panel - Chat */}
        <div
          className="relative h-full min-w-[300px] border-x-0 border-b-0 bg-background md:border-x md:border-b mr-1 shadow-sm"
          id="block-panel-left"
          data-panel=""
          data-panel-group-id="block-panel-group"
          data-panel-id="block-panel-left"
          data-panel-size={leftPanelWidth}
          style={{
            flex: `${leftPanelWidth} 1 0px`,
            overflow: 'hidden',
          }}
        >
          <div className="relative flex h-full flex-col">
            {/* Tab Header */}
            <div className="flex h-12 items-center gap-2 border-b px-3 bg-muted/30">
              <div className="relative flex w-fit min-w-0 flex-1 items-center gap-2 overflow-x-auto">
                {/* <button
                  className={cn(
                    'group h-7 max-w-56 select-none whitespace-nowrap rounded-md px-3 text-sm font-medium transition-all',
                    activeLeftTab === 'chat'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'hover:bg-muted/50 bg-transparent text-muted-foreground'
                  )}
                  data-active-tab={activeLeftTab === 'chat'}
                  onClick={() => setActiveLeftTab('chat')}
                >
                  <div className="truncate">Chat</div>
                </button> */}
                <button
                  className={cn(
                    'group h-7 max-w-56 select-none whitespace-nowrap rounded-md px-3 text-sm font-medium transition-all',
                    activeLeftTab === 'filters'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'hover:bg-muted/50 bg-transparent text-muted-foreground'
                  )}
                  data-active-tab={activeLeftTab === 'filters'}
                  onClick={() => setActiveLeftTab('filters')}
                >
                  <div className="truncate">Filters</div>
                </button>
                <button
                  className={cn(
                    'group h-7 max-w-56 select-none whitespace-nowrap rounded-md px-3 text-sm font-medium transition-all',
                    activeLeftTab === 'search'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'hover:bg-muted/50 bg-transparent text-muted-foreground'
                  )}
                  data-active-tab={activeLeftTab === 'search'}
                  onClick={() => setActiveLeftTab('search')}
                >
                  <div className="truncate">Code Search</div>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="relative flex h-full min-w-0 flex-1 flex-col">
              {activeLeftTab === 'chat' && (
                <div className="flex-1 overflow-hidden">
                  <AssistantChat />
                </div>
              )}
              {activeLeftTab === 'filters' && (
                <div className="flex-1 overflow-hidden">
                  <CodefetchFilters />
                </div>
              )}
              {activeLeftTab === 'search' && (
                <div className="flex-1 overflow-hidden flex flex-col">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">AI-Enhanced Code Search</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowApiKeyModal(true)}
                        className="h-7 gap-1"
                      >
                        <Settings className="h-3 w-3" />
                        API Key
                      </Button>
                    </div>
                    <form onSubmit={handleCodeSearch} className="flex gap-2">
                      <Input
                        placeholder="e.g., find all async functions, add a new contact page..."
                        value={codeSearchQuery}
                        onChange={(e) => setCodeSearchQuery(e.target.value)}
                        className="flex-1"
                        disabled={isSearching}
                      />
                      <Button type="submit" disabled={!codeSearchQuery.trim() || isSearching}>
                        {isSearching ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </form>
                    {codeSearchQuery && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Using AI to enhance your search query...
                      </p>
                    )}
                    {codeSearchWarning && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-500">
                        <AlertCircle className="h-3 w-3" />
                        <span>{codeSearchWarning}</span>
                      </div>
                    )}
                  </div>
                  <CodeSearchResults
                    results={codeSearchResults}
                    isSearching={isSearching}
                    error={codeSearchError}
                    onRetry={handleCodeSearch}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resize Handle */}
        <div
          className="group z-20 w-0 overflow-visible outline-hidden ring-0 relative"
          role="separator"
          tabIndex={0}
          data-panel-group-direction="horizontal"
          data-panel-group-id="block-panel-group"
          data-resize-handle=""
          data-resize-handle-state={isResizing ? 'drag' : 'inactive'}
          data-panel-resize-handle-enabled="true"
          data-panel-resize-handle-id="resize-handle"
          aria-controls="block-panel-left"
          onMouseDown={handleMouseDown}
          style={{
            touchAction: 'none',
            userSelect: 'none',
            cursor: 'col-resize',
          }}
        >
          <div className="absolute inset-0 h-full w-3 translate-x-[-50%] outline-0 ring-0"></div>
          <div
            className={cn(
              'absolute inset-0 h-full w-0 translate-x-[-50%] outline-0 ring-0 transition-all duration-200',
              isResizing ? 'w-[3px] bg-primary/50' : 'group-hover:w-[3px] group-hover:bg-border',
              'group-data-[resize-handle-active=keyboard]:w-[3px]',
              'group-data-[resize-handle-state=drag]:w-[3px]',
              'group-data-[resize-handle-state=hover]:w-[3px]',
              'group-data-[resize-handle-active=keyboard]:bg-primary/50',
              'group-data-[resize-handle-state=drag]:bg-primary/50',
              'group-data-[resize-handle-state=hover]:bg-border'
            )}
          />
        </div>

        {/* Right Panel - Code Editor and Preview */}
        <div
          className="sticky top-0 h-full min-w-[420px] text-sm z-10 flex-1 bg-background shadow-sm"
          id="block-panel-right"
          data-panel=""
          data-panel-group-id="block-panel-group"
          data-panel-id="block-panel-right"
          data-panel-size={100 - leftPanelWidth}
          style={{
            flex: `${100 - leftPanelWidth} 1 0px`,
            overflow: 'hidden',
          }}
        >
          <div className="h-full w-full border-l flex flex-col">
            {/* Tabs Header */}
            <div className="flex h-12 items-center justify-between border-b bg-muted/30 px-3">
              <Tabs value={activeRightTab} onValueChange={setActiveRightTab} className="w-full">
                <div className="flex items-center justify-between w-full">
                  <TabsList className="h-7 bg-transparent p-0 gap-2">
                    <TabsTrigger
                      value="code"
                      className="h-8 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <FileCode className="w-3.5 h-3.5 mr-1.5" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger
                      value="preview"
                      className="h-8 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={handleCopyToClipboard}
                      disabled={!previewMarkdown}
                    >
                      {copiedToClipboard ? (
                        <Check className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 mr-1" />
                      )}
                      {copiedToClipboard ? 'Copied' : 'Copy'}
                    </Button>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 rounded-r-none border-r-0"
                        onClick={handleDownloadMarkdown}
                        disabled={!previewMarkdown}
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 rounded-l-none"
                            disabled={!previewMarkdown}
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                            >
                              <path
                                d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={handleDownloadMarkdown}>
                            Download as Markdown (.md)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleDownloadXML}>
                            Download as XML (.xml)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Select value={selectedPrompt} onValueChange={setSelectedPrompt}>
                      <SelectTrigger size="sm">
                        <SelectValue placeholder="Add prompt" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No prompt</SelectItem>
                        <SelectItem value="codegen">Code Generation</SelectItem>
                        <SelectItem value="fix">Fix Issues</SelectItem>
                        <SelectItem value="improve">Improve Code</SelectItem>
                        <SelectItem value="testgen">Generate Tests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Tabs>
            </div>

            {/* File Tabs */}
            {openFiles.length > 0 && (
              <div className="flex h-10 items-center border-b overflow-x-auto scrollbar-hide bg-muted/10">
                <div className="flex items-center px-2">
                  {openFiles.map((file) => (
                    <div
                      key={file.id}
                      className={cn(
                        'group flex items-center gap-2 px-3 py-1.5 mr-1 rounded-t cursor-pointer transition-all',
                        'hover:bg-muted/50',
                        activeFileId === file.id && 'bg-background border-b-background'
                      )}
                      onClick={() => setActiveFileId(file.id)}
                      onAuxClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFileClose(file.id);
                      }}
                    >
                      <FileCode className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm whitespace-nowrap">{file.name}</span>
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileClose(file.id);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              <Tabs value={activeRightTab} className="h-full">
                <TabsContent value="code" className="h-full m-0">
                  <div className="h-full flex">
                    {/* File Tree */}
                    <div className="w-64 border-r h-full overflow-y-auto">
                      {isLoading ? (
                        <div className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm">Scraping content...</span>
                            </div>
                            <Progress value={progress * 100} className="h-1.5" />
                            <p className="text-xs text-muted-foreground">
                              {Math.round(progress * 100)}% complete
                            </p>
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-4/5" />
                              <Skeleton className="h-4 w-3/5" />
                            </div>
                          </div>
                        </div>
                      ) : error ? (
                        <div className="p-4">
                          <div className="flex flex-col items-center text-center">
                            <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                            <p className="text-sm font-medium">Scraping Failed</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {error.message || 'Failed to scrape the URL'}
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-3"
                              onClick={() => {
                                hasStartedScraping.current = false;
                                startScraping();
                              }}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Retry
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <SimpleFileTree
                          data={scrapedData?.root}
                          onFileSelect={handleFileOpen}
                          selectedPath={activeFileId || undefined}
                        />
                      )}
                    </div>
                    {/* Code Editor Area */}
                    <div className="flex-1 h-full overflow-y-auto">
                      {isLoading && (
                        <div className="p-6 h-full">
                          <Card className="h-full">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Scraping Content
                              </CardTitle>
                              <CardDescription>
                                {metadata
                                  ? `Fetching from ${metadata.title || url}`
                                  : `Fetching from ${url}`}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <Progress value={progress * 100} className="h-2" />
                                <p className="text-sm text-muted-foreground">
                                  Loading file tree... {Math.round(progress * 100)}%
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      {error && (
                        <div className="p-6 h-full">
                          <Card className="border-destructive h-full">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-5 w-5" />
                                Scraping Failed
                              </CardTitle>
                              <CardDescription>
                                {error instanceof Error
                                  ? error.message
                                  : 'Failed to scrape the URL'}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    URL
                                  </label>
                                  <p className="mt-1 p-3 bg-muted rounded-md font-mono text-sm break-all">
                                    {url}
                                  </p>
                                </div>
                                <Button
                                  onClick={() => {
                                    hasStartedScraping.current = false;
                                    startScraping();
                                  }}
                                  variant="outline"
                                  disabled={isLoading}
                                >
                                  {isLoading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Retrying...
                                    </>
                                  ) : (
                                    <>
                                      <RefreshCw className="mr-2 h-4 w-4" />
                                      Try Again
                                    </>
                                  )}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      {!isLoading && !error && scrapedData && (
                        <>
                          {activeFileId ? (
                            (() => {
                              const file = getFileByPath(activeFileId);
                              if (!file) return null;

                              return (
                                <Card className="h-full flex flex-col m-2 shadow-none border-0">
                                  <CardHeader className="flex-row items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <FileCode className="h-5 w-5 text-primary" />
                                      <div>
                                        <CardTitle className="text-lg">{file.name}</CardTitle>
                                        <CardDescription>{file.path}</CardDescription>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {file.language && (
                                        <Badge variant="secondary">{file.language}</Badge>
                                      )}
                                      {file.size && (
                                        <Badge variant="outline">
                                          {(file.size / 1024).toFixed(1)} KB
                                        </Badge>
                                      )}
                                    </div>
                                  </CardHeader>
                                  <CardContent className="flex-1 overflow-auto pt-0">
                                    {file.content ? (
                                      <pre className="p-4 bg-muted/50 rounded-md overflow-auto h-full text-sm">
                                        <code>{file.content}</code>
                                      </pre>
                                    ) : (
                                      <div className="flex items-center justify-center h-full text-muted-foreground">
                                        No content available for this file.
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              );
                            })()
                          ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                              <div className="text-center">
                                <FolderOpen className="w-12 h-12 mx-auto mb-3" />
                                <p className="text-sm">
                                  {scrapedData
                                    ? 'Select a file to start editing'
                                    : 'No data scraped'}
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="preview" className="h-full m-0">
                  <div className="h-full overflow-auto bg-background">
                    <div className="p-6">
                      <Card className="shadow-none border-0">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                <FileCode className="h-5 w-5" />
                                Markdown Preview
                              </CardTitle>
                              <CardDescription>
                                Filtered content from {metadata?.title || url}
                              </CardDescription>
                            </div>
                            {tokenCount !== null && (
                              <div className="text-right">
                                <Badge variant="secondary" className="gap-1">
                                  {isGenerating ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Hash className="h-3 w-3" />
                                  )}
                                  {tokenCount.toLocaleString()} tokens
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {filters.tokenEncoder} encoder
                                </p>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <MarkdownPreview content={previewMarkdown} />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Gemini API Key Modal */}
        <GeminiApiKeyModal open={showApiKeyModal} onOpenChange={setShowApiKeyModal} />

        {/* Mobile Search Sheet */}
        <Sheet open={isSearchSheetOpen} onOpenChange={setIsSearchSheetOpen}>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>AI-Enhanced Code Search</SheetTitle>
              <SheetDescription>
                All searches are enhanced with AI for better results
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleCodeSearch} className="p-4 border-b flex gap-2">
              <Input
                placeholder="e.g., find all async functions..."
                value={codeSearchQuery}
                onChange={(e) => setCodeSearchQuery(e.target.value)}
                className="flex-1"
                disabled={isSearching}
              />
              <Button type="submit" disabled={!codeSearchQuery.trim() || isSearching}>
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </form>
            <ScrollArea className="h-full p-4">
              <CodeSearchResults
                results={codeSearchResults}
                isSearching={isSearching}
                error={codeSearchError}
                onRetry={handleCodeSearch}
              />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

```

File: /Users/kregenrek/projects/codefetchUI/src/components/code-search-results.tsx
```tsx
import { useState, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  ChevronDown,
  ChevronRight,
  Code,
  FileText,
  Search,
  Plus,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Badge } from '~/components/ui/badge';
import { ScrollArea } from '~/components/ui/scroll-area';
import { cn } from '~/lib/utils';
import type {
  GrepMatch,
  GrepMetadata,
  GrepResult,
  GrepSummary,
  GrepSuggestion,
} from '~/hooks/use-interactive-grep';
import { useIsMobile } from '~/hooks/use-mobile';
import { Button } from '~/components/ui/button';

interface CodeSearchResultsProps {
  results: GrepResult[];
  isSearching: boolean;
  error?: string | null;
  onRetry?: () => void; // Added optional retry callback for error handling
}

export function CodeSearchResults({
  results,
  isSearching,
  error,
  onRetry,
}: CodeSearchResultsProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const parentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const metadata = results.find((r) => r.type === 'metadata') as GrepMetadata | undefined;
  const matches = results.filter((r) => r.type === 'match') as GrepMatch[];
  const summary = results.find((r) => r.type === 'summary') as GrepSummary | undefined;
  const suggestions = results.filter((r) => r.type === 'suggestion') as GrepSuggestion[];

  // Group matches by file
  const matchesByFile = matches.reduce(
    (acc, match) => {
      if (!acc[match.file]) {
        acc[match.file] = [];
      }
      acc[match.file].push(match);
      return acc;
    },
    {} as Record<string, GrepMatch[]>
  );

  // Create file list for virtualizer
  const fileList = Object.entries(matchesByFile);

  // Initialize virtualizer at top level to comply with Rules of Hooks
  const rowVirtualizer = useVirtualizer({
    count: fileList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
  });

  const toggleFile = (file: string) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(file)) {
        next.delete(file);
      } else {
        next.add(file);
      }
      return next;
    });
  };

  const getRelativePath = (fullPath: string) => {
    // Remove common project paths
    return fullPath.replace(/^.\//, '');
  };

  if (isSearching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 animate-pulse" />
            Searching code...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  // Improved error handling with user-friendly message and optional retry button
  if (results.length === 0) {
    if (error) {
      return (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive font-medium mb-2">Search Error</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            {onRetry && (
              <Button onClick={onRetry}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Search
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  return (
    <div className="space-y-4">
      {metadata && (
        // Always show metadata; removed isDevelopment check for broader visibility
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Generated Pattern
              {metadata.intent && (
                <Badge variant="outline" className="text-xs">
                  {metadata.intent}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
              <code>{metadata.rule}</code>
            </pre>
            {metadata.languages && metadata.languages.length > 0 && (
              <div className="mt-2 flex gap-2">
                {metadata.languages.map((lang) => (
                  <Badge key={lang} variant="secondary" className="text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Suggested Locations
            </CardTitle>
            <CardDescription>
              Based on your codebase structure, these are good locations for new files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-muted-foreground" />
                    <code className="text-sm">{suggestion.path}</code>
                  </div>
                  <span className="text-xs text-muted-foreground">{suggestion.reason}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {Object.entries(matchesByFile).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Code Matches
              </span>
              {summary && (
                <span className="text-sm font-normal text-muted-foreground">
                  {summary.totalMatches} matches in {Object.keys(matchesByFile).length} files
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div
              ref={parentRef}
              className={`overflow-auto ${isMobile ? 'h-[300px]' : 'h-[400px]'}`}
            >
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const [file, fileMatches] = fileList[virtualRow.index];
                  const isExpanded = expandedFiles.has(file);
                  const relativePath = getRelativePath(file);
                  return (
                    <div
                      key={virtualRow.key}
                      data-index={virtualRow.index}
                      ref={rowVirtualizer.measureElement}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <Collapsible
                        key={file}
                        open={isExpanded}
                        onOpenChange={() => toggleFile(file)}
                      >
                        <div className="border rounded-lg">
                          <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2 flex-1">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-mono text-left">{relativePath}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {fileMatches.length} {fileMatches.length === 1 ? 'match' : 'matches'}
                            </Badge>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <div className="border-t">
                              {fileMatches.map((match, idx) => (
                                <div
                                  key={`${match.file}-${match.lines[0]}-${idx}`}
                                  className={cn('p-3', idx < fileMatches.length - 1 && 'border-b')}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">
                                      Lines {match.lines[0]}-{match.lines[1]}
                                    </span>
                                  </div>
                                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                    <code>{match.snippet}</code>
                                  </pre>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {summary && Object.keys(matchesByFile).length === 0 && suggestions.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No matches found in {summary.totalFiles} files.
              {summary.wasAiTransformed && (
                <span className="block mt-2 text-sm">
                  Try rephrasing your query or use direct ast-grep syntax like "test($$$)" for test
                  functions.
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

```

File: /Users/kregenrek/projects/codefetchUI/src/lib/stores/codefetch-filters.store.ts
```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TokenEncoder } from 'codefetch-sdk';

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

  // Prompt selection
  selectedPrompt: string;

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
  setSelectedPrompt: (prompt: string) => void;
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
  // Test file extensions
  '.test.ts',
  '.test.tsx',
  '.test.js',
  '.test.jsx',
  '.spec.ts',
  '.spec.tsx',
  '.spec.js',
  '.spec.jsx',
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
  selectedPrompt: 'none',
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
      setSelectedPrompt: (prompt) => set({ selectedPrompt: prompt }),

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
          state.disableLineNumbers !== defaultFilters.disableLineNumbers ||
          state.selectedPrompt !== defaultFilters.selectedPrompt
        );
      },
    }),
    {
      name: 'codefetch-filters-storage',
    }
  )
);

```

File: /Users/kregenrek/projects/codefetchUI/src/components/codefetch-filters.tsx
```tsx
import { useState } from 'react';
import { toast } from 'sonner';
import {
  useCodefetchFilters,
  COMMON_EXTENSIONS,
  TOKEN_PRESETS,
} from '~/lib/stores/codefetch-filters.store';
import { useScrapedDataStore } from '~/lib/stores/scraped-data.store';
import { usePreviewGenerator } from '~/hooks/use-preview-generator';
import type { TokenEncoder } from 'codefetch-sdk';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  FileCode,
  Filter,
  FolderOpen,
  FileText,
  Minus,
  Plus,
  X,
  RotateCcw,
  Settings2,
  Eye,
  Download,
  Upload,
  Settings,
} from 'lucide-react';

/**
 * CodefetchFilters Component
 *
 * Changes made:
 * - Removed Quick Presets section (not useful)
 * - Removed Apply Filters button (store syncs in realtime)
 * - Removed Current Configuration summary
 * - Moved token settings to Display Options behind gear icon
 * - Reordered Display Options with Project Tree Depth first
 */
export function CodefetchFilters() {
  // Initialize preview generator to connect stores and worker
  usePreviewGenerator();

  const filters = useCodefetchFilters();
  const { dynamicExtensions, scrapedData } = useScrapedDataStore();
  const [newIncludeFile, setNewIncludeFile] = useState('');
  const [newExcludeFile, setNewExcludeFile] = useState('');
  const [newIncludeDir, setNewIncludeDir] = useState('');
  const [newExcludeDir, setNewExcludeDir] = useState('');
  const [showAllExtensions, setShowAllExtensions] = useState(false);

  const hasModified = filters.hasModifiedFilters();

  // Use dynamic extensions if available, otherwise fall back to common extensions
  const availableExtensions =
    dynamicExtensions.length > 0 ? dynamicExtensions.map((item) => item.ext) : COMMON_EXTENSIONS;

  // Limit displayed extensions if there are too many
  const MAX_VISIBLE_EXTENSIONS = 15;
  const displayedExtensions = showAllExtensions
    ? availableExtensions
    : availableExtensions.slice(0, MAX_VISIBLE_EXTENSIONS);
  const hasMoreExtensions = availableExtensions.length > MAX_VISIBLE_EXTENSIONS;

  const handleAddPattern = (
    value: string,
    setter: (value: string) => void,
    adder: (pattern: string) => void
  ) => {
    if (value.trim()) {
      adder(value.trim());
      setter('');
    }
  };

  const exportConfig = () => {
    const config = {
      extensions: filters.extensions,
      customExtensions: filters.customExtensions,
      maxTokens: filters.maxTokens,
      tokenEncoder: filters.tokenEncoder,
      tokenLimiter: filters.tokenLimiter,
      includeFiles: filters.includeFiles,
      excludeFiles: filters.excludeFiles,
      includeDirs: filters.includeDirs,
      excludeDirs: filters.excludeDirs,
      projectTreeDepth: filters.projectTreeDepth,
      disableLineNumbers: filters.disableLineNumbers,
    };

    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'codefetch-filters.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast.success('Configuration exported!');
  };

  const importConfig = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const config = JSON.parse(text);

        // Apply imported configuration
        if (config.extensions) filters.setExtensions(config.extensions);
        if (config.customExtensions !== undefined)
          filters.setCustomExtensions(config.customExtensions);
        if (config.maxTokens !== undefined) filters.setMaxTokens(config.maxTokens);
        if (config.tokenEncoder) filters.setTokenEncoder(config.tokenEncoder);
        if (config.tokenLimiter) filters.setTokenLimiter(config.tokenLimiter);
        if (config.projectTreeDepth !== undefined)
          filters.setProjectTreeDepth(config.projectTreeDepth);
        if (config.disableLineNumbers !== undefined)
          filters.setDisableLineNumbers(config.disableLineNumbers);

        // Clear and re-add patterns
        config.includeFiles?.forEach((pattern: string) => filters.addIncludeFile(pattern));
        config.excludeFiles?.forEach((pattern: string) => filters.addExcludeFile(pattern));
        config.includeDirs?.forEach((pattern: string) => filters.addIncludeDir(pattern));
        config.excludeDirs?.forEach((pattern: string) => filters.addExcludeDir(pattern));

        toast.success('Configuration imported successfully!');
      } catch (error) {
        toast.error('Failed to import configuration', {
          description: 'Please ensure the file is a valid JSON configuration.',
        });
      }
    };
    input.click();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Codefetch Filters</h2>
            {hasModified && (
              <Badge variant="secondary" className="text-xs">
                Modified
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={exportConfig}
              title="Export configuration"
              className="h-8 w-8"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={importConfig}
              title="Import configuration"
              className="h-8 w-8"
            >
              <Upload className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                filters.resetFilters();
                toast.info('Filters reset to defaults');
              }}
              className="gap-2"
              disabled={!hasModified}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Configure filters for the codefetch SDK to customize file collection and output
        </p>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* File Extensions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileCode className="h-4 w-4" />
                File Extensions
              </CardTitle>
              <CardDescription>
                {dynamicExtensions.length > 0
                  ? `Found ${dynamicExtensions.length} file types in the project`
                  : scrapedData
                    ? 'No files found in the project'
                    : 'Select which file types to include'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!scrapedData && dynamicExtensions.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  <p>Scrape a project to see file types specific to that codebase</p>
                </div>
              )}

              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-1">
                  {displayedExtensions.map((ext, index) => {
                    const extInfo = dynamicExtensions.find((item) => item.ext === ext);
                    const fileCount = extInfo?.count;

                    return (
                      <label
                        key={ext}
                        className="flex items-center justify-between py-1.5 px-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={filters.extensions.includes(ext)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                filters.setExtensions([...filters.extensions, ext]);
                              } else {
                                filters.setExtensions(filters.extensions.filter((e) => e !== ext));
                              }
                            }}
                            className="h-4 w-4"
                          />
                          <span className="text-sm font-mono">{ext}</span>
                        </div>
                        {fileCount && (
                          <span className="text-xs text-muted-foreground">
                            {fileCount} {fileCount === 1 ? 'file' : 'files'}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </ScrollArea>

              {hasMoreExtensions && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllExtensions(!showAllExtensions)}
                  className="w-full"
                >
                  {showAllExtensions
                    ? `Show less`
                    : `Show ${availableExtensions.length - MAX_VISIBLE_EXTENSIONS} more`}
                </Button>
              )}

              <div className="space-y-2">
                <Label htmlFor="custom-extensions">Custom Extensions</Label>
                <Input
                  id="custom-extensions"
                  placeholder="e.g., .vue, .svelte, .astro (comma-separated)"
                  value={filters.customExtensions}
                  onChange={(e) => filters.setCustomExtensions(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Add custom file extensions separated by commas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* File & Directory Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="h-4 w-4" />
                Pattern Filters
              </CardTitle>
              <CardDescription>Include or exclude specific files and directories</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="files" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="files" className="gap-2">
                    <FileText className="h-3.5 w-3.5" />
                    Files
                  </TabsTrigger>
                  <TabsTrigger value="directories" className="gap-2">
                    <FolderOpen className="h-3.5 w-3.5" />
                    Directories
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="files" className="space-y-4">
                  {/* Include Files */}
                  <div className="space-y-2">
                    <Label>Include Files</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., **/test/*.ts"
                        value={newIncludeFile}
                        onChange={(e) => setNewIncludeFile(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddPattern(
                              newIncludeFile,
                              setNewIncludeFile,
                              filters.addIncludeFile
                            );
                          }
                        }}
                        className="font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          handleAddPattern(
                            newIncludeFile,
                            setNewIncludeFile,
                            filters.addIncludeFile
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filters.includeFiles.map((pattern) => (
                        <Badge key={pattern} variant="secondary" className="gap-1">
                          <span className="font-mono text-xs">{pattern}</span>
                          <button
                            onClick={() => filters.removeIncludeFile(pattern)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Exclude Files */}
                  <div className="space-y-2">
                    <Label>Exclude Files</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., *.test.ts"
                        value={newExcludeFile}
                        onChange={(e) => setNewExcludeFile(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddPattern(
                              newExcludeFile,
                              setNewExcludeFile,
                              filters.addExcludeFile
                            );
                          }
                        }}
                        className="font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          handleAddPattern(
                            newExcludeFile,
                            setNewExcludeFile,
                            filters.addExcludeFile
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filters.excludeFiles.map((pattern) => (
                        <Badge key={pattern} variant="outline" className="gap-1">
                          <span className="font-mono text-xs">{pattern}</span>
                          <button
                            onClick={() => filters.removeExcludeFile(pattern)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="directories" className="space-y-4">
                  {/* Include Directories */}
                  <div className="space-y-2">
                    <Label>Include Directories</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., src/"
                        value={newIncludeDir}
                        onChange={(e) => setNewIncludeDir(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddPattern(
                              newIncludeDir,
                              setNewIncludeDir,
                              filters.addIncludeDir
                            );
                          }
                        }}
                        className="font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          handleAddPattern(newIncludeDir, setNewIncludeDir, filters.addIncludeDir)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filters.includeDirs.map((pattern) => (
                        <Badge key={pattern} variant="secondary" className="gap-1">
                          <span className="font-mono text-xs">{pattern}</span>
                          <button
                            onClick={() => filters.removeIncludeDir(pattern)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Exclude Directories */}
                  <div className="space-y-2">
                    <Label>Exclude Directories</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., node_modules/"
                        value={newExcludeDir}
                        onChange={(e) => setNewExcludeDir(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddPattern(
                              newExcludeDir,
                              setNewExcludeDir,
                              filters.addExcludeDir
                            );
                          }
                        }}
                        className="font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          handleAddPattern(newExcludeDir, setNewExcludeDir, filters.addExcludeDir)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filters.excludeDirs.map((pattern) => (
                        <Badge key={pattern} variant="outline" className="gap-1">
                          <span className="font-mono text-xs">{pattern}</span>
                          <button
                            onClick={() => filters.removeExcludeDir(pattern)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Display Options */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Eye className="h-4 w-4" />
                    Display Options
                  </CardTitle>
                  <CardDescription>Configure how the output is displayed</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Token Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-4 space-y-4">
                      {/* Max Tokens */}
                      <div className="space-y-2">
                        <Label>Max Tokens</Label>
                        <Select
                          value={filters.maxTokens?.toString() || 'null'}
                          onValueChange={(value) => {
                            filters.setMaxTokens(value === 'null' ? null : parseInt(value));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TOKEN_PRESETS.map((preset) => (
                              <SelectItem
                                key={preset.label}
                                value={preset.value?.toString() || 'null'}
                              >
                                {preset.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Custom limit"
                            value={filters.maxTokens || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              filters.setMaxTokens(value ? parseInt(value) : null);
                            }}
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground">tokens</span>
                        </div>
                      </div>

                      {/* Token Encoder */}
                      <div className="space-y-2">
                        <Label>Token Encoder</Label>
                        <Select
                          value={filters.tokenEncoder}
                          onValueChange={(value) => filters.setTokenEncoder(value as TokenEncoder)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simple">simple (All models)</SelectItem>
                            <SelectItem value="p50k">p50k (Davinci models)</SelectItem>
                            <SelectItem value="cl100k">cl100k (GPT-4, GPT-3.5)</SelectItem>
                            <SelectItem value="o200k">o200k (GPT-4o models)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Token Limiter Strategy */}
                      <div className="space-y-2">
                        <Label>Token Limiter Strategy</Label>
                        <div className="space-y-2">
                          <label className="flex items-start space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="tokenLimiter"
                              value="truncated"
                              checked={filters.tokenLimiter === 'truncated'}
                              onChange={() => filters.setTokenLimiter('truncated')}
                              className="mt-0.5"
                            />
                            <div>
                              <span className="text-sm font-medium">Truncated</span>
                              <p className="text-xs text-muted-foreground">
                                Include files until token limit is reached
                              </p>
                            </div>
                          </label>
                          <label className="flex items-start space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="tokenLimiter"
                              value="spread"
                              checked={filters.tokenLimiter === 'spread'}
                              onChange={() => filters.setTokenLimiter('spread')}
                              className="mt-0.5"
                            />
                            <div>
                              <span className="text-sm font-medium">Spread</span>
                              <p className="text-xs text-muted-foreground">
                                Distribute tokens across all files
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Project Tree Depth */}
              <div className="space-y-2">
                <Label>Project Tree Depth</Label>
                <div className="flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => filters.setProjectTreeDepth(filters.projectTreeDepth - 1)}
                    disabled={filters.projectTreeDepth === 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <div className="w-16 text-center">
                    <span className="text-lg font-medium">{filters.projectTreeDepth}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => filters.setProjectTreeDepth(filters.projectTreeDepth + 1)}
                    disabled={filters.projectTreeDepth === 10}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  0 = no tree, higher values show more depth
                </p>
              </div>

              {/* Prompt Selection */}
              <div className="space-y-2">
                <Label>AI Prompt Template</Label>
                <Select value={filters.selectedPrompt} onValueChange={filters.setSelectedPrompt}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a prompt template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No prompt</SelectItem>
                    <SelectItem value="codegen">Code Generation</SelectItem>
                    <SelectItem value="fix">Fix Issues</SelectItem>
                    <SelectItem value="improve">Improve Code</SelectItem>
                    <SelectItem value="testgen">Generate Tests</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Prepend an AI prompt template to the markdown output
                </p>
              </div>

              {/* Line Numbers */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="line-numbers">Disable Line Numbers</Label>
                  <p className="text-xs text-muted-foreground">Hide line numbers in code blocks</p>
                </div>
                <Checkbox
                  id="line-numbers"
                  checked={filters.disableLineNumbers}
                  onCheckedChange={filters.setDisableLineNumbers}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}

```

File: /Users/kregenrek/projects/codefetchUI/src/components/simple-file-tree.tsx
```tsx
import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  FileText,
  FileCode,
  FileJson,
  FileImage,
  Search,
  X,
  CheckSquare,
  Square,
  RotateCcw,
} from 'lucide-react';
import { cn } from '~/lib/utils';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Checkbox } from '~/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { useCodefetchFilters } from '~/lib/stores/codefetch-filters.store';
import { useScrapedDataStore } from '~/lib/stores/scraped-data.store';

// Simple pattern matching function for basic glob patterns
function matchesPattern(filePath: string, pattern: string): boolean {
  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\./g, '\\.')
    .replace(/\*\*/g, '___DOUBLE_STAR___') // Temporarily replace ** to avoid conflict
    .replace(/\*/g, '[^/]*') // Single * matches anything except /
    .replace(/___DOUBLE_STAR___/g, '.*') // ** matches anything including /
    .replace(/\?/g, '.');

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(filePath);
}

// Check if a file matches the codefetch filters
function fileMatchesFilters(
  node: FileNode,
  filters: {
    extensions: string[];
    customExtensions: string;
    includeFiles: string[];
    excludeFiles: string[];
    includeDirs: string[];
    excludeDirs: string[];
  }
): boolean {
  if (node.type === 'directory') return false;

  // Check file extension
  const fileExt = '.' + (node.name.split('.').pop()?.toLowerCase() || '');
  const appliedExtensions = [...filters.extensions];

  // Add custom extensions
  if (filters.customExtensions) {
    const customExts = filters.customExtensions
      .split(',')
      .map((ext) => ext.trim())
      .filter((ext) => ext && ext.startsWith('.'));
    appliedExtensions.push(...customExts);
  }

  // If no extensions are selected, consider all files as not matching
  if (appliedExtensions.length === 0) return false;

  // Check if file extension matches
  let matches = appliedExtensions.includes(fileExt);

  // Check exclude patterns
  if (matches && filters.excludeFiles.length > 0) {
    for (const pattern of filters.excludeFiles) {
      if (matchesPattern(node.path, pattern) || matchesPattern(node.name, pattern)) {
        matches = false;
        break;
      }
    }
  }

  // Check include patterns (overrides extension check if specified)
  if (filters.includeFiles.length > 0) {
    for (const pattern of filters.includeFiles) {
      if (matchesPattern(node.path, pattern) || matchesPattern(node.name, pattern)) {
        matches = true;
        break;
      }
    }
  }

  // Check directory patterns
  const pathParts = node.path.split('/');
  pathParts.pop(); // Remove filename
  const dirPath = pathParts.join('/');

  // Check exclude directories
  if (matches && filters.excludeDirs.length > 0) {
    for (const pattern of filters.excludeDirs) {
      for (let i = 0; i < pathParts.length; i++) {
        const checkPath = pathParts.slice(0, i + 1).join('/') + '/';
        if (matchesPattern(checkPath, pattern) || matchesPattern(pathParts[i] + '/', pattern)) {
          matches = false;
          break;
        }
      }
    }
  }

  // Check include directories
  if (filters.includeDirs.length > 0) {
    let inIncludedDir = false;
    for (const pattern of filters.includeDirs) {
      for (let i = 0; i < pathParts.length; i++) {
        const checkPath = pathParts.slice(0, i + 1).join('/') + '/';
        if (matchesPattern(checkPath, pattern) || matchesPattern(pathParts[i] + '/', pattern)) {
          inIncludedDir = true;
          break;
        }
      }
    }
    if (!inIncludedDir) matches = false;
  }

  return matches;
}

// Get file icon based on file extension
const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
    case 'vue':
    case 'py':
    case 'rb':
    case 'go':
    case 'rs':
    case 'java':
    case 'cpp':
    case 'c':
    case 'h':
    case 'cs':
    case 'php':
      return FileCode;
    case 'json':
    case 'yaml':
    case 'yml':
    case 'toml':
    case 'xml':
      return FileJson;
    case 'md':
    case 'mdx':
    case 'txt':
    case 'rst':
    case 'doc':
    case 'docx':
      return FileText;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'webp':
    case 'ico':
      return FileImage;
    default:
      return File;
  }
};

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  content?: string;
  size?: number;
  language?: string;
  lastModified?: string;
}

interface SimpleFileTreeNodeProps {
  node: FileNode;
  level: number;
  onSelect: (path: string) => void;
  selectedPath?: string;
  expandedPaths: Set<string>;
  toggleExpandedPath: (path: string) => void;
  matchesFilter?: boolean;
  childrenMatchCount?: number;
  manualSelections: {
    checked: Set<string>;
    unchecked: Set<string>;
  };
  onManualSelectionChange: (path: string, isDirectory: boolean) => void;
}

function SimpleFileTreeNode({
  node,
  level,
  onSelect,
  selectedPath,
  expandedPaths,
  toggleExpandedPath,
  matchesFilter = false,
  childrenMatchCount = 0,
  manualSelections,
  onManualSelectionChange,
}: SimpleFileTreeNodeProps) {
  const isExpanded = expandedPaths.has(node.path);
  const isSelected = selectedPath === node.path;
  const hasChildren = node.children && node.children.length > 0;
  const filters = useCodefetchFilters();

  const handleToggle = () => {
    if (node.type === 'directory') {
      toggleExpandedPath(node.path);
    } else {
      onSelect(node.path);
    }
  };

  // Calculate matches for children
  const childMatches = useMemo(() => {
    if (!hasChildren) return [];

    return node.children!.map((child) => {
      const matches = child.type === 'file' ? fileMatchesFilters(child, filters) : false;
      let childCount = 0;

      if (child.children) {
        const counts = child.children.map((grandchild) =>
          grandchild.type === 'file' ? (fileMatchesFilters(grandchild, filters) ? 1 : 0) : 0
        );
        childCount = counts.reduce((a: number, b: number) => a + b, 0);
      }

      return { matches, childCount };
    });
  }, [node.children, filters]);

  // Calculate how many children are actually checked
  const checkedChildrenCount = useMemo(() => {
    if (!hasChildren) return 0;

    const countChecked = (n: FileNode): number => {
      if (n.type === 'file') {
        if (manualSelections.checked.has(n.path)) return 1;
        if (manualSelections.unchecked.has(n.path)) return 0;
        return fileMatchesFilters(n, filters) ? 1 : 0;
      }
      if (n.children) {
        return n.children.reduce((acc, child) => acc + countChecked(child), 0);
      }
      return 0;
    };

    return node.children!.reduce((acc, child) => acc + countChecked(child), 0);
  }, [node.children, filters, manualSelections]);

  // Determine checkbox state
  const getCheckboxState = (): boolean | 'indeterminate' => {
    if (manualSelections.checked.has(node.path)) {
      return true;
    }
    if (manualSelections.unchecked.has(node.path)) {
      return false;
    }
    if (node.type === 'file') {
      return matchesFilter;
    }
    // For directories, check if all/some children are selected
    if (hasChildren) {
      let checkedCount = 0;
      let totalCount = 0;

      const countChildrenState = (n: FileNode): { checked: number; total: number } => {
        if (n.type === 'file') {
          totalCount++;
          if (manualSelections.checked.has(n.path)) {
            checkedCount++;
          } else if (!manualSelections.unchecked.has(n.path) && fileMatchesFilters(n, filters)) {
            checkedCount++;
          }
          return { checked: checkedCount, total: totalCount };
        }
        if (n.children) {
          n.children.forEach((child) => countChildrenState(child));
        }
        return { checked: checkedCount, total: totalCount };
      };

      node.children!.forEach((child) => countChildrenState(child));

      if (checkedCount === totalCount && totalCount > 0) return true;
      if (checkedCount > 0) return 'indeterminate';
      return false;
    }
    return false;
  };

  const checkboxState = getCheckboxState();

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    onManualSelectionChange(node.path, node.type === 'directory');
  };

  // Skip root level rendering, directly render children
  if (level === 0 && hasChildren) {
    return (
      <>
        {node.children?.map((child, index) => (
          <SimpleFileTreeNode
            key={child.path}
            node={child}
            level={level + 1}
            onSelect={onSelect}
            selectedPath={selectedPath}
            expandedPaths={expandedPaths}
            toggleExpandedPath={toggleExpandedPath}
            matchesFilter={childMatches[index]?.matches || false}
            childrenMatchCount={childMatches[index]?.childCount || 0}
            manualSelections={manualSelections}
            onManualSelectionChange={onManualSelectionChange}
          />
        ))}
      </>
    );
  }

  const paddingLeft = `${(level - 1) * 16 + 8}px`;

  if (node.type === 'directory' && hasChildren) {
    return (
      <Collapsible open={isExpanded}>
        <CollapsibleTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            onClick={handleToggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggle();
              }
            }}
            className={cn(
              'flex items-center gap-1.5 w-full hover:bg-accent hover:text-accent-foreground py-1 px-2 text-sm cursor-pointer',
              isSelected && 'bg-accent text-accent-foreground',
              !checkedChildrenCount && 'opacity-70'
            )}
            style={{ paddingLeft }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            )}
            <Checkbox
              checked={checkboxState === true}
              onClick={handleCheckboxChange}
              className="size-3.5 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              aria-label={`Directory selection`}
            />
            {isExpanded ? (
              <FolderOpen className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <Folder className="h-3.5 w-3.5 shrink-0" />
            )}
            <span className="truncate">{node.name}</span>
            {checkedChildrenCount > 0 && (
              <span className="ml-auto mr-1 text-xs text-muted-foreground">
                ({checkedChildrenCount})
              </span>
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {node.children?.map((child, index) => (
            <SimpleFileTreeNode
              key={child.path}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedPath={selectedPath}
              expandedPaths={expandedPaths}
              toggleExpandedPath={toggleExpandedPath}
              matchesFilter={childMatches[index]?.matches || false}
              childrenMatchCount={childMatches[index]?.childCount || 0}
              manualSelections={manualSelections}
              onManualSelectionChange={onManualSelectionChange}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  // File node
  const FileIcon = getFileIcon(node.name);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
      className={cn(
        'flex items-center gap-1.5 w-full hover:bg-accent hover:text-accent-foreground py-1 px-2 text-sm transition-opacity cursor-pointer',
        isSelected && 'bg-accent text-accent-foreground',
        !checkboxState && 'opacity-70'
      )}
      style={{ paddingLeft }}
    >
      <Checkbox
        checked={checkboxState === true}
        onClick={handleCheckboxChange}
        className="size-3.5 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        aria-label={`${node.type === 'directory' ? 'Directory' : 'File'} selection`}
      />
      <FileIcon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{node.name}</span>
    </div>
  );
}

interface SimpleFileTreeProps {
  data?: FileNode;
  onFileSelect: (file: { id: string; name: string; path: string }) => void;
  selectedPath?: string;
}

// Helper function to search files
function searchFiles(node: FileNode, query: string): FileNode[] {
  const results: FileNode[] = [];
  const lowerQuery = query.toLowerCase();

  function traverse(current: FileNode) {
    if (current.name.toLowerCase().includes(lowerQuery)) {
      results.push(current);
    }

    if (current.children) {
      current.children.forEach(traverse);
    }
  }

  if (node.children) {
    node.children.forEach(traverse);
  }

  return results;
}

export function SimpleFileTree({ data, onFileSelect, selectedPath }: SimpleFileTreeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const filters = useCodefetchFilters();
  const [prevFilters, setPrevFilters] = useState(filters);
  const { manualSelections, setManualSelections } = useScrapedDataStore();

  // Reset manual selections when filters change
  useEffect(() => {
    const hasFiltersChanged = JSON.stringify(filters) !== JSON.stringify(prevFilters);
    if (hasFiltersChanged) {
      setManualSelections({ checked: new Set(), unchecked: new Set() });
      setPrevFilters(filters);
    }
  }, [filters, prevFilters, setManualSelections]);

  // Calculate initial matches for root level
  const rootChildMatches = useMemo(() => {
    if (!data?.children) return [];

    return data.children.map((child) => {
      const matches = child.type === 'file' ? fileMatchesFilters(child, filters) : false;
      let childCount = 0;

      const countMatches = (node: FileNode): number => {
        if (node.type === 'file') {
          return fileMatchesFilters(node, filters) ? 1 : 0;
        }
        if (node.children) {
          return node.children.reduce((acc, child) => acc + countMatches(child), 0);
        }
        return 0;
      };

      if (child.children) {
        childCount = countMatches(child);
      }

      return { matches, childCount };
    });
  }, [data, filters]);

  // Count total matches in the entire tree
  const totalFilterMatches = useMemo(() => {
    if (!data) return 0;

    const countMatches = (node: FileNode): number => {
      if (node.type === 'file') {
        return fileMatchesFilters(node, filters) ? 1 : 0;
      }
      if (node.children) {
        return node.children.reduce((acc, child) => acc + countMatches(child), 0);
      }
      return 0;
    };

    return countMatches(data);
  }, [data, filters]);

  // Count selected files (including manual selections)
  const selectedCount = useMemo(() => {
    if (!data) return 0;

    const countSelected = (node: FileNode): number => {
      if (node.type === 'file') {
        if (manualSelections.checked.has(node.path)) return 1;
        if (manualSelections.unchecked.has(node.path)) return 0;
        return fileMatchesFilters(node, filters) ? 1 : 0;
      }
      if (node.children) {
        return node.children.reduce((acc, child) => acc + countSelected(child), 0);
      }
      return 0;
    };

    return countSelected(data);
  }, [data, filters, manualSelections]);

  const toggleExpandedPath = (path: string) => {
    setExpandedPaths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const handleFileSelect = (path: string) => {
    const file = findFileByPath(data, path);
    if (file && file.type === 'file') {
      onFileSelect({
        id: file.path,
        name: file.name,
        path: file.path,
      });
    }
  };

  // Handle manual selection changes
  const handleManualSelectionChange = useCallback(
    (path: string, isDirectory: boolean) => {
      const node = findFileByPath(data, path);
      if (!node) return;

      const newChecked = new Set(manualSelections.checked);
      const newUnchecked = new Set(manualSelections.unchecked);

      // Toggle current node
      const wasManuallyChecked = newChecked.has(path);
      const wasManuallyUnchecked = newUnchecked.has(path);
      const wasFilterChecked = node.type === 'file' ? fileMatchesFilters(node, filters) : false;

      if (wasManuallyChecked) {
        newChecked.delete(path);
        if (!wasFilterChecked) {
          newUnchecked.add(path);
        }
      } else if (wasManuallyUnchecked) {
        newUnchecked.delete(path);
        if (wasFilterChecked) {
          // Return to filter state
        } else {
          newChecked.add(path);
        }
      } else {
        if (wasFilterChecked) {
          newUnchecked.add(path);
        } else {
          newChecked.add(path);
        }
      }

      // If directory, cascade to children
      if (isDirectory && node.children) {
        // Determine if we should check or uncheck all children
        const shouldCheck = newChecked.has(path);

        const cascadeToChildren = (n: FileNode) => {
          if (n.type === 'file') {
            if (shouldCheck) {
              newChecked.add(n.path);
              newUnchecked.delete(n.path);
            } else {
              newUnchecked.add(n.path);
              newChecked.delete(n.path);
            }
          }
          if (n.children) {
            n.children.forEach((child) => cascadeToChildren(child));
          }
        };

        node.children.forEach((child) => cascadeToChildren(child));
      }

      setManualSelections({ checked: newChecked, unchecked: newUnchecked });
    },
    [data, filters, manualSelections, setManualSelections]
  );

  // Select all files
  const handleSelectAll = useCallback(() => {
    if (!data) return;

    const newChecked = new Set<string>();
    const collectAllFiles = (node: FileNode) => {
      if (node.type === 'file') {
        newChecked.add(node.path);
      }
      if (node.children) {
        node.children.forEach(collectAllFiles);
      }
    };

    collectAllFiles(data);
    setManualSelections({ checked: newChecked, unchecked: new Set() });
  }, [data]);

  // Deselect all files
  const handleDeselectAll = useCallback(() => {
    if (!data) return;

    const newUnchecked = new Set<string>();
    const collectAllFiles = (node: FileNode) => {
      if (node.type === 'file') {
        newUnchecked.add(node.path);
      }
      if (node.children) {
        node.children.forEach(collectAllFiles);
      }
    };

    collectAllFiles(data);
    setManualSelections({ checked: new Set(), unchecked: newUnchecked });
  }, [data]);

  // Reset to filter state
  const handleReset = useCallback(() => {
    setManualSelections({ checked: new Set(), unchecked: new Set() });
  }, []);

  const filteredNodes = useMemo(() => {
    if (!data || !searchQuery) return data;

    const results = searchFiles(data, searchQuery);
    if (results.length === 0) return null;

    // Create a filtered tree structure
    const filteredRoot: FileNode = {
      ...data,
      children: results,
    };

    return filteredRoot;
  }, [data, searchQuery]);

  if (!data) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-2 p-2 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">File Explorer</span>
            <Badge variant="default" className="text-xs" title="Total selected files">
              {selectedCount} selected
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={handleReset}
              disabled={
                manualSelections.checked.size === 0 && manualSelections.unchecked.size === 0
              }
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsSearching(!isSearching)}
            >
              <Search className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleSelectAll}>
            <CheckSquare className="h-3 w-3 mr-1" />
            Select All
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleDeselectAll}>
            <Square className="h-3 w-3 mr-1" />
            Deselect All
          </Button>
        </div>
      </div>

      {isSearching && (
        <div className="p-2 border-b">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 text-xs pr-8"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-7 w-7"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {filteredNodes ? (
          <SimpleFileTreeNode
            node={filteredNodes}
            level={0}
            onSelect={handleFileSelect}
            selectedPath={selectedPath}
            expandedPaths={expandedPaths}
            toggleExpandedPath={toggleExpandedPath}
            manualSelections={manualSelections}
            onManualSelectionChange={handleManualSelectionChange}
          />
        ) : (
          <div className="px-3 py-2 text-xs text-muted-foreground">No files found</div>
        )}
      </div>
    </div>
  );
}

// Helper function to find a file by path
function findFileByPath(node: FileNode | undefined, path: string): FileNode | undefined {
  if (!node) return undefined;

  if (node.path === path) return node;

  if (node.children) {
    for (const child of node.children) {
      const found = findFileByPath(child, path);
      if (found) return found;
    }
  }

  return undefined;
}

```

File: /Users/kregenrek/projects/codefetchUI/package.json
```json
{
  "name": "constructa-starter",
  "private": true,
  "sideEffects": false,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "NITRO_PRESET=cloudflare vite build",
    "vercel-build": "NITRO_PRESET=vercel vite build",
    "start": "node .output/server/index.mjs",
    "test": "vitest",
    "test:auth": "vitest tests/auth-integration.test.ts",
    "test:auth:watch": "vitest tests/auth-integration.test.ts --watch",
    "test:scrape": "vitest tests/scrape-api.test.ts",
    "test:scrape:watch": "vitest tests/scrape-api.test.ts --watch",
    "db:pull": "npx drizzle-kit pull",
    "db:generate": "npx drizzle-kit generate",
    "db:migrate": "npx drizzle-kit migrate",
    "db:studio": "npx drizzle-kit studio",
    "lint": "oxlint",
    "lint:fix": "oxlint --fix",
    "auth:init": "npx -y @better-auth/cli@latest generate --config src/server/auth.ts --output src/server/db/auth.schema.ts",
    "ex0": "tsx cli/index.ts",
    "rules:setup": "./scripts/setup-ai-rules.sh",
    "rules:sync": "./scripts/setup-ai-rules.sh",
    "deploy": "bun ./alchemy.run.ts",
    "deploy:dev": "bun --watch ./alchemy.run.ts --dev",
    "deploy:prod": "bun ./alchemy.run.ts --stage prod",
    "deploy:destroy": "bun ./alchemy.run.ts --destroy",
    "deploy:read": "bun ./alchemy.run.ts --read",
    "context:generate": "tsx scripts/generate-code-context.ts"
  },
  "dependencies": {
    "@better-fetch/fetch": "^1.1.18",
    "@clack/prompts": "^0.11.0",
    "@daveyplate/better-auth-tanstack": "^1.3.6",
    "@daveyplate/better-auth-ui": "github:regenrek/better-auth-ui#main",
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/modifiers": "^9.0.0",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@google/generative-ai": "^0.24.1",
    "@hookform/resolvers": "^5.1.1",
    "@mastra/core": "^0.10.5",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@t3-oss/env-core": "^0.13.8",
    "@tanstack/react-query": "^5.82.0",
    "@tanstack/react-query-devtools": "^5.82.0",
    "@tanstack/react-router": "^1.125.6",
    "@tanstack/react-router-devtools": "^1.125.6",
    "@tanstack/react-start": "^1.126.1",
    "@tanstack/react-table": "^8.21.3",
    "@tanstack/react-virtual": "^3.13.12",
    "@types/nodemailer": "^6.4.17",
    "ai": "^4.3.16",
    "ansis": "^4.1.0",
    "better-auth": "^1.2.9",
    "citty": "^0.1.6",
    "clsx": "^2.1.1",
    "codefetch-sdk": "1.6.0",
    "drizzle-kit": "^0.31.1",
    "drizzle-orm": "^0.44.2",
    "fast-glob": "^3.3.3",
    "framer-motion": "^12.16.0",
    "js-yaml": "^4.1.0",
    "lucide-react": "^0.513.0",
    "motion": "^12.16.0",
    "next-themes": "^0.4.6",
    "nodemailer": "^7.0.3",
    "pg": "^8.16.0",
    "postgres": "^3.4.7",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-dropzone": "^14.3.8",
    "react-hook-form": "^7.57.0",
    "recharts": "^2.15.3",
    "resend": "^4.6.0",
    "shadcn-dropzone": "^0.2.1",
    "sonner": "^2.0.5",
    "tailwind-merge": "^3.3.0",
    "tailwindcss": "^4.1.8",
    "tsx": "^4.19.4",
    "unstorage": "^1.16.0",
    "vaul": "^1.1.2",
    "vite": "^6.3.5",
    "zod": "^3.25.56",
    "zustand": "^5.0.6"
  },
  "devDependencies": {
    "@ast-grep/napi": "^0.38.7",
    "@cloudflare/workerd-darwin-arm64": "^1.20250705.0",
    "@napi-rs/cli": "^2.18.4",
    "@tailwindcss/postcss": "^4.1.8",
    "@tailwindcss/vite": "^4.1.8",
    "@tanstack/config": "^0.18.2",
    "@tanstack/react-router-with-query": "^1.125.6",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@types/js-yaml": "^4.0.9",
    "@types/node": "^22.15.30",
    "@types/pg": "^8.15.4",
    "@types/react": "^19.1.6",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^4.5.1",
    "alchemy": "^0.44.1",
    "autoprefixer": "^10.4.21",
    "better-sqlite3": "^11.10.0",
    "class-variance-authority": "^0.7.1",
    "dotenv": "^16.5.0",
    "oxlint": "^1.0.0",
    "prettier": "^3.5.3",
    "shadcn": "^2.6.1",
    "tailwindcss": "^4.1.6",
    "tw-animate-css": "^1.3.4",
    "typescript": "^5.8.3",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^3.2.3"
  },
  "packageManager": "pnpm@9.14.4+sha512.c8180b3fbe4e4bca02c94234717896b5529740a6cbadf19fa78254270403ea2f27d4e1d46a08a0f56c89b63dc8ebfd3ee53326da720273794e6200fcf0d184ab"
}

```

File: /Users/kregenrek/projects/codefetchUI/src/routes/api/scrape.ts
```ts
import { createServerFileRoute } from '@tanstack/react-start/server';
import { fetch as codefetchFetch, type FetchResultImpl } from 'codefetch-sdk/server';
import { universalRateLimiter, type RateLimiterContext } from '~/lib/rate-limiter-wrapper';
import { getApiSecurityConfig } from '~/lib/api-security';
import { storeRepoData } from '~/server/repo-storage';

export const ServerRoute = createServerFileRoute('/api/scrape').methods({
  GET: async ({ request, context }) => {
    const securityConfig = getApiSecurityConfig();

    // Get rate limiter context (KV namespace in production)
    const rateLimiterContext: RateLimiterContext = {
      RATE_LIMIT_KV: (context as any)?.cloudflare?.env?.CACHE,
    };

    // Security check 1: Validate Origin/Referer
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');

    // Dynamically determine the request's origin (same-origin requests)
    const requestOrigin = origin || (referer ? new URL(referer).origin : null);
    const serverOrigin = host
      ? `${request.url.startsWith('https:') ? 'https' : 'http'}://${host}`
      : null;

    // Allow same-origin requests automatically
    const isSameOrigin = requestOrigin && serverOrigin && requestOrigin === serverOrigin;

    // Check against manually configured allowed origins
    const isAllowedOrigin =
      requestOrigin &&
      securityConfig.allowedOrigins.some((allowed) => requestOrigin.startsWith(allowed));

    if (!isSameOrigin && !isAllowedOrigin) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Security check 2: Rate limiting
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!(await universalRateLimiter.isAllowed(clientIp, rateLimiterContext))) {
      const resetTime = await universalRateLimiter.getResetTime(clientIp, rateLimiterContext);
      return Response.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.floor(resetTime / 1000)),
          },
        }
      );
    }

    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return Response.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    try {
      // In Cloudflare Workers, always disable filesystem cache
      const isWorkerEnvironment = (context as any)?.cloudflare?.env;

      // Get GitHub token from environment if available
      const githubToken = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;

      const codefetch = (await codefetchFetch({
        source: targetUrl,
        format: 'json',
        noCache: isWorkerEnvironment ? true : undefined,
        ...(githubToken && { githubToken }),
      } as any)) as FetchResultImpl;

      // Check if result is valid
      if (typeof codefetch === 'string' || !('root' in codefetch)) {
        return Response.json({ error: 'Invalid response from codefetch' }, { status: 500 });
      }

      // Store the repository data for later searches
      try {
        await storeRepoData(targetUrl, {
          root: codefetch.root,
          metadata: (codefetch as any).metadata,
        });
      } catch (error) {
        console.error('Failed to store repository data:', error);
        // Continue even if storage fails
      }

      // Create a readable stream that sends data in chunks
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            // Send metadata first
            const metadata = {
              type: 'metadata',
              data: {
                url: targetUrl,
                scrapedAt: new Date().toISOString(),
                title: (codefetch as any).metadata?.gitRepo || 'Scraped Content',
                description: `Source: ${(codefetch as any).metadata?.source || targetUrl}`,
                totalFiles: (codefetch as any).metadata?.totalFiles,
                totalSize: (codefetch as any).metadata?.totalSize,
                totalTokens: (codefetch as any).metadata?.totalTokens,
              },
            };
            controller.enqueue(encoder.encode(JSON.stringify(metadata) + '\n'));

            // Function to process tree nodes in chunks
            const processNode = async (node: any, parentPath: string = '') => {
              const { children, ...nodeData } = node;

              // Send node data with content but without children
              const chunk = {
                type: 'node',
                data: {
                  ...nodeData,
                  parentPath,
                  hasChildren: !!(children && children.length > 0),
                },
              };
              controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'));

              // Process children recursively
              if (children && Array.isArray(children)) {
                for (const child of children) {
                  await processNode(child, node.path);
                }
              }
            };

            // Process the root node
            await processNode(codefetch.root);

            // Send completion signal
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'complete' }) + '\n'));
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      // Return streaming response with rate limit headers
      const remaining = await universalRateLimiter.getRemainingRequests(
        clientIp,
        rateLimiterContext
      );
      const resetTime = await universalRateLimiter.getResetTime(clientIp, rateLimiterContext);

      return new Response(stream, {
        headers: {
          'Content-Type': 'application/x-ndjson',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(Math.floor(resetTime / 1000)),
        },
      });
    } catch (error) {
      console.error('Error in scrape API:', error);
      return Response.json({ error: 'Failed to scrape URL' }, { status: 500 });
    }
  },
});

```

File: /Users/kregenrek/projects/codefetchUI/src/lib/stores/preview.store.ts
```ts
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

```

File: /Users/kregenrek/projects/codefetchUI/src/lib/stores/scraped-data.store.ts
```ts
import { create } from 'zustand';
import { computeFileExtensions } from '~/utils/filter-file-tree';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  language?: string;
  size?: number;
  tokens?: number;
  lastModified?: string;
  children?: FileNode[];
}

export interface ScrapedData {
  root: FileNode;
}

export interface ScrapedDataMetadata {
  url: string;
  scrapedAt: string;
  title?: string;
  description?: string;
}

export interface DynamicExtension {
  ext: string;
  count: number;
}

interface ScrapedDataStore {
  scrapedData: ScrapedData | null;
  metadata: ScrapedDataMetadata | null;
  selectedFilePath: string | null;
  searchQuery: string;
  expandedPaths: Set<string>;
  urlExpandedPaths: Map<string, Set<string>>; // Store expanded paths per URL
  dynamicExtensions: DynamicExtension[]; // Dynamic extensions from the scraped data
  manualSelections: { checked: Set<string>; unchecked: Set<string> }; // Manual file selections
  setScrapedData: (data: ScrapedData | null, metadata: ScrapedDataMetadata | null) => void;
  setSelectedFilePath: (path: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleExpandedPath: (path: string) => void;
  clearData: () => void;
  getFileByPath: (path: string) => FileNode | null;
  loadExpandedPathsForUrl: (url: string) => void;
  saveExpandedPathsForUrl: (url: string) => void;
  setManualSelections: (selections: { checked: Set<string>; unchecked: Set<string> }) => void;
}

const STORAGE_KEY = 'scraped-data-expanded-paths';

// Helper to get/set from localStorage
const getStoredExpandedPaths = (): Map<string, Set<string>> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Map();

    const parsed = JSON.parse(stored);
    const map = new Map<string, Set<string>>();

    Object.entries(parsed).forEach(([url, paths]) => {
      map.set(url, new Set(paths as string[]));
    });

    return map;
  } catch {
    return new Map();
  }
};

const saveStoredExpandedPaths = (map: Map<string, Set<string>>) => {
  try {
    const obj: Record<string, string[]> = {};
    map.forEach((paths, url) => {
      obj[url] = Array.from(paths);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {
    // Ignore localStorage errors
  }
};

export const useScrapedDataStore = create<ScrapedDataStore>((set, get) => ({
  scrapedData: null,
  metadata: null,
  selectedFilePath: null,
  searchQuery: '',
  expandedPaths: new Set<string>(),
  urlExpandedPaths: getStoredExpandedPaths(),
  dynamicExtensions: [],
  manualSelections: { checked: new Set(), unchecked: new Set() },

  setScrapedData: (data, metadata) => {
    const state = get();
    const currentUrl = state.metadata?.url;

    // Only reset selectedFilePath if we're switching to a different URL
    const shouldResetSelectedFile = currentUrl !== metadata?.url;

    // Save current expanded paths before switching
    if (currentUrl && state.expandedPaths.size > 0) {
      state.saveExpandedPathsForUrl(currentUrl);
    }

    // Compute dynamic extensions from the new data
    const dynamicExtensions = data ? computeFileExtensions(data.root) : [];

    set({
      scrapedData: data,
      metadata,
      selectedFilePath: shouldResetSelectedFile ? null : state.selectedFilePath,
      searchQuery: '',
      expandedPaths: new Set<string>(), // Will be loaded in loadExpandedPathsForUrl
      dynamicExtensions,
    });

    // Load expanded paths for the new URL
    if (metadata?.url) {
      get().loadExpandedPathsForUrl(metadata.url);
    }
  },

  setSelectedFilePath: (path) => {
    set({ selectedFilePath: path });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  toggleExpandedPath: (path) => {
    set((state) => {
      const newExpandedPaths = new Set(state.expandedPaths);
      if (newExpandedPaths.has(path)) {
        newExpandedPaths.delete(path);
      } else {
        newExpandedPaths.add(path);
      }

      // Save to localStorage immediately
      if (state.metadata?.url) {
        const urlPaths = state.urlExpandedPaths;
        urlPaths.set(state.metadata.url, newExpandedPaths);
        saveStoredExpandedPaths(urlPaths);
      }

      return { expandedPaths: newExpandedPaths };
    });
  },

  clearData: () => {
    const state = get();

    // Save current expanded paths before clearing
    if (state.metadata?.url && state.expandedPaths.size > 0) {
      state.saveExpandedPathsForUrl(state.metadata.url);
    }

    set({
      scrapedData: null,
      metadata: null,
      selectedFilePath: null,
      searchQuery: '',
      expandedPaths: new Set<string>(),
    });
  },

  getFileByPath: (path) => {
    const { scrapedData } = get();
    if (!scrapedData) return null;

    const findFile = (node: FileNode, targetPath: string): FileNode | null => {
      if (node.path === targetPath) return node;

      if (node.children) {
        for (const child of node.children) {
          const found = findFile(child, targetPath);
          if (found) return found;
        }
      }

      return null;
    };

    return findFile(scrapedData.root, path);
  },

  loadExpandedPathsForUrl: (url) => {
    set((state) => {
      const storedPaths = state.urlExpandedPaths.get(url);
      return {
        expandedPaths: storedPaths ? new Set(storedPaths) : new Set<string>(),
      };
    });
  },

  saveExpandedPathsForUrl: (url) => {
    set((state) => {
      const newUrlPaths = new Map(state.urlExpandedPaths);
      newUrlPaths.set(url, new Set(state.expandedPaths));
      saveStoredExpandedPaths(newUrlPaths);
      return { urlExpandedPaths: newUrlPaths };
    });
  },

  setManualSelections: (selections) => {
    set({ manualSelections: selections });
  },
}));

// Helper function to search files
export const searchFiles = (node: FileNode, query: string): FileNode[] => {
  const results: FileNode[] = [];
  const lowerQuery = query.toLowerCase();

  const search = (currentNode: FileNode) => {
    if (currentNode.name.toLowerCase().includes(lowerQuery)) {
      results.push(currentNode);
    }

    if (currentNode.children) {
      currentNode.children.forEach(search);
    }
  };

  search(node);
  return results;
};

```

File: /Users/kregenrek/projects/codefetchUI/src/routes/api/context.ts
```ts
import { createServerFileRoute } from '@tanstack/react-start/server';
import { parse } from '@ast-grep/napi';
import * as fs from 'fs/promises';
import * as path from 'path';
import glob from 'fast-glob';
import * as yaml from 'js-yaml';

interface AstGrepRule {
  id: string;
  languages: string[];
  message?: string;
  severity?: string;
  pattern: string;
  holes?: Record<string, any>;
  metadata?: {
    bucket?: string;
  };
}

interface ContextItem {
  file: string;
  lines: [number, number];
  snippet: string;
  bucket: string | null;
  score: number;
  rule?: string;
}

interface RankedMatch {
  path: string;
  match: string;
  range: {
    start: { line: number };
    end: { line: number };
  };
  metadata?: {
    bucket?: string;
  };
  rule?: string;
  score: number;
}

const bucketsForIntent = (intent: string): string[] => {
  switch (intent) {
    case 'api':
      return ['api'];
    case 'model':
      return ['model'];
    case 'ui':
      return ['ui'];
    default:
      return ['api', 'model', 'ui'];
  }
};

const scoreMatch = (m: RankedMatch, resource: string, buckets: string[]): number => {
  let score = 0;
  if (m.path.includes(resource)) score += 3;
  if (m.metadata && buckets.includes(m.metadata.bucket as string)) score += 2;
  return score;
};

const bumpDuplicateScores = (matches: RankedMatch[]) => {
  const seen = new Map<string, number>();
  matches.forEach((m) => {
    const count = (seen.get(m.path) ?? 0) + 1;
    seen.set(m.path, count);
    if (count > 1) m.score += 1;
  });
};

const loadRules = async (rulesDir: string): Promise<AstGrepRule[]> => {
  const rules: AstGrepRule[] = [];
  try {
    const ruleFiles = await glob('*.yml', { cwd: rulesDir, absolute: true });

    for (const ruleFile of ruleFiles) {
      const content = await fs.readFile(ruleFile, 'utf-8');
      const rule = yaml.load(content) as AstGrepRule;
      if (rule) {
        rules.push(rule);
      }
    }
  } catch (error) {
    console.error('Error loading rules:', error);
  }

  return rules;
};

const getLanguageFromFile = (filePath: string): string | null => {
  const ext = path.extname(filePath).toLowerCase();
  const langMap: Record<string, string> = {
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.mjs': 'javascript',
    '.cjs': 'javascript',
  };
  return langMap[ext] || null;
};

const processFile = async (
  filePath: string,
  rules: AstGrepRule[],
  resource: string
): Promise<RankedMatch[]> => {
  const matches: RankedMatch[] = [];

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const language = getLanguageFromFile(filePath);

    if (!language) return matches;

    // Parse the file content with ast-grep
    const sg = parse(language, content);

    for (const rule of rules) {
      if (!rule.languages.includes(language)) continue;

      // Apply pattern with environment variables
      let pattern = rule.pattern;
      if (resource) {
        pattern = pattern.replace(/\$RESOURCE/g, resource);
      }

      // Find all matches for this rule
      const root = sg.root();
      const nodes = root.findAll(pattern);

      for (const node of nodes) {
        const range = node.range();
        const match: RankedMatch = {
          path: filePath,
          match: node.text(),
          range: {
            start: { line: range.start.row },
            end: { line: range.end.row },
          },
          metadata: rule.metadata,
          rule: rule.id,
          score: 0,
        };
        matches.push(match);
      }
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }

  return matches;
};

export const ServerRoute = createServerFileRoute('/api/context').methods({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const resource = url.searchParams.get('resource')?.trim();
    const intent = url.searchParams.get('intent')?.trim() || 'api';

    if (!resource) {
      return Response.json(
        { error: 'Query params "resource" and "intent" required.' },
        { status: 400 }
      );
    }

    try {
      // Load all rules from the rules directory
      const rulesDir = path.join(process.cwd(), '.ast-grep/rules');
      const rules = await loadRules(rulesDir);

      // Find all source files
      const sourceFiles = await glob(
        [
          'src/**/*.{ts,tsx,js,jsx,mjs,cjs}',
          'scripts/**/*.{ts,tsx,js,jsx,mjs,cjs}',
          '!**/node_modules/**',
          '!**/.git/**',
          '!**/dist/**',
          '!**/build/**',
        ],
        {
          cwd: process.cwd(),
          absolute: true,
        }
      );

      // Process all files and collect matches
      const allMatches: RankedMatch[] = [];
      const buckets = bucketsForIntent(intent);

      for (const file of sourceFiles) {
        const fileMatches = await processFile(file, rules, resource);

        // Score and add matches
        fileMatches.forEach((match) => {
          match.score = scoreMatch(match, resource, buckets);
          allMatches.push(match);
        });
      }

      // Bump scores for duplicates
      bumpDuplicateScores(allMatches);

      // Sort by score
      allMatches.sort((a, b) => b.score - a.score);

      // Stream NDJSON
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          allMatches.forEach((m) => {
            const contextItem: ContextItem = {
              file: m.path,
              lines: [m.range.start.line + 1, m.range.end.line + 1],
              snippet: m.match,
              bucket: m.metadata?.bucket ?? null,
              score: m.score,
              rule: m.rule,
            };

            controller.enqueue(encoder.encode(JSON.stringify(contextItem) + '\n'));
          });
          controller.close();
        },
      });

      return new Response(stream, {
        headers: { 'Content-Type': 'application/x-ndjson' },
      });
    } catch (err) {
      console.error('[api/context] failed:', err);
      return Response.json({ error: 'Context generation failed.' }, { status: 500 });
    }
  },
});

```

File: /Users/kregenrek/projects/codefetchUI/src/routes/api/interactive-grep.ts
```ts
import { createServerFileRoute } from '@tanstack/react-start/server';
import { parse } from '@ast-grep/napi';
import * as path from 'path';
import { getRepoData } from '~/server/repo-storage';

interface ContextItem {
  file: string;
  lines: [number, number];
  snippet: string;
  score: number;
}

interface GeneratedRule {
  pattern: string;
  language?: string[];
}

interface AiTransformResult {
  rule: {
    pattern: string;
    languages?: string[];
    kind?: string;
  };
  suggestedPaths?: string[];
  intent: 'refactor' | 'debug' | 'add' | 'find' | 'other';
}

async function generateAstGrepRule(prompt: string): Promise<GeneratedRule | null> {
  // Check if the prompt is already an AI-transformed result
  try {
    const parsed = JSON.parse(prompt) as AiTransformResult;
    if (parsed.rule && parsed.rule.pattern) {
      return {
        pattern: parsed.rule.pattern,
        language: parsed.rule.languages,
      };
    }
  } catch {
    // Not JSON, continue with original logic
  }

  // For now, we'll use a simple pattern matching approach
  // In a real implementation, this would call an LLM API

  const patterns: Record<string, GeneratedRule> = {
    'async function': {
      pattern: 'async function $FUNC($$$ARGS) { $$$BODY }',
      language: ['javascript', 'typescript'],
    },
    'react component': {
      pattern: 'function $COMPONENT($$$ARGS) { $$$BODY return $JSX }',
      language: ['javascript', 'typescript'],
    },
    usestate: {
      pattern: 'const [$STATE, $SETTER] = useState($$$)',
      language: ['javascript', 'typescript'],
    },
    'api route': {
      pattern: 'router.$METHOD($PATH, $$$)',
      language: ['javascript', 'typescript'],
    },
    class: {
      pattern: 'class $CLASS { $$$BODY }',
      language: ['javascript', 'typescript'],
    },
    import: {
      pattern: 'import $$$IMPORTS from $MODULE',
      language: ['javascript', 'typescript'],
    },
    export: {
      pattern: 'export $$$DECL',
      language: ['javascript', 'typescript'],
    },
    'arrow function': {
      pattern: 'const $FUNC = ($$$ARGS) => $BODY',
      language: ['javascript', 'typescript'],
    },
    'try catch': {
      pattern: 'try { $$$TRY } catch ($ERR) { $$$CATCH }',
      language: ['javascript', 'typescript'],
    },
  };

  // Simple keyword matching for demo purposes
  const lowerPrompt = prompt.toLowerCase();

  for (const [key, rule] of Object.entries(patterns)) {
    if (lowerPrompt.includes(key)) {
      return rule;
    }
  }

  // Default pattern if no match - extract keywords and search for them
  const words = lowerPrompt.split(/\s+/).filter((word) => word.length > 2);
  const keyword = words.find((w) => !['want', 'need', 'find', 'show', 'get'].includes(w)) || 'code';

  return {
    pattern: keyword, // Search for the keyword as a literal string
    language: ['javascript', 'typescript'],
  };
}

function getLanguageFromFile(filePath: string): string | null {
  const ext = path.extname(filePath).toLowerCase();
  const langMap: Record<string, string> = {
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.mjs': 'javascript',
    '.cjs': 'javascript',
  };
  return langMap[ext] || null;
}

async function processRepoFileWithPattern(
  file: any,
  pattern: string,
  allowedLanguages?: string[],
  parentPath: string = ''
): Promise<ContextItem[]> {
  const matches: ContextItem[] = [];

  // Build full path
  const fullPath = parentPath ? `${parentPath}/${file.name}` : file.name;

  if (file.type === 'file' && file.content) {
    const language = getLanguageFromFile(file.name);

    if (language && (!allowedLanguages || allowedLanguages.includes(language))) {
      try {
        // Parse the file content with ast-grep
        const sg = parse(language, file.content);
        const root = sg.root();
        const nodes = root.findAll(pattern);

        for (const node of nodes) {
          const range = node.range();
          // ast-grep uses 'line' property, not 'row'
          const match: ContextItem = {
            file: fullPath,
            lines: [(range.start as any).line + 1, (range.end as any).line + 1],
            snippet: node.text(),
            score: 1,
          };
          matches.push(match);
        }
      } catch (error) {
        console.error(`Error processing file ${fullPath}:`, error);
      }
    }
  } else if (file.type === 'directory' && file.children) {
    // Recursively process children
    for (const child of file.children) {
      const childMatches = await processRepoFileWithPattern(
        child,
        pattern,
        allowedLanguages,
        fullPath
      );
      matches.push(...childMatches);
    }
  }

  return matches;
}

export const ServerRoute = createServerFileRoute('/api/interactive-grep').methods({
  POST: async ({ request }) => {
    try {
      const body = await request.json();
      const { prompt, repoUrl } = body;

      if (!prompt || typeof prompt !== 'string') {
        return Response.json(
          { error: 'Invalid request. "prompt" field is required.' },
          { status: 400 }
        );
      }

      // Repository URL is required
      if (!repoUrl || typeof repoUrl !== 'string') {
        return Response.json(
          { error: 'Invalid request. "repoUrl" field is required.' },
          { status: 400 }
        );
      }

      // Get stored repository data
      const repoData = await getRepoData(repoUrl);
      if (!repoData) {
        return Response.json(
          { error: 'Repository data not found. Please fetch the repository first.' },
          { status: 404 }
        );
      }

      // Parse AI-transformed result if present
      let aiResult: AiTransformResult | null = null;
      try {
        const parsed = JSON.parse(prompt);
        if (parsed.rule && parsed.intent) {
          aiResult = parsed as AiTransformResult;
        }
      } catch {
        // Not AI-transformed, continue with normal flow
      }

      // Generate ast-grep rule from prompt
      const rule = await generateAstGrepRule(prompt);

      if (!rule) {
        return Response.json(
          { error: 'Failed to generate ast-grep rule from prompt.' },
          { status: 500 }
        );
      }

      // Create streaming response
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // Send the generated rule as metadata first
          const metadata = {
            type: 'metadata',
            rule: rule.pattern,
            languages: rule.language || ['javascript', 'typescript'], // Ensure languages is always defined
            ...(aiResult && {
              intent: aiResult.intent,
              suggestedPaths: aiResult.suggestedPaths,
            }),
          };

          controller.enqueue(encoder.encode(JSON.stringify(metadata) + '\n'));

          // Process files and stream results
          let totalMatches = 0;
          let totalFiles = 0;

          // Search through repository data
          const matches = await processRepoFileWithPattern(
            repoData.root,
            rule.pattern,
            rule.language
          );

          for (const match of matches) {
            totalMatches++;
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  type: 'match',
                  ...match,
                }) + '\n'
              )
            );
          }

          // Count total files in repo
          const countFiles = (node: any): number => {
            if (node.type === 'file') return 1;
            if (node.children) {
              return node.children.reduce((sum: number, child: any) => sum + countFiles(child), 0);
            }
            return 0;
          };
          totalFiles = countFiles(repoData.root);

          // If AI suggested paths for additions and no matches found
          if (aiResult?.suggestedPaths && totalMatches === 0 && aiResult.intent === 'add') {
            for (const suggestedPath of aiResult.suggestedPaths) {
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    type: 'suggestion',
                    path: suggestedPath,
                    reason: 'Suggested location for new file',
                  }) + '\n'
                )
              );
            }
          }

          // Send summary
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: 'summary',
                totalFiles: totalFiles,
                totalMatches,
                ...(aiResult && {
                  wasAiTransformed: true,
                  intent: aiResult.intent,
                }),
              }) + '\n'
            )
          );

          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'application/x-ndjson',
          'Cache-Control': 'no-cache',
        },
      });
    } catch (err) {
      console.error('[api/interactive-grep] failed:', err);
      return Response.json({ error: 'Interactive grep failed.' }, { status: 500 });
    }
  },
});

```

File: /Users/kregenrek/projects/codefetchUI/alchemy.run.ts
```ts
import alchemy from 'alchemy';
import { R2Bucket, KVNamespace, D1Database, Worker } from 'alchemy/cloudflare';
import { config } from 'dotenv';

// Load environment variables
config();

// Check for Cloudflare credentials
if (!process.env.CLOUDFLARE_API_TOKEN) {
  console.error('❌ Missing CLOUDFLARE_API_TOKEN!');
  console.error('\nYou can create an API token at: https://dash.cloudflare.com/profile/api-tokens');
  console.error('Required permissions:');
  console.error('  - Account:Cloudflare Workers:Edit');
  console.error('  - Account:D1:Edit');
  console.error('  - Zone:Workers Routes:Edit (if using custom domains)');
  process.exit(1);
}

// Debug: Log that env vars are loaded
console.log('✅ API Token loaded:', process.env.CLOUDFLARE_API_TOKEN.substring(0, 10) + '...');

if (!process.env.CLOUDFLARE_ACCOUNT_ID) {
  console.error('❌ Missing CLOUDFLARE_ACCOUNT_ID!');
  console.error('\nFind your account ID at: https://dash.cloudflare.com/ (in the right sidebar)');
  process.exit(1);
}

// Check for Alchemy password for secret encryption
if (!process.env.ALCHEMY_PASSWORD) {
  console.error('❌ Missing ALCHEMY_PASSWORD!');
  console.error('This is required for encrypting secrets.');
  console.error('Add ALCHEMY_PASSWORD=your-secure-password to your .env file');
  process.exit(1);
}

// Get stage from environment or CLI
const stage = process.env.STAGE || 'dev';

// Create the app with password for secret encryption
const app = await alchemy('codefetch-ui', {
  stage,
  password: process.env.ALCHEMY_PASSWORD,
  // We'll add R2 state store configuration later after creating the bucket
});

console.log(`🚀 Deploying CodeFetch UI to stage: ${app.stage}`);
console.log(`📦 Phase: ${app.phase}`);

// Create R2 bucket for state storage (we'll use this in a future update)
const stateBucket = await R2Bucket('state-store', {
  name: `codefetch-ui-state-${app.stage}`,
  adopt: true, // Adopt existing bucket if it exists
});

// Create R2 bucket for file uploads/storage if needed
const uploadsBucket = await R2Bucket('uploads', {
  name: `codefetch-ui-uploads-${app.stage}`,
  adopt: true,
});

// Create KV namespace for sessions and cache
const sessionsKV = await KVNamespace('sessions', {
  title: `CodeFetch UI Sessions - ${app.stage}`,
  adopt: true,
});

const cacheKV = await KVNamespace('cache', {
  title: `CodeFetch UI Cache - ${app.stage}`,
  adopt: true,
});

// Create D1 database for application data
const database = await D1Database('main-db', {
  name: `codefetch-ui-db-${app.stage}`,
  adopt: true,
});

// Analytics database for logging and metrics
const analyticsDb = await D1Database('analytics', {
  name: `codefetch-ui-analytics-${app.stage}`,
  adopt: true,
});

// Prepare encrypted secrets for the worker
const secrets = {
  // Database URL (will need to be transformed for D1 later)
  DATABASE_URL: alchemy.secret(process.env.DATABASE_URL || ''),

  // Authentication
  BETTER_AUTH_SECRET: alchemy.secret(process.env.BETTER_AUTH_SECRET || ''),
  BETTER_AUTH_URL: alchemy.secret(
    process.env.BETTER_AUTH_URL || 'https://codefetch-ui.workers.dev'
  ),
  SESSION_COOKIE_NAME: alchemy.secret(process.env.SESSION_COOKIE_NAME || 'codefetch_session'),

  // Email Configuration
  RESEND_API_KEY: alchemy.secret(process.env.RESEND_API_KEY || ''),
  EMAIL_FROM: alchemy.secret(process.env.EMAIL_FROM || 'noreply@codefetch.dev'),
  ENABLE_EMAIL_VERIFICATION: alchemy.secret(process.env.ENABLE_EMAIL_VERIFICATION || 'false'),

  // OAuth Providers (optional)
  GITHUB_CLIENT_ID: alchemy.secret(process.env.GITHUB_CLIENT_ID || ''),
  GITHUB_CLIENT_SECRET: alchemy.secret(process.env.GITHUB_CLIENT_SECRET || ''),
  GOOGLE_CLIENT_ID: alchemy.secret(process.env.GOOGLE_CLIENT_ID || ''),
  GOOGLE_CLIENT_SECRET: alchemy.secret(process.env.GOOGLE_CLIENT_SECRET || ''),

  // CodeFetch SDK
  CODEFETCH_API_KEY: alchemy.secret(process.env.CODEFETCH_API_KEY || ''),

  // Environment
  NODE_ENV: alchemy.secret(app.stage === 'prod' ? 'production' : 'development'),
};

// Create the main worker with correct TanStack Start build output
const worker = await Worker(`codefetch-ui-${app.stage}`, {
  entrypoint: './dist/_worker.js/index.js',
  compatibilityDate: '2024-11-19',
  bindings: {
    // Storage (KV and R2)
    SESSIONS: sessionsKV,
    CACHE: cacheKV,
    UPLOADS: uploadsBucket,

    // Note: We're using CACHE KV for rate limiting
    // The app expects it as RATE_LIMIT_KV but we'll use CACHE
    RATE_LIMIT_KV: cacheKV,

    // Secrets
    ...secrets,
  },
  // Remove routes since we don't have a custom domain
  // The worker will be accessible via workers.dev subdomain
});

// Clean up orphaned resources
await app.finalize();

console.log('✅ Infrastructure setup complete!');
console.log('\n📋 Resources created:');
console.log(`  - State Bucket: ${stateBucket.name}`);
console.log(`  - Uploads Bucket: ${uploadsBucket.name}`);
console.log(`  - Sessions KV: ${sessionsKV.title}`);
console.log(`  - Cache KV: ${cacheKV.title}`);
console.log(`  - Main Database: ${database.name}`);
console.log(`  - Analytics Database: ${analyticsDb.name}`);
console.log(`  - Worker: ${worker.name}`);

if (worker.url) {
  console.log(`\n🌐 Worker URL: ${worker.url}`);
  console.log(`\n🧪 Test your API:`);
  console.log(`  curl "${worker.url}/api/scrape?url=https://github.com/facebook/react"`);
}

```

File: /Users/kregenrek/projects/codefetchUI/src/hooks/use-streaming-ast-grep.ts
```ts
import { useCallback, useRef, useState } from 'react';

export interface ContextItem {
  file: string;
  lines: [number, number];
  snippet: string;
  bucket: string | null;
  score: number;
}

export const useStreamingAstGrep = () => {
  const [data, setData] = useState<ContextItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const startGeneration = useCallback(async (resource: string, intent: string) => {
    if (!resource) return;

    // Abort any existing request
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    setData(null);
    setIsLoading(true);
    setError(null);

    try {
      const resp = await fetch(
        `/api/context?resource=${encodeURIComponent(resource)}&intent=${encodeURIComponent(intent)}`,
        { signal: controller.signal },
      );
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      const collected: ContextItem[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        let idx;
        while ((idx = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, idx).trim();
          buf = buf.slice(idx + 1);
          if (!line) continue;
          try {
            collected.push(JSON.parse(line));
            setData([...collected]); // trigger update
          } catch {}
        }
      }
      setIsLoading(false);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err);
      setIsLoading(false);
    }
  }, []);

  return {
    startGeneration,
    isLoading,
    error,
    data,
  };
};
```

File: /Users/kregenrek/projects/codefetchUI/src/hooks/use-streaming-scrape.ts
```ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { FileNode, ScrapedData, ScrapedDataMetadata } from '~/lib/stores/scraped-data.store';

interface StreamChunk {
  type: 'metadata' | 'node' | 'complete';
  data?: any;
}

interface UseStreamingScrapeOptions {
  onComplete?: (data: ScrapedData, metadata: ScrapedDataMetadata) => void;
  onError?: (error: Error) => void;
}

export function useStreamingScrape(url: string | null, options: UseStreamingScrapeOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  const [metadata, setMetadata] = useState<ScrapedDataMetadata | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const nodesRef = useRef<Map<string, FileNode>>(new Map());
  const rootRef = useRef<FileNode | null>(null);
  const metadataRef = useRef<ScrapedDataMetadata | null>(null);

  const startScraping = useCallback(async () => {
    if (!url) {
      return;
    }

    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);
    nodesRef.current.clear();
    rootRef.current = null;
    metadataRef.current = null;

    try {
      abortControllerRef.current = new AbortController();
      
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';
      let nodeCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // Process any remaining data in buffer
          if (buffer.trim()) {
            try {
              const chunk: StreamChunk = JSON.parse(buffer);

              if (chunk.type === 'complete') {
                setProgress(1);
                setIsLoading(false);

                if (rootRef.current && metadataRef.current) {
                  const scrapedData: ScrapedData = { root: rootRef.current };
                  options.onComplete?.(scrapedData, metadataRef.current);
                } else {
                }
              }
            } catch (err) {
              console.error('[useStreamingScrape] Error parsing final buffer:', err, buffer);
            }
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const chunk: StreamChunk = JSON.parse(line);

            switch (chunk.type) {
              case 'metadata':
                metadataRef.current = chunk.data;
                setMetadata(chunk.data);
                break;

              case 'node':
                const nodeData = chunk.data;
                const node: FileNode = {
                  name: nodeData.name,
                  path: nodeData.path,
                  type: nodeData.type,
                  size: nodeData.size,
                  lastModified: nodeData.lastModified,
                  language: nodeData.language,
                  tokens: nodeData.tokens,
                  content: nodeData.content,
                  children: nodeData.hasChildren ? [] : undefined,
                };

                nodesRef.current.set(node.path, node);
                nodeCount++;

                if (nodeCount % 50 === 0) {
                }

                // Update progress based on node count
                setProgress(Math.min(nodeCount / 100, 0.95)); // Cap at 95% until complete

                // Handle root node
                if (node.path === '') {
                  rootRef.current = node;
                } else {
                  // Add to parent's children
                  const parentPath = nodeData.parentPath;
                  const parent = nodesRef.current.get(parentPath);
                  if (parent && parent.children) {
                    parent.children.push(node);
                  }
                }
                break;

              case 'complete':
                setProgress(1);
                setIsLoading(false);

                if (rootRef.current && metadataRef.current) {
                  const scrapedData: ScrapedData = { root: rootRef.current };
                  options.onComplete?.(scrapedData, metadataRef.current);
                } else {
                }
                break;
            }
          } catch (err) {
            console.error('Error parsing chunk:', err);
          }
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
        } else {
          setError(err);
          options.onError?.(err);
        }
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [url, options]);

  // Cancel ongoing request
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Cleanup on unmount - removed to prevent StrictMode issues
  // The abort controller will be cleaned up when a new request starts

  return {
    startScraping,
    cancel,
    isLoading,
    error,
    progress,
    metadata,
  };
}

```

File: /Users/kregenrek/projects/codefetchUI/src/hooks/use-preview-generator.ts
```ts
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

```

File: /Users/kregenrek/projects/codefetchUI/src/server/repo-storage.ts
```ts
import { createStorage } from 'unstorage';
import memoryDriver from 'unstorage/drivers/memory';
import crypto from 'crypto';

// Create storage instance with memory driver
const storage = createStorage({
  driver: memoryDriver(),
});

/**
 * Normalize GitHub URLs for consistent key generation
 */
function normalizeGitHubUrl(url: string): string {
  try {
    const parsed = new URL(url);

    // Convert to lowercase
    let normalized = parsed.hostname.toLowerCase() + parsed.pathname.toLowerCase();

    // Remove trailing slashes
    normalized = normalized.replace(/\/+$/, '');

    // Remove .git extension
    normalized = normalized.replace(/\.git$/, '');

    // Remove common prefixes
    normalized = normalized.replace(/^(www\.)?/, '');

    return `https://${normalized}`;
  } catch {
    // If URL parsing fails, just return lowercase trimmed version
    return url.toLowerCase().trim();
  }
}

/**
 * Generate a storage key from a repository URL
 */
export function generateRepoKey(url: string): string {
  const normalized = normalizeGitHubUrl(url);
  const hash = crypto.createHash('sha256').update(normalized).digest('hex').substring(0, 16);
  return `repo:${hash}:v1`;
}

/**
 * Store repository data
 */
export async function storeRepoData(url: string, data: any): Promise<void> {
  const key = generateRepoKey(url);

  // Store with 2 hour TTL
  await storage.setItem(
    key,
    {
      url,
      fetchedAt: new Date().toISOString(),
      data,
    },
    {
      ttl: 7200, // 2 hours in seconds
    }
  );
}

/**
 * Retrieve repository data
 */
export async function getRepoData(url: string): Promise<any | null> {
  const key = generateRepoKey(url);

  const stored = await storage.getItem(key);

  if (!stored) {
    return null;
  }

  return stored.data;
}

/**
 * Check if repository data exists
 */
export async function hasRepoData(url: string): Promise<boolean> {
  const key = generateRepoKey(url);
  return await storage.hasItem(key);
}

/**
 * Remove repository data
 */
export async function removeRepoData(url: string): Promise<void> {
  const key = generateRepoKey(url);
  await storage.removeItem(key);
}

/**
 * Get storage stats (for debugging)
 */
export async function getStorageStats(): Promise<{ keys: string[]; count: number }> {
  const keys = await storage.getKeys();
  return {
    keys,
    count: keys.length,
  };
}

```

File: /Users/kregenrek/projects/codefetchUI/src/utils/ast-grep-ai.ts
```ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as yaml from 'js-yaml';

// Types for ast-grep AI functionality
// Update the AstGrepRule interface to a union type for better handling of simple and complex rules
export type SimpleRule = {
  pattern: string;
  languages?: string[];
  kind?: string;
};

export type ComplexRule = {
  rule: Record<string, any>;
  languages?: string[];
};

export type AstGrepRule = SimpleRule | ComplexRule;

export interface AiTransformResult {
  rule: AstGrepRule;
  suggestedPaths?: string[];
  intent: 'refactor' | 'debug' | 'add' | 'find' | 'other';
}

// Detect if prompt is natural language or ast-grep syntax
export function isNaturalLanguagePrompt(prompt: string): boolean {
  // Simple heuristics: length > 10 and no ast-grep syntax patterns
  if (prompt.length <= 10) return false;

  // Check for ast-grep syntax indicators
  const astGrepPatterns = [
    /\$[A-Z_]+/, // $VAR, $FUNC, etc.
    /\$\$\$/, // $$$ wildcard
    /kind:\s*\w+/, // kind: function_definition
    /pattern:\s*[|>]/, // YAML pattern syntax
    /rule:/, // rule syntax
  ];

  // If it contains ast-grep syntax, it's not natural language
  if (astGrepPatterns.some((pattern) => pattern.test(prompt))) {
    return false;
  }

  // Check if it's a vague query without code-specific terms
  const codeSpecificTerms = [
    'function',
    'class',
    'method',
    'variable',
    'import',
    'export',
    'async',
    'await',
    'promise',
    'callback',
    'component',
    'hook',
    'test',
    'spec',
    'describe',
    'it',
    'expect',
    'mock',
    'interface',
    'type',
    'enum',
    'const',
    'let',
    'var',
    'return',
    'if',
    'else',
    'for',
    'while',
    'switch',
    'try',
    'catch',
    'throw',
    'error',
    'api',
    'route',
    'file',
    'folder',
    'directory',
    'module',
    'package',
  ];

  const lowerPrompt = prompt.toLowerCase();
  const hasCodeTerms = codeSpecificTerms.some((term) => lowerPrompt.includes(term));

  // If it's too vague (no code terms), it might need special handling
  return hasCodeTerms || prompt.length > 20;
}

// Check if query is too vague for AI transformation
export function isVagueQuery(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();

  // List of vague phrases that often cause issues
  const vaguePatterns = [
    /^i want to\s/,
    /^i need to\s/,
    /^how to\s/,
    /^show me\s/,
    /^can you\s/,
    /^find\s+/,
    /^search for\s+/,
    /^where\s+/,
    /^locate\s+/,
  ];

  // Check if it starts with a vague pattern but lacks specific code context
  const startsVague = vaguePatterns.some((pattern) => pattern.test(lowerPrompt));

  const codeSpecificTerms = [
    'function',
    'class',
    'test',
    'component',
    'file',
    'folder',
    'async',
    'api',
    'route',
    'import',
    'export',
    'variable',
  ];

  const hasSpecificTerms = codeSpecificTerms.some((term) => lowerPrompt.includes(term));

  return startsVague && !hasSpecificTerms;
}

// Classify prompt intent using keyword matching
export function classifyPromptIntent(
  prompt: string
): 'refactor' | 'debug' | 'add' | 'find' | 'other' {
  const lowerPrompt = prompt.toLowerCase();

  const intentKeywords = {
    refactor: ['refactor', 'update', 'change', 'modify', 'replace', 'rename'],
    debug: ['bug', 'error', 'fix', 'issue', 'problem', 'debug'],
    add: ['add', 'new', 'create', 'implement', 'insert'],
    find: ['find', 'search', 'locate', 'where', 'show', 'get', 'list'],
  };

  for (const [intent, keywords] of Object.entries(intentKeywords)) {
    if (keywords.some((keyword) => lowerPrompt.includes(keyword))) {
      return intent as any;
    }
  }

  return 'other';
}

// Get Gemini API key from local storage
export function getGeminiApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('geminiApiKey');
}

// Save Gemini API key to local storage
export function setGeminiApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('geminiApiKey', key);
}

// Add validation function for Gemini API key format after setGeminiApiKey
// Validates if the provided key matches the expected Gemini API key format
export function isValidGeminiApiKey(key: string): boolean {
  return /^AIza[0-9A-Za-z_-]{35}$/.test(key);
}

// Validate ast-grep rule for common issues
export function validateAstGrepRule(rule: AstGrepRule): { valid: boolean; error?: string } {
  if ('rule' in rule) {
    // Complex rules from templates are assumed valid
    return { valid: true };
  }

  // Check for simple rules
  if (!('pattern' in rule) && !('kind' in rule)) {
    return { valid: false, error: 'Rule must have either a pattern or kind field' };
  }

  // Check for newlines in pattern (common cause of MultipleNode errors)
  if (rule.pattern && rule.pattern.includes('\n')) {
    return {
      valid: false,
      error: 'Pattern contains newlines. Use single-line patterns with metavariables instead.',
    };
  }

  // Check for unbalanced braces/parentheses
  if (rule.pattern) {
    const openBraces = (rule.pattern.match(/\{/g) || []).length;
    const closeBraces = (rule.pattern.match(/\}/g) || []).length;
    const openParens = (rule.pattern.match(/\(/g) || []).length;
    const closeParens = (rule.pattern.match(/\)/g) || []).length;

    if (openBraces !== closeBraces) {
      return { valid: false, error: 'Unbalanced braces in pattern' };
    }
    if (openParens !== closeParens) {
      return { valid: false, error: 'Unbalanced parentheses in pattern' };
    }
  }

  // Check for valid metavariables - now accepting both uppercase and lowercase
  if (rule.pattern) {
    // Update regex to accept both uppercase and lowercase metavariables
    const metavarPattern = /\$[A-Za-z_][A-Za-z0-9_]*|\$\$\$/g;

    // Check for incomplete metavariables (but allow both cases)
    const incompleteMetavar = /\$[^A-Za-z_$]/;
    if (incompleteMetavar.test(rule.pattern)) {
      return { valid: false, error: 'Invalid metavariable syntax' };
    }

    // Transform lowercase metavariables to uppercase before validation
    const transformedPattern = rule.pattern.replace(
      /\$([a-z_][a-zA-Z0-9_]*)/g,
      (match, name) => '$' + name.toUpperCase()
    );

    // Update the rule with transformed pattern
    rule.pattern = transformedPattern;
  }

  return { valid: true };
}

// Create a fallback rule for common queries
export function createFallbackRule(prompt: string): AstGrepRule {
  const lowerPrompt = prompt.toLowerCase();

  // Directory/file-based searches
  if (lowerPrompt.includes('test') || lowerPrompt.includes('spec')) {
    return {
      pattern: 'test($$$)',
      languages: ['javascript', 'typescript'],
    };
  }

  if (lowerPrompt.includes('component')) {
    return {
      pattern: 'function $COMPONENT($$$) { $$$BODY }',
      languages: ['javascript', 'typescript', 'jsx', 'tsx'],
    };
  }

  if (lowerPrompt.includes('async') || lowerPrompt.includes('await')) {
    return {
      pattern: 'async function $FUNC($$$) { $$$BODY }',
      languages: ['javascript', 'typescript'],
    };
  }

  // Default: search for the most relevant keyword
  const keywords = prompt.split(' ').filter((word) => word.length > 3);
  const keyword = keywords[0] || 'function';

  return {
    pattern: keyword,
    languages: ['javascript', 'typescript'],
  };
}

// Extract meaningful keywords from a query
export function extractKeywords(query: string): string[] {
  const lowerQuery = query.toLowerCase();

  // Remove common stop words and filter short words
  const stopWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'from',
    'all',
    'find',
    'show',
    'where',
    'get',
    'list',
    'i',
    'want',
    'need',
    'would',
    'like',
    'please',
    'can',
    'you',
    'me',
    'my',
    'we',
    'our',
    'us',
  ]);

  // Extract words and filter
  const words = lowerQuery
    .replace(/[^a-z0-9\s]/g, ' ') // Remove special characters
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  // Prioritize code-specific terms
  const codeTerms = [
    'test',
    'spec',
    'component',
    'controller',
    'service',
    'api',
    'route',
    'model',
    'schema',
    'hook',
    'util',
    'helper',
    'function',
    'class',
    'interface',
    'type',
    'async',
    'await',
    'update',
    'prompt',
    'prompts',
    'cli',
    'command',
    'script',
    'config',
    'setting',
    'option',
  ];

  const prioritizedWords = words.filter((word) => codeTerms.includes(word));
  const otherWords = words.filter((word) => !codeTerms.includes(word));

  return [...prioritizedWords, ...otherWords];
}

// Create path-based fallback rule when AI fails
export function createPathBasedFallback(query: string): AstGrepRule {
  const keywords = extractKeywords(query);

  if (keywords.length === 0) {
    // If no keywords extracted, fall back to simple pattern search
    return createFallbackRule(query);
  }

  // For single keyword, just search for files containing it
  if (keywords.length === 1) {
    return {
      rule: {
        path: { regex: `.*${keywords[0]}.*\\.(ts|tsx|js|jsx)$` },
      },
      languages: ['javascript', 'typescript', 'jsx', 'tsx'],
    };
  }

  // For multiple keywords, create more specific patterns
  // Prioritize finding files that contain ALL keywords in the path
  const allKeywordsPattern = keywords.slice(0, 2).join('.*');

  const pathPatterns = [
    // Files containing all keywords in order
    { path: { regex: `.*${allKeywordsPattern}.*\\.(ts|tsx|js|jsx)$` } },
    // Files in directories matching first keyword
    { path: { regex: `.*/${keywords[0]}/.*\\.(ts|tsx|js|jsx)$` } },
  ];

  // Only add individual keyword patterns if we have very few matches
  if (keywords.length <= 2) {
    keywords.slice(0, 2).forEach((keyword) => {
      pathPatterns.push({ path: { regex: `.*${keyword}.*\\.(ts|tsx|js|jsx)$` } });
    });
  }

  return {
    rule: {
      any: pathPatterns,
    },
    languages: ['javascript', 'typescript', 'jsx', 'tsx'],
  };
}

// Find the best matching template for a query
export function findBestTemplate(query: string): RuleTemplate | null {
  const keywords = extractKeywords(query);
  const lowerQuery = query.toLowerCase();

  let bestMatch: { template: RuleTemplate; score: number } | null = null;

  for (const [key, template] of Object.entries(RULE_TEMPLATES)) {
    let score = 0;

    // Check how many template keywords match
    for (const templateKeyword of template.keywords) {
      if (lowerQuery.includes(templateKeyword)) {
        score += 2; // Exact match in query
      } else if (keywords.includes(templateKeyword)) {
        score += 1; // Keyword match
      }
    }

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { template, score };
    }
  }

  return bestMatch ? bestMatch.template : null;
}

// Directory-focused rule templates for common queries
interface RuleTemplate {
  keywords: string[];
  rule: any; // Using any since ast-grep rules can have various structures
}

export const RULE_TEMPLATES: Record<string, RuleTemplate> = {
  tests: {
    keywords: ['test', 'tests', 'testing', 'spec', 'specs', 'jest', 'vitest', 'mocha'],
    rule: {
      rule: {
        any: [
          { path: { regex: '.*(test|spec|__test__).*' } },
          { kind: 'call_expression', pattern: 'test($$$)' },
          { kind: 'call_expression', pattern: 'describe($$$)' },
          { kind: 'call_expression', pattern: 'it($$$)' },
        ],
      },
      languages: ['javascript', 'typescript'],
    },
  },
  components: {
    keywords: ['component', 'components', 'ui', 'widget'],
    rule: {
      rule: {
        any: [
          { path: { regex: '.*/components?/.*' } },
          { pattern: 'function $COMPONENT($$$) { return $$$JSX }' },
          { pattern: 'const $COMPONENT = ($$$) => { return $$$JSX }' },
        ],
      },
      languages: ['javascript', 'typescript', 'jsx', 'tsx'],
    },
  },
  api: {
    keywords: ['api', 'endpoint', 'route', 'routes', 'controller'],
    rule: {
      rule: {
        any: [
          { path: { regex: '.*/api/.*' } },
          { path: { regex: '.*/routes?/.*' } },
          { pattern: 'app.$METHOD($$$)' },
          { pattern: 'router.$METHOD($$$)' },
        ],
      },
      languages: ['javascript', 'typescript'],
    },
  },
  hooks: {
    keywords: ['hook', 'hooks', 'use'],
    rule: {
      rule: {
        any: [
          { path: { regex: '.*/hooks?/.*' } },
          { pattern: 'function use$HOOK($$$) { $$$BODY }' },
          { pattern: 'const use$HOOK = ($$$) => { $$$BODY }' },
        ],
      },
      languages: ['javascript', 'typescript', 'jsx', 'tsx'],
    },
  },
  services: {
    keywords: ['service', 'services', 'helper', 'util', 'utils'],
    rule: {
      rule: {
        any: [
          { path: { regex: '.*/services?/.*' } },
          { path: { regex: '.*/utils?/.*' } },
          { path: { regex: '.*/helpers?/.*' } },
        ],
      },
      languages: ['javascript', 'typescript'],
    },
  },
  layouts: {
    keywords: ['layout', 'layouts', 'template', 'templates'],
    rule: {
      rule: {
        any: [
          { path: { regex: '.*/layouts?/.*' } },
          { pattern: 'function Layout($$$) { $$$BODY }' },
          { pattern: 'const Layout = ($$$) => { return $$$JSX }' },
        ],
      },
      languages: ['javascript', 'typescript', 'jsx', 'tsx'],
    },
  },
  pages: {
    keywords: ['page', 'pages', 'screen', 'view'],
    rule: {
      rule: {
        any: [
          { path: { regex: '.*/pages?/.*' } },
          { pattern: 'function $PAGE($$$) { return $$$JSX }' },
          { pattern: 'const $PAGE = ($$$) => { return $$$JSX }' },
        ],
      },
      languages: ['javascript', 'typescript', 'jsx', 'tsx'],
    },
  },
  models: {
    keywords: ['model', 'models', 'schema', 'db', 'database', 'table'],
    rule: {
      rule: {
        any: [{ path: { regex: '.*/models?/.*' } }, { path: { regex: '.*/schema/.*' } }],
      },
      languages: ['javascript', 'typescript'],
    },
  },
  prompts: {
    keywords: ['prompt', 'prompts', 'cli', 'command', 'terminal', 'console'],
    rule: {
      rule: {
        any: [
          { path: { regex: '.*(prompt|cli|command).*\\.(ts|tsx|js|jsx)$' } },
          { path: { regex: '.*/cli/.*' } },
          { path: { regex: '.*/prompts?/.*' } },
          { pattern: 'prompt($$$)' },
          { pattern: 'console.log($$$)' },
        ],
      },
      languages: ['javascript', 'typescript'],
    },
  },
};

// Check if query matches a template
export function findMatchingTemplate(prompt: string): RuleTemplate | null {
  const lowerPrompt = prompt.toLowerCase();

  for (const [key, template] of Object.entries(RULE_TEMPLATES)) {
    if (template.keywords.some((keyword) => lowerPrompt.includes(keyword))) {
      return template;
    }
  }

  return null;
}

export async function generateAiContext(scrapedData: any): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error('Gemini API key required');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const rawTree = JSON.stringify(scrapedData.root, null, 2).slice(0, 10000); // Limit size

  const prompt = `Summarize this repo file tree for code search context. Include top directories, common patterns, test locations, main languages, frameworks detected. Be concise.

File tree: ${rawTree}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Check if a rule type is supported in current implementation
export function isRuleTypeSupported(rule: any, supportedTypes: string[]): boolean {
  if (!rule || typeof rule !== 'object') return false;

  const ruleKeys = Object.keys(rule);

  // Check if all keys are in supported types
  for (const key of ruleKeys) {
    if (!supportedTypes.includes(key)) {
      // Special handling for nested rules
      if (key === 'any' || key === 'all') {
        const nestedRules = Array.isArray(rule[key]) ? rule[key] : [rule[key]];
        for (const nestedRule of nestedRules) {
          if (!isRuleTypeSupported(nestedRule, supportedTypes)) {
            return false;
          }
        }
      } else {
        return false;
      }
    }
  }

  return true;
}

// Validate rule complexity to ensure ast-grep can handle it
export function validateRuleComplexity(rule: AstGrepRule): { valid: boolean; error?: string } {
  // Phase 1: Support simple rules and common combinations
  const supportedRuleTypes = ['pattern', 'kind', 'path', 'any', 'all'];

  if ('rule' in rule) {
    // Complex rule - check if it's supported
    if (!isRuleTypeSupported(rule.rule, supportedRuleTypes)) {
      return {
        valid: false,
        error: 'Rule contains unsupported features. Supported: pattern, kind, path, any, all',
      };
    }

    // Check nesting depth (max 2 levels for now)
    const checkDepth = (r: any, depth: number = 0): boolean => {
      if (depth > 2) return false;

      if (r.any || r.all) {
        const rules = Array.isArray(r.any || r.all) ? r.any || r.all : [r.any || r.all];
        for (const nestedRule of rules) {
          if (!checkDepth(nestedRule, depth + 1)) return false;
        }
      }

      return true;
    };

    if (!checkDepth(rule.rule)) {
      return { valid: false, error: 'Rule nesting is too deep (max 2 levels)' };
    }
  }

  return { valid: true };
}

// Transforms a natural language prompt into an ast-grep rule using templates or Gemini AI, with added validation and fallback for AI-generated rules
export async function transformPromptToAstGrepRule(
  prompt: string,
  fileTreeContext?: string
): Promise<AiTransformResult> {
  const intent = classifyPromptIntent(prompt);

  // Progressive fallback strategy:
  // 1. First check if we have a matching template
  const template = findBestTemplate(prompt);
  if (template) {
    console.log('Using template for query:', prompt);
    return {
      rule: template.rule,
      intent,
    };
  }

  // 2. Try AI transformation
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    // If no API key, use path-based fallback
    console.log('No API key, using path-based fallback');
    return {
      rule: createPathBasedFallback(prompt),
      intent,
    };
  }

  if (!isValidGeminiApiKey(apiKey)) {
    throw new Error('Invalid Gemini API key format. Please check your API key.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const systemPrompt = `You are an expert at converting natural language queries into ast-grep patterns.
Generate ast-grep rules in YAML format that can search for relevant code structures.

CRITICAL RULES:
1. NEVER include newlines (\\n) in patterns - use single-line patterns only
2. For multi-line patterns, use metavariables like $$$BODY to match blocks
3. Ensure all patterns are valid and parsable
4. For searching directories/files, use path-based rules instead of code patterns
5. Test your output for proper YAML syntax
6. CRITICAL: All metavariables SHOULD be uppercase, using only letters and underscores (e.g., $MY_VARIABLE, not $myVariable). However, lowercase will be automatically converted to uppercase.
7. KEEP RULES SIMPLE - avoid complex nested structures. Use 'any' or 'all' sparingly.
8. PREFER pattern-based rules over complex rule structures when possible.
9. NEVER use $$$ANY or $$$ alone - they must be part of a valid pattern like function($$$) or [$$$]
10. For vague queries, prefer path-based searches over broad pattern matches

SUPPORTED RULE TYPES (use only these):
- pattern: for matching code patterns
- kind: for matching AST node types
- path: for matching file paths with regex
- any: for combining multiple rules (use sparingly)
- all: for requiring multiple conditions (use sparingly)

${fileTreeContext ? `Current file tree context:\n${fileTreeContext}\n` : ''}

Examples:
Query: "find all async functions"
Output:
\`\`\`yaml
pattern: async function $FUNC($$$ARGS) { $$$BODY }
languages: [javascript, typescript]
\`\`\`

Query: "find test functions" or "i want to run tests"
Output:
\`\`\`yaml
pattern: test($$$)
languages: [javascript, typescript]
\`\`\`

Query: "find test folders" or "where are the tests"
Output:
\`\`\`yaml
rule:
  path:
    regex: ".*(test|spec|__test__).*"
languages: [javascript, typescript]
\`\`\`

Query: "find React components"
Output:
\`\`\`yaml
pattern: function $COMPONENT($$$) { return $$$JSX }
languages: [javascript, typescript, jsx, tsx]
\`\`\`

Query: "find API endpoints"
Output:
\`\`\`yaml
pattern: app.$METHOD($$$)
languages: [javascript, typescript]
\`\`\`

Query: "update prompts" or "find prompts in cli"
Output:
\`\`\`yaml
rule:
  path:
    regex: ".*(prompt|cli).*"
languages: [javascript, typescript]
\`\`\`

IMPORTANT: 
- Patterns must be on a single line. Use metavariables for complex matches.
- Avoid using complex nested rules unless absolutely necessary.
- For file/folder searches, use path rules instead of pattern matching.
- When query is vague or unclear, use path-based search with keywords from the query

BAD (too complex):
\`\`\`yaml
rule:
  all:
    - pattern: function $FUNC($$$)
    - inside:
        kind: class_declaration
    - has:
        pattern: async
\`\`\`

BAD (invalid pattern):
\`\`\`yaml
pattern: $$$ANY
\`\`\`

GOOD (simple):
\`\`\`yaml
pattern: async function $FUNC($$$) { $$$BODY }
\`\`\`

GOOD (path-based for vague queries):
\`\`\`yaml
rule:
  path:
    regex: ".*(keyword1|keyword2).*"
\`\`\`

If the query is direct ast-grep syntax (e.g., contains $VAR or YAML), validate and use it, but enhance with the provided context if it improves relevance.

Now convert this query: "${prompt}"
Intent: ${intent}

Respond with ONLY the YAML rule, no additional explanation.`;

  try {
    const result = await model.generateContent(systemPrompt);
    const response = result.response.text();

    // Parse the YAML response
    const yamlMatch = response.match(/```yaml\n([\s\S]*?)```/);
    if (!yamlMatch) {
      console.warn('Failed to extract YAML from AI response, using path-based fallback');
      return {
        rule: createPathBasedFallback(prompt),
        intent,
      };
    }

    const yamlContent = yamlMatch[1];

    // Use proper YAML parser instead of manual parsing
    let parsedYaml: any;
    try {
      parsedYaml = yaml.load(yamlContent) as {
        rule?: any;
        pattern?: string;
        kind?: string;
        languages?: string[];
        suggestedPaths?: string[];
      };
    } catch (yamlError) {
      console.error('Failed to parse YAML:', yamlError);
      // Use path-based fallback for YAML parse errors
      return {
        rule: createPathBasedFallback(prompt),
        intent,
      };
    }

    let rule: AstGrepRule;

    // Ensure languages is always defined with a default
    const languages = parsedYaml.languages || ['javascript', 'typescript'];

    // Handle complex rule structure
    if (parsedYaml.rule) {
      rule = {
        rule: parsedYaml.rule,
        languages,
      };
    }
    // Handle simple pattern rule
    else if (parsedYaml.pattern) {
      rule = {
        pattern: parsedYaml.pattern,
        languages,
      };
      if (parsedYaml.kind) {
        rule.kind = parsedYaml.kind;
      }
    }
    // Handle kind-only rule
    else if (parsedYaml.kind) {
      rule = {
        kind: parsedYaml.kind,
        pattern: '', // Add empty pattern to satisfy SimpleRule type
        languages,
      };
    } else {
      console.warn(
        'Invalid YAML structure: no rule, pattern, or kind field. Using path-based fallback'
      );
      return {
        rule: createPathBasedFallback(prompt),
        intent,
      };
    }

    const suggestedPaths = parsedYaml.suggestedPaths;

    // Validate the generated rule (which also transforms lowercase metavariables)
    const validation = validateAstGrepRule(rule);
    if (!validation.valid) {
      console.warn(`AI-generated rule invalid: ${validation.error}. Trying path-based fallback.`);

      // Try path-based fallback first
      const pathFallback = createPathBasedFallback(prompt);

      // If path fallback looks too generic, try template matching again with relaxed criteria
      const relaxedTemplate = findMatchingTemplate(prompt);
      if (relaxedTemplate) {
        return {
          rule: relaxedTemplate.rule,
          intent,
        };
      }

      return {
        rule: pathFallback,
        intent,
      };
    }

    // Validate rule complexity
    const complexityValidation = validateRuleComplexity(rule);
    if (!complexityValidation.valid) {
      console.warn(
        `AI-generated rule too complex: ${complexityValidation.error}. Using simpler fallback.`
      );

      // Try to find a simpler alternative
      const pathFallback = createPathBasedFallback(prompt);

      return {
        rule: pathFallback,
        intent,
      };
    }

    return {
      rule,
      suggestedPaths: suggestedPaths && suggestedPaths.length > 0 ? suggestedPaths : undefined,
      intent,
    };
  } catch (error) {
    console.error('Failed to transform prompt with AI:', error);

    // Final fallback: path-based search
    return {
      rule: createPathBasedFallback(prompt),
      intent,
    };
  }
}

```

File: /Users/kregenrek/projects/codefetchUI/src/utils/filter-file-tree.ts
```ts
import type { FileNode } from '~/lib/stores/scraped-data.store';

// Simple pattern matching function for basic glob patterns
function matchesPattern(filePath: string, pattern: string): boolean {
  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\./g, '\\.')
    .replace(/\*\*/g, '___DOUBLE_STAR___') // Temporarily replace ** to avoid conflict
    .replace(/\*/g, '[^/]*') // Single * matches anything except /
    .replace(/___DOUBLE_STAR___/g, '.*') // ** matches anything including /
    .replace(/\?/g, '.');

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(filePath);
}

// Check if a file matches the codefetch filters
export function fileMatchesFilters(
  node: FileNode,
  filters: {
    extensions: string[];
    customExtensions: string;
    includeFiles: string[];
    excludeFiles: string[];
    includeDirs: string[];
    excludeDirs: string[];
  }
): boolean {
  if (node.type === 'directory') return false;

  // Check file extension
  const fileExt = '.' + (node.name.split('.').pop()?.toLowerCase() || '');
  const appliedExtensions = [...filters.extensions];

  // Add custom extensions
  if (filters.customExtensions) {
    const customExts = filters.customExtensions
      .split(',')
      .map((ext) => ext.trim())
      .filter((ext) => ext && ext.startsWith('.'));
    appliedExtensions.push(...customExts);
  }

  // If no extensions are selected, consider all files as not matching
  if (appliedExtensions.length === 0) return false;

  // Check if file extension matches
  let matches = appliedExtensions.includes(fileExt);

  // Check exclude patterns
  if (matches && filters.excludeFiles.length > 0) {
    for (const pattern of filters.excludeFiles) {
      if (matchesPattern(node.path, pattern) || matchesPattern(node.name, pattern)) {
        matches = false;
        break;
      }
    }
  }

  // Check include patterns (overrides extension check if specified)
  if (filters.includeFiles.length > 0) {
    for (const pattern of filters.includeFiles) {
      if (matchesPattern(node.path, pattern) || matchesPattern(node.name, pattern)) {
        matches = true;
        break;
      }
    }
  }

  // Check directory patterns
  const pathParts = node.path.split('/');
  pathParts.pop(); // Remove filename

  // Check exclude directories
  if (matches && filters.excludeDirs.length > 0) {
    for (const pattern of filters.excludeDirs) {
      for (let i = 0; i < pathParts.length; i++) {
        const checkPath = pathParts.slice(0, i + 1).join('/') + '/';
        if (matchesPattern(checkPath, pattern) || matchesPattern(pathParts[i] + '/', pattern)) {
          matches = false;
          break;
        }
      }
    }
  }

  // Check include directories
  if (filters.includeDirs.length > 0) {
    let inIncludedDir = false;
    for (const pattern of filters.includeDirs) {
      for (let i = 0; i < pathParts.length; i++) {
        const checkPath = pathParts.slice(0, i + 1).join('/') + '/';
        if (matchesPattern(checkPath, pattern) || matchesPattern(pathParts[i] + '/', pattern)) {
          inIncludedDir = true;
          break;
        }
      }
    }
    if (!inIncludedDir) matches = false;
  }

  return matches;
}

// Filter the file tree to only include files that match the filters
export function filterFileTree(
  node: FileNode,
  filters: {
    extensions: string[];
    customExtensions: string;
    includeFiles: string[];
    excludeFiles: string[];
    includeDirs: string[];
    excludeDirs: string[];
  },
  manualSelections?: {
    checked: Set<string>;
    unchecked: Set<string>;
  }
): FileNode | null {
  if (node.type === 'file') {
    // Check manual selections first
    if (manualSelections) {
      if (manualSelections.checked.has(node.path)) return node;
      if (manualSelections.unchecked.has(node.path)) return null;
    }
    // Return the file only if it matches the filters
    return fileMatchesFilters(node, filters) ? node : null;
  }

  // For directories, recursively filter children
  if (node.children) {
    const filteredChildren = node.children
      .map((child) => filterFileTree(child, filters, manualSelections))
      .filter((child): child is FileNode => child !== null);

    // Only return directory if it has matching children
    if (filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren,
      };
    }
  }

  return null;
}

// Extract file extension from filename
function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === 0) return '';

  // Handle special cases like .test.ts, .spec.js, etc.
  const ext = filename.slice(lastDotIndex);
  const beforeDot = filename.slice(0, lastDotIndex);

  // Check if this might be a compound extension
  const secondLastDotIndex = beforeDot.lastIndexOf('.');
  if (secondLastDotIndex !== -1) {
    const potentialCompound = beforeDot.slice(secondLastDotIndex);
    // Common compound extensions
    if (['.test', '.spec', '.e2e', '.integration', '.unit'].includes(potentialCompound)) {
      return potentialCompound + ext;
    }
  }

  return ext;
}

// Compute unique file extensions and their frequencies from a FileNode tree
export function computeFileExtensions(node: FileNode): Array<{ ext: string; count: number }> {
  const extensionMap = new Map<string, number>();

  // Recursive function to traverse the tree
  function traverse(currentNode: FileNode) {
    if (currentNode.type === 'file') {
      const ext = getFileExtension(currentNode.name);
      if (ext) {
        extensionMap.set(ext, (extensionMap.get(ext) || 0) + 1);
      }
    } else if (currentNode.children) {
      currentNode.children.forEach(traverse);
    }
  }

  traverse(node);

  // Convert map to array and sort by count (descending) then alphabetically
  const extensions = Array.from(extensionMap.entries())
    .map(([ext, count]) => ({ ext, count }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count; // Sort by count descending
      }
      return a.ext.localeCompare(b.ext); // Sort alphabetically if counts are equal
    });

  return extensions;
}

```

File: /Users/kregenrek/projects/codefetchUI/src/workers/preview.worker.ts
```ts
// Web Worker for generating markdown preview
import { filterFileTree } from '~/utils/filter-file-tree';
import { FetchResultImpl, countTokens, type FileNode as SDKFileNode } from 'codefetch-sdk';
// @ts-ignore - prompts is a default export
import prompts from 'codefetch-sdk/prompts';
import type { FileNode } from '~/lib/stores/scraped-data.store';

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

    // Generate markdown using FetchResultImpl
    const fetchResult = new FetchResultImpl(convertToSDKFileNode(filteredTree), url);
    let markdown = fetchResult.toMarkdown();

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

```

File: /Users/kregenrek/projects/codefetchUI/.env.example
```example
# Cloudflare API Credentials (required for deployment)
# Create a token at: https://dash.cloudflare.com/profile/api-tokens
# Required permissions: Account.Cloudflare Workers:Edit, Zone.Workers:Edit
CLOUDFLARE_API_TOKEN=your-api-token-here
CLOUDFLARE_ACCOUNT_ID=your-account-id-here

# Alternative: Use email + API key (not recommended)
# CLOUDFLARE_EMAIL=your-email@example.com
# CLOUDFLARE_API_KEY=your-global-api-key

# Alchemy Configuration
ALCHEMY_PASSWORD=your-secret-password-for-encrypting-secrets
STAGE=dev  # or staging, prod

# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication Secrets
BETTER_AUTH_SECRET=your-auth-secret
BETTER_AUTH_URL=http://localhost:3000

# Email Configuration (Resend)
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com

# CodeFetch SDK
CODEFETCH_API_KEY=your-codefetch-api-key

# GitHub Configuration (optional)
# Used to increase API rate limits for GitHub repository fetching
GITHUB_TOKEN=your-github-personal-access-token

# Other API Keys
# Add any other API keys your app needs
```
</file_contents>
<meta prompt 1 = "[Engineer]">
You are a senior software engineer whose role is to provide clear, actionable code changes. For each edit required:

1. Specify locations and changes:
   - File path/name
   - Function/class being modified
   - The type of change (add/modify/remove)

2. Show complete code for:
   - Any modified functions (entire function)
   - New functions or methods
   - Changed class definitions
   - Modified configuration blocks
   Only show code units that actually change.

3. Format all responses as:

   File: path/filename.ext
   Change: Brief description of what's changing
   ```language
   [Complete code block for this change]

You only need to specify the file and path for the first change in a file, and split the rest into separate codeblocks.
</meta prompt 1>
<meta prompt 2 = "Latest 2025 ">
- always give latest 2025 june 22 best practices, frameworks & code results.
- best sources are github.com, forums, x.com and other blogs
</meta prompt 2>
<xml_formatting_instructions>
### Role
- You are an **architect**: In charge of planning detailed and exhaustive multi-file edits, and assisting users with code related inquiries that don't involve file edits.

### Capabilities
- Can create new files.
- Can delete existing files.
- Can produce instructions with placeholders for an external agent to finalize.
- Can rename or move files.

You can use placeholders for delegate edits, like // existing code here, for brevity. For create, show full code.

## Tools & Actions
1. **create** – Create a new file if it doesn’t exist.
2. **delete** – Remove a file entirely (empty <content>).
3. **rename** – Rename/move a file with `<new path="..."/>`.
4. **delegate edit** – Provide targetted code change instructions that will be integrated by another ai model. Indicate <complexity> to help route changes to the right model.

### **Format to Follow for Repo Prompt's Diff Protocol**

<chatName="Brief descriptive name of the change"/>

<Plan>
Describe your approach or reasoning here.
</Plan>

<file path="path/to/example.swift" action="one_of_the_tools">
  <change>
    <description>Brief explanation of this specific change</description>
    <content>
===
// Provide placeholders or partial code. Must also include <complexity> after </content>.
===
    </content>
    <complexity>3</complexity> <!-- Always required for delegate edits -->
  </change>
  <!-- Add more <change> blocks if you have multiple edits for the same file -->
</file>

#### Tools Demonstration
1. `<file path="NewFile.swift" action="create">` – Full file in <content>
2. `<file path="DeleteMe.swift" action="delete">` – Empty <content>
3. `<file path="DelegateMe.swift" action="delegate edit">` – Placeholders in <content>, each <change> must include <complexity>
4. `<file path="OldName.swift" action="rename">` – `<new path="NewName.swift"/>` with no <content>

## Format Guidelines
1. **General Guidelines**
   - Always Include `<chatName="Descriptive Name"/>` at the top, briefly summarizing the change/request.
   - Begin with a `<Plan>` block explaining your approach.
   - Use `<file path="Models/User.swift" action="...">`. Action must match an available tool.
   - Provide `<description>` within each `<change>` to clarify the specific change. Then `<content>` for the new or modified code. Additional rules depend on your capabilities.
2. **delegate edit**
   - `// <rm oldFoo()>`…`// </rm>` deletes, `// <add newFoo()>`…`// </add>` inserts; place `<add>` right after `<rm>` to show a replacement.
   - **One logical scope = one `<change>`** (all edits inside the same function, property, or small helper).
   - **One edited file = one `<file>` block**; put as many *non‑overlapping* `<change>` blocks inside as needed.
   - Show enough context in `<rm>`: keep at least the first & last lines (collapse big middles with `// …`)—if unsure, include extra lines.
   - Replacing an entire function/struct/class? **Skip `<rm>/<add>`**—paste the full new scope in `<content>` and note in `<description>` that it replaces the old one.
   - Label deletions: add a short tag after `<rm>` and repeat the target in `<description>` (e.g. “Remove legacy `fetchUser()` implementation”).
3. **create & delete**
   - **create**: For new files, put the full file in `<content>`.
   - **delete**: Provide an empty `<content>`. The file is removed.
4. **rename**
   - Provide `<new path="..."/>` inside the `<file>`, no `<content>` needed.
5. **encoding and escaping**
   - Escape quotes as `\"` and backslashes as `\\` where needed.

## Code Examples

-----
### Example: Create New File
<Plan>
Create a new RoundedButton for a custom Swift UIButton subclass.
</Plan>

<file path="Views/RoundedButton.swift" action="create">
  <change>
    <description>Create custom RoundedButton class</description>
    <content>
===
import UIKit
@IBDesignable
class RoundedButton: UIButton {
    @IBInspectable var cornerRadius: CGFloat = 0
}
===
    </content>
  </change>
</file>

-----
### Example: Delegate Edit
<chatName="Delegate Edit – Complex Add/Delete"/>
<Plan>
Replace a legacy networking block with async/await **and** switch the
UI colour assignment to a dark‑mode‑aware variant—all without rewriting
entire methods.
</Plan>

<file path="Networking/UserService.swift" action="delegate edit">
  <change>
    <description>Replace legacy networking with async/await</description>
    <content>
===
func loadUserData() async throws {
    // <rm legacy networking>
    NetworkService.requestOld(endpoint: .user) { data in
        // old completion‑handler logic
    }
    // </rm>

    // <add async/await networking>
    let data = try await api.fetchUser()
    handle(data)
    // </add>
}
===
    </content>
    <complexity>4</complexity>
  </change>
</file>

<file path="UI/HomeViewController.swift" action="delegate edit">
  <change>
    <description>Delete hard‑coded colour; add dark‑mode colour</description>
    <content>
===
func configureUI() {
    // existing setup code

    // <rm old colour assignment>
    view.backgroundColor = .white
    // </rm>

    // … other mid‑section code …

    // <add dark‑mode aware colour>
    view.backgroundColor = UIColor(named: "BackgroundColor")
    // </add>
}
===
    </content>
    <complexity>3</complexity>
  </change>
</file>

-----
### Example: Delete a File
<Plan>
Remove an obsolete file.
</Plan>

<file path="Obsolete/File.swift" action="delete">
  <change>
    <description>Completely remove the file from the project</description>
    <content>
===
===
    </content>
  </change>
</file>

-----
### Example: Rename a File
<Plan>
Rename OldName to NewName.
</Plan>

<file path="Models/OldName.swift" action="rename">
  <new path="Models/NewName.swift"/>
</file>

## Final Notes
1. **delegate edit**
   - Every `<change>` carries `<complexity>` 1‑10 and a clear `<description>`.
   - Exactly **one `<file>` block per edited file**; its `<change>` blocks must not overlap lines.
   - Merge edits that touch the same scope; split changes across distinct scopes.
   - Use `<rm>/<add>` only for precision deletes/inserts—keep `<rm>` minimal but unambiguous; better to include extra context than too little.
   - Avoid the use of +, - @@ diff markers. Rely only on the <rm> / <add> comments to indicate deletions and additions.
   - Full‑scope replacement? Paste the complete new function/struct in `<content>`—no markers needed—and state it’s a full replacement.
   - Removing the whole file? Skip delegate‑edit—use `action="delete"` instead.
2. **create & delete**
   - You can always **create** new files and **delete** existing files. Provide full code for create, and empty content for delete. Avoid creating files you know exist already.
   - If a file tree is provided, place your files logically within that structure. Respect the user’s relative or absolute paths.
3. **rename**
   - Use **rename** to move a file by adding `<new path="…"/>` and leaving `<content>` empty. This deletes the old file and materialises the new one with the original content.
   - After a rename, **do not** pair it with **delegate edit** on either the old **or** the new path in the same response.
   - Never reference the *old* path again, and never add a `<file action="create">` that duplicates the **new** path in the same run.
   - Ensure the destination path does **not** already exist and rename a given file **at most once per response**.
   - If the new file requires changes, first delete it, then create a fresh file with the desired content.
4. **additional formatting rules**
   - Wrap your final output in ```XML … ``` for clarity.
   - **Important:** do **not** wrap XML in CDATA tags (`<![CDATA[ … ]]>`). Repo Prompt expects raw XML exactly as shown in the examples.
5. **capabilities**
   - If you see mentions of capabilities not listed above in the user’s chat history, **do not** try to use them.
6. **chatName**
   - Always include `<chatName="Descriptive Name"/>` near the top when you produce multi-file or complex changes.
7. **Editing rules**
   - Never attempt to edit a file not listed in the user prompt's file_contents section.
   - If you must edit a file not in the file_contents block, ask the user to include it in their next message.
   - If the file is in the file_contents block, you have everything you need to successfuly complete the edit.
8. **escaping**
   - Escape quotes as `\"` and backslashes as `\\` if necessary.
9. **MANDATORY**
   - WHEN MAKING FILE CHANGES, YOU **MUST** USE THE XML FORMATTING CAPABILITIES SHOWN ABOVE—IT IS THE *ONLY* WAY FOR CHANGES TO BE APPLIED.
   - The final output must apply cleanly with **no leftover syntax errors**.
</xml_formatting_instructions>
<user_instructions>
Below is a **developer-oriented implementation plan** that stitches together the hybrid (vector + ast-grep) workflow we discussed, integrates Cloudflare Vectorize, and hardens ast-grep usage inside **codefetch-UI**.
Every step tells you **where to work in the repo**, the rough **LoE (-/+/++)**, and why it matters.

---

## 0 • Preparation (½ day)

| ✔︎ | Task                                                                                     | File(s) / Folder | LoE |
| -- | ---------------------------------------------------------------------------------------- | ---------------- | --- |
| ▢  | Update deps: `@ast-grep/napi 0.39.x` (speed), `@cloudflare/vectorize` , `@cloudflare/ai` | `package.json`   | -   |
| ▢  | Create a feature branch `feat/hybrid-search`                                             | –                | -   |
| ▢  | Add `.env.example` entries for `CF_VECTORIZE_INDEX` & `CF_AI_MODEL`                      | root             | -   |

---

## 1 • Shared rule-guard utility (≈ 2 h)

1. **Create** `src/utils/pattern-guard.ts`

   ```ts
   export function normaliseRule(raw: string): { pattern: string, languages?: string[] } { … }
   export function validateRule(rule: { pattern: string }) { … }
   ```

   * Move the logic from `utils/ast-grep-ai.ts` (`validateAstGrepRule`, uppercase metavars, newline ban, brace balance).

2. **Refactor**:

   * `interactive-grep.ts` server route → import `normaliseRule`.
   * `transformPromptToAstGrepRule` → remove duplicate validation.

---

## 2 • Vector indexing after scrape (≈ 1 day)

1. **Alchemy infra**
   *Add index creation to* `alchemy.run.ts` *(see previous message)*.

2. **Worker-side embed job**

   *Create* `src/workers/embed.worker.ts` (Durable Object or Queue preferred):

   ```ts
   import { Vectorize } from '@cloudflare/vectorize';
   import { ai } from '@cloudflare/ai';

   export async function embedRepo(url: string, tree: FileNode) { … }
   ```

   * Chunk → embed (`@cf/baai/bge-small-en-v1.5`) → `index.upsert`.

3. **Kick off job at end of `/api/scrape`**

   ```ts
   await env.EMBED_QUEUE.send({ url, tree: codefetch.root });
   ```

4. **Set TTL 7200 s** on vectors.

---

## 3 • Search decision engine (≈ 3 h)

1. **Add** `src/utils/engine-select.ts`

   ```ts
   export function chooseEngine(q:string){
     return /(\$|\bpattern:|\bkind:)/.test(q) ? 'ast' :
            q.length < 6                 ? 'vector' :
                                           'hybrid';
   }
   ```

2. Modify `/hooks/use-interactive-grep.ts` → rename to `/hooks/use-code-search.ts`

   * Call backend `/api/search` (new route) and pass engine flag.

---

## 4 • Unified `/api/search` route (≈ 1.5 day)

*Create* `src/routes/api/search.ts`:

```ts
switch(engine){
  case 'vector':    return vectorSearch(query);
  case 'ast':       return astSearch(patternGuard(query));
  case 'hybrid':    return hybridSearch(query);
}
```

### Implementation details

| Function         | Outline                                                                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **vectorSearch** | embed query → Vectorize `query` (top 40) → re-rank (`@cf/sentence-transformers/bge-reranker-large`) → bucket high/mid/low → stream NDJSON matches.                              |
| **astSearch**    | pattern = choosePattern(query)<br>run `sg.runInRepo` *(node side)* or `parse` API as now, return matches / summary.                                                             |
| **hybridSearch** | 1️⃣ `vectorSearch` top 40 → collect paths<br>2️⃣ Pass those to ast-grep (`--include pathA --include pathB`) with AI rule → stream combined result (flag `origin: 'vector+sg'`). |

*Important:* keep the previous `/api/interactive-grep` for backward compatibility; mark as deprecated.

---

## 5 • UI wiring (≈ 1 day)

1. **Rename component** `code-search-results.tsx` → still works; extend type

   ```ts
   type SearchMatch = {
     file:string; lines:[n,n]?; snippet:string;
     score:number; tier:'high'|'mid'|'low'|null; origin:'vector'|'ast'|'vector+sg';
   }
   ```

2. Colour-code row border by `tier`; attach tooltip if `origin==='vector+sg'` (“vector narrowed, ast-grep confirmed”).

3. Inject **progress bar** per match (use `lucide-react` `BarChart2` icon + Tailwind width).

4. Add an **engine badge** next to search box (“structural”, “semantic”, “hybrid”) so devs know what ran.

---

## 6 • Performance & error guards (≈ ½ day)

* In server route wrap ast-grep call with `try/catch`; on failure send
  `{type:'warning', msg:'ast-grep failed – fallback results shown'}`.
* Log `error.message`, `pattern` to D1 `analytics`.

---

## 7 • Playground (optional, 1 day)

* New route `/play/sg` – Monaco editor + live ast-grep preview using WASM in worker.
* Useful for power users, but can slide to later sprint.

---

## 8 • CI & tests (≈ 1 day)

1. **Vitest**: stub `Vectorize` with in-mem map; mock Workers AI.
2. Add tests:

   * `chooseEngine()` decision table
   * pattern-guard rejects bad rules
   * `/api/search` hybrid returns ≥ 1 match on fixture repo.

---

## 9 • Roll-out

| Step                | Env                              |
| ------------------- | -------------------------------- |
| `pnpm deploy:dev`   | Cloudflare dev subdomain         |
| Dog-food internally | Verify latency (expect < 400 ms) |
| `pnpm deploy:prod`  | after green light                |

---

### Estimated timeline

| Phase                          | Effort         |
| ------------------------------ | -------------- |
| Build & unit test              | **4 – 5 days** |
| Internal QA / tweak thresholds | 1 day          |
| Docs & release notes           | ½ day          |

---

### Done checklist for your PR description

* [ ] Vectorize resources created by Alchemy
* [ ] `/api/search` streams NDJSON with `tier` & `origin`
* [ ] UI shows tier buckets & engine badge
* [ ] PatternGuard shared util
* [ ] Telemetry logged to D1
* [ ] Old `/api/interactive-grep` deprecated but functional

Follow this roadmap and ast-grep becomes a *surgical scalpel* inside an otherwise lightning-fast semantic search experience—with minimal runtime grief.  Ping me if you need code snippets for any sub-task!

**IMPORTANT** IF MAKING FILE CHANGES, YOU MUST USE THE AVAILABLE XML FORMATTING CAPABILITIES PROVIDED ABOVE – IT IS THE ONLY WAY FOR YOUR CHANGES TO BE APPLIED.
</user_instructions>
