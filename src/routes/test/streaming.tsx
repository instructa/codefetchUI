import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Button } from '~/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { useStreamingScrape } from '~/hooks/use-streaming-scrape';
import { useMarkdownStream } from '~/hooks/use-markdown-stream';
import { SimpleFileTree } from '~/components/simple-file-tree';
import { MarkdownPreview } from '~/components/markdown-preview';

export const Route = createFileRoute('/test/streaming')({
  component: StreamingTestComponent,
});

function StreamingTestComponent() {
  const testUrl = 'https://github.com/regenrek/codefetch';

  // Non-streaming (regular) approach
  const [nonStreamingData, setNonStreamingData] = useState<any>(null);
  const { startScraping, isLoading, error, progress } = useStreamingScrape(testUrl, {
    onComplete: (data, metadata) => {
      setNonStreamingData({ data, metadata });
    },
  });

  // Streaming approach
  const {
    startStreaming,
    cancel,
    isStreaming,
    markdown,
    metadata: streamingMetadata,
    error: streamingError,
  } = useMarkdownStream(testUrl, {
    onChunk: (chunk) => {
      console.log('Received chunk:', chunk.length, 'characters');
    },
    onComplete: (fullMarkdown) => {
      console.log('Streaming complete! Total:', fullMarkdown.length, 'characters');
    },
  });

  useEffect(() => {
    // Start both approaches when component mounts
    startScraping();
    startStreaming();
  }, []);

  const handleRefresh = () => {
    setNonStreamingData(null);
    startScraping();
    startStreaming();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Streaming vs Non-Streaming Comparison</h1>
        <p className="text-muted-foreground mb-4">
          Testing with repository: <code className="bg-muted px-2 py-1 rounded">{testUrl}</code>
        </p>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Both
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Non-Streaming (File Tree) */}
        <Card>
          <CardHeader>
            <CardTitle>Non-Streaming (File Tree)</CardTitle>
            <CardDescription>
              Uses regular fetchFromWeb with format: 'json' to get complete file structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading files... {progress}%</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-red-500 p-4 bg-red-50 rounded">Error: {error.message}</div>
            ) : nonStreamingData ? (
              <Tabs defaultValue="tree" className="h-[600px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="tree">File Tree</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>
                <TabsContent value="tree" className="h-[550px]">
                  <ScrollArea className="h-full border rounded p-4">
                    {nonStreamingData.data?.root && (
                      <SimpleFileTree
                        tree={nonStreamingData.data.root}
                        onFileSelect={(path) => console.log('Selected:', path)}
                      />
                    )}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="metadata" className="h-[550px]">
                  <ScrollArea className="h-full border rounded p-4">
                    <pre className="text-xs">
                      {JSON.stringify(nonStreamingData.metadata, null, 2)}
                    </pre>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            ) : null}
          </CardContent>
        </Card>

        {/* Streaming (Markdown) */}
        <Card>
          <CardHeader>
            <CardTitle>Streaming (Markdown)</CardTitle>
            <CardDescription>
              Uses streamGitHubFiles + createMarkdownStream for progressive loading
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isStreaming ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Streaming... {markdown.length} characters received
                  </p>
                  <Button onClick={cancel} variant="outline" size="sm" className="mt-2">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : streamingError ? (
              <div className="text-red-500 p-4 bg-red-50 rounded">
                Error: {streamingError.message}
              </div>
            ) : (
              <Tabs defaultValue="content" className="h-[600px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Markdown Content</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="h-[550px]">
                  <ScrollArea className="h-full border rounded p-4">
                    {markdown ? (
                      <MarkdownPreview content={markdown} />
                    ) : (
                      <p className="text-muted-foreground">No content yet...</p>
                    )}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="metadata" className="h-[550px]">
                  <ScrollArea className="h-full border rounded p-4">
                    <pre className="text-xs">{JSON.stringify(streamingMetadata, null, 2)}</pre>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comparison Stats */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Comparison Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Non-Streaming:</p>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>Shows complete file tree structure</li>
                <li>Loads all data at once</li>
                <li>Better for file exploration</li>
                <li>Uses more memory for large repos</li>
                {nonStreamingData && (
                  <li className="text-green-600">
                    Files loaded: {nonStreamingData.metadata?.totalFiles || 0}
                  </li>
                )}
              </ul>
            </div>
            <div>
              <p className="font-semibold">Streaming:</p>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>Progressive markdown loading</li>
                <li>Memory efficient</li>
                <li>Faster initial response</li>
                <li>Better for large repositories</li>
                {markdown && (
                  <li className="text-green-600">
                    Content size: {markdown.length.toLocaleString()} characters
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
