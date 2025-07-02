import { useSuspenseQuery } from '@tanstack/react-query';
import { isUrl } from '~/utils/is-url';
import { AlertCircle, Globe, RefreshCw, Loader2, FileCode, FolderOpen } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { scrapeUrl } from '~/server/function/scrape-url.server.func';
import { ScrapedData, useScrapedDataStore } from '~/lib/stores/scraped-data.store';
import { useEffect, useRef } from 'react';
import { Badge } from '~/components/ui/badge';

export const Route = createFileRoute({
  component: DashboardDynamicPage,
  validateSearch: (search: Record<string, unknown>): { file?: string } => {
    return {
      file: typeof search.file === 'string' ? search.file : undefined,
    };
  },
  loader: async ({ params }) => {
    const decodedUrl = decodeURIComponent(params.url);

    // Pre-validate URL to avoid unnecessary server calls
    if (!isUrl(decodedUrl)) {
      return { isValidUrl: false, url: decodedUrl };
    }

    return { isValidUrl: true, url: decodedUrl };
  },
  pendingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  onLeave: () => {
    // Clear scraped data when leaving the route
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

function DashboardDynamicPage() {
  const { isValidUrl, url: decodedUrl } = Route.useLoaderData();
  const { file: filePath } = Route.useSearch();

  if (!isValidUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Invalid URL</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          The provided URL is not valid. Please enter a valid URL in the search box above to
          continue.
        </p>
        <code className="bg-destructive/10 text-destructive px-3 py-2 rounded-md text-sm">
          {decodedUrl}
        </code>
      </div>
    );
  }

  return <ValidUrlContent url={decodedUrl} filePath={filePath} />;
}

function ValidUrlContent({ url, filePath }: { url: string; filePath?: string }) {
  const { setScrapedData, selectedFilePath, setSelectedFilePath, getFileByPath, scrapedData } =
    useScrapedDataStore();

  // Use ref to track if we've already set the initial file path
  const hasSetInitialFilePath = useRef(false);

  const { data, isLoading, error, refetch, isFetching } = useSuspenseQuery({
    queryKey: ['scrape-url', url],
    queryFn: () => scrapeUrl({ data: { url } }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Store scraped data in global state when it's fetched
  // Also handle initial file path selection in the same effect to avoid race conditions
  useEffect(() => {
    if (data?.success && data?.data) {
      setScrapedData(
        data.data as ScrapedData,
        data.metadata || { url, scrapedAt: new Date().toISOString() }
      );

      // If we have a file path from URL and haven't set it yet, set it now
      if (filePath && !hasSetInitialFilePath.current) {
        // Small delay to ensure state is updated
        setTimeout(() => {
          setSelectedFilePath(filePath);
          hasSetInitialFilePath.current = true;
        }, 0);
      }
    }
  }, [data, setScrapedData, url, filePath, setSelectedFilePath]);

  // Handle file path changes after initial load
  useEffect(() => {
    if (filePath && scrapedData && hasSetInitialFilePath.current) {
      setSelectedFilePath(filePath);
    }
  }, [filePath, scrapedData, setSelectedFilePath]);

  // Reset the ref when URL actually changes
  const prevUrlRef = useRef(url);
  useEffect(() => {
    if (prevUrlRef.current !== url) {
      hasSetInitialFilePath.current = false;
      prevUrlRef.current = url;
    }
  }, [url]);

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Scraping Failed
            </CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : 'Failed to scrape the URL'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">URL</label>
                <p className="mt-1 p-3 bg-muted rounded-md font-mono text-sm break-all">{url}</p>
              </div>
              <Button onClick={() => refetch()} variant="outline" disabled={isFetching}>
                {isFetching ? (
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
    );
  }

  if (isLoading) {
    return <LoadingComponent />;
  }

  const selectedFile = selectedFilePath ? getFileByPath(selectedFilePath) : null;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Scraped Content</CardTitle>
                <CardDescription>{data?.metadata?.title || 'Website Content'}</CardDescription>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">URL</label>
            <p className="mt-1 p-3 bg-muted rounded-md font-mono text-sm break-all">{url}</p>
          </div>

          {data?.metadata?.scrapedAt && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Scraped</label>
              <p className="mt-1 text-sm">{new Date(data.metadata.scrapedAt).toLocaleString()}</p>
            </div>
          )}

          {data?.metadata?.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="mt-1 text-sm">{data.metadata.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedFile && selectedFile.type === 'file' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileCode className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">{selectedFile.name}</CardTitle>
                  <CardDescription>{selectedFile.path}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedFile.language && (
                  <Badge variant="secondary">{selectedFile.language}</Badge>
                )}
                {selectedFile.size && (
                  <Badge variant="outline">{(selectedFile.size / 1024).toFixed(1)} KB</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedFile.content ? (
              <pre className="p-4 bg-muted rounded-md overflow-auto max-h-[600px]">
                <code className="text-sm">{selectedFile.content}</code>
              </pre>
            ) : (
              <p className="text-muted-foreground">No content available</p>
            )}

            {selectedFile.lastModified && (
              <div className="mt-4 text-sm text-muted-foreground">
                Last modified: {new Date(selectedFile.lastModified).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedFile && data?.data && (
        <Card>
          <CardHeader>
            <CardTitle>Select a File</CardTitle>
            <CardDescription>Choose a file from the sidebar to view its content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <FolderOpen className="h-16 w-16 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
