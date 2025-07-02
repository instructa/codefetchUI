import { useSuspenseQuery } from '@tanstack/react-query';
import { isUrl } from '~/utils/is-url';
import { AlertCircle, Globe, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { scrapeUrl } from '~/server/function/scrape-url.server.func';

export const Route = createFileRoute({
  component: DashboardDynamicPage,
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

  return <ValidUrlContent url={decodedUrl} />;
}

function ValidUrlContent({ url }: { url: string }) {
  const { data, isLoading, error, refetch, isFetching } = useSuspenseQuery({
    queryKey: ['scrape-url', url],
    queryFn: () => scrapeUrl({ data: { url } }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  });

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

      {data?.data && (
        <Card>
          <CardHeader>
            <CardTitle>File Structure</CardTitle>
            <CardDescription>Extracted content from the scraped page</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-muted rounded-md overflow-auto max-h-[600px]">
              <code className="text-sm">{JSON.stringify(data.data, null, 2)}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
