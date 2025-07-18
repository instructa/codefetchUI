import { createServerFileRoute } from '@tanstack/react-start/server';
import { fetchFromWeb, type FetchResult } from 'codefetch-sdk/worker';
import { universalRateLimiter, type RateLimiterContext } from '~/lib/rate-limiter-wrapper';
import { getApiSecurityConfig } from '~/lib/api-security';
import { storeRepoData } from '~/server/repo-storage';
import type { FileNode as RepoFileNode } from '~/lib/stores/scraped-data.store';

export const ServerRoute = createServerFileRoute('/api/scrape').methods({
  GET: async ({ request, context }) => {
    const securityConfig = getApiSecurityConfig();

    // Get rate limiter context (KV namespace in production)
    const rateLimiterContext: RateLimiterContext = {
      RATE_LIMIT_KV: (context as any)?.CACHE,
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
      const isWorkerEnvironment = (context as any)?.AUTH_DB;

      // Get GitHub token from environment if available
      const githubToken = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;

      const result: FetchResult = await fetchFromWeb(targetUrl, {
        ...(githubToken && { token: githubToken }),
        maxTokens: 100000, // Set a reasonable token limit
      });

      // fetchFromWeb returns a FetchResult with files array and metadata
      if (!result || !result.files) {
        return Response.json({ error: 'Invalid response from codefetch' }, { status: 500 });
      }

      // Convert files array to tree structure for backward compatibility
      const root = {
        name: result.metadata?.sourceUrl || 'root',
        path: '',
        type: 'directory' as const,
        children: result.files.map((file) => ({
          name: file.path.split('/').pop() || file.path,
          path: file.path,
          type: 'file' as const,
          content: file.content,
          language: file.language,
          size: file.content.length,
          tokens: file.tokens || 0,
        })),
      };

      // Store the repository data for later searches
      try {
        await storeRepoData(targetUrl, {
          root,
          metadata: result.metadata,
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
                title: result.metadata?.gitRepo || 'Scraped Content',
                description: `Source: ${result.metadata?.sourceUrl || targetUrl}`,
                totalFiles: result.metadata?.totalFiles,
                totalSize: result.metadata?.totalSize,
                totalTokens: result.metadata?.totalTokens,
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
            await processNode(root);

            // Send completion signal
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'complete' }) + '\n'));
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      const embedQueue = (context as any)?.EMBED_QUEUE;
      if (embedQueue) {
        // Send lightweight job – tree is already in memory.
        await embedQueue.send(JSON.stringify({ url: targetUrl, tree: root }));
      }

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
