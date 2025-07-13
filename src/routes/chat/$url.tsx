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
import { useCodeSearch } from '~/hooks/use-code-search';
import type { SearchMetadata } from '~/hooks/use-code-search';
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
  const engineMeta = codeSearchResults.find(
    (r) => r.type === 'metadata',
  ) as SearchMetadata | undefined;
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
  } = useCodeSearch();

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
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium">AI-Enhanced Code Search</h3>
                        {engineMeta && (
                          <Badge variant="outline" className="text-xs ml-2">
                            {engineMeta.engine}
                          </Badge>
                        )}
                      </div>
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
