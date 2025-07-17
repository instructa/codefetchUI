import { createServerFileRoute } from '@tanstack/react-start/server';

interface ContextItem {
  file: string;
  lines: [number, number];
  snippet: string;
  bucket: string | null;
  score: number;
  rule?: string;
}

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

    // In Cloudflare Workers environment, we can't access local files
    // This would need to be reimplemented to work with a different data source
    // For now, return an empty result

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Send a placeholder context item
        const contextItem: ContextItem = {
          file: 'src/placeholder.ts',
          lines: [1, 10],
          snippet: `// Context API is not available in Cloudflare Workers\n// Local file access is not supported`,
          bucket: 'info',
          score: 0,
          rule: 'cloudflare-limitation',
        };

        controller.enqueue(encoder.encode(JSON.stringify(contextItem) + '\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'application/x-ndjson' },
    });
  },
});
