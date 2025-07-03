import { createServerFileRoute } from '@tanstack/react-start/server';
import { fetch as codefetchFetch } from '@codefetch/sdk';

export const ServerRoute = createServerFileRoute('/api/scrape').methods({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return Response.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    try {
      // Fetch data from codefetch
      const codefetch = await codefetchFetch({ source: targetUrl, format: 'json' });

      // Check if result is valid
      if (typeof codefetch === 'string' || !('root' in codefetch)) {
        return Response.json({ error: 'Invalid response from codefetch' }, { status: 500 });
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
              const { children, content, ...nodeData } = node;

              // Send node data without content and children
              const chunk = {
                type: 'node',
                data: {
                  ...nodeData,
                  parentPath,
                  hasChildren: !!(children && children.length > 0),
                  hasContent: !!content,
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

      // Return streaming response
      return new Response(stream, {
        headers: {
          'Content-Type': 'application/x-ndjson',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    } catch (error) {
      console.error('Error in scrape API:', error);
      return Response.json({ error: 'Failed to scrape URL' }, { status: 500 });
    }
  },
});
