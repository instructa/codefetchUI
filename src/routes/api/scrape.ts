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
      // In Cloudflare Workers, we can use the Cache API
      // Check if we're in a Cloudflare Workers environment
      const isWorkerEnvironment = typeof caches !== 'undefined';

      if (isWorkerEnvironment) {
        const cache = (caches as any).default;
        const cacheUrl = `https://codefetch.ui/cache/${encodeURIComponent(targetUrl)}`;
        const cacheRequest = new Request(cacheUrl);

        const cachedResponse = await cache.match(cacheRequest);
        if (cachedResponse) {
          // Add rate limiting headers to the cached response
          const remaining = await universalRateLimiter.getRemainingRequests(
            clientIp,
            rateLimiterContext
          );
          const resetTime = await universalRateLimiter.getResetTime(clientIp, rateLimiterContext);

          const newHeaders = new Headers(cachedResponse.headers);
          newHeaders.set('X-RateLimit-Limit', '10');
          newHeaders.set('X-RateLimit-Remaining', String(remaining));
          newHeaders.set('X-RateLimit-Reset', String(Math.floor(resetTime / 1000)));

          return new Response(cachedResponse.body, {
            status: cachedResponse.status,
            statusText: cachedResponse.statusText,
            headers: newHeaders,
          });
        }
      }

      // Get GitHub token from environment if available
      const githubToken = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;

      const result = await fetchFromWeb(targetUrl, {
        ...(githubToken && { token: githubToken }),
        maxTokens: 100000, // Set a reasonable token limit
      });

      // Debug: Log the result type and structure
      console.log('fetchFromWeb result type:', typeof result);
      if (typeof result === 'string') {
        console.log('Result is a string (markdown), length:', result.length);
      } else {
        console.log('fetchFromWeb result structure:', JSON.stringify(result, null, 2));
      }

      // Check if fetchFromWeb returned markdown directly as a string
      if (typeof result === 'string') {
        // It returned markdown directly, we need to parse it back into files
        // For now, return a simple structure
        const root = {
          name: targetUrl,
          path: '',
          type: 'directory' as const,
          children: [
            {
              name: 'README.md',
              path: 'README.md',
              type: 'file' as const,
              content: result,
              language: 'markdown',
              size: result.length,
              tokens: 0,
            },
          ],
        };

        // Create a streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            // Send metadata
            const metadata = {
              type: 'metadata',
              data: {
                url: targetUrl,
                scrapedAt: new Date().toISOString(),
                title: 'Scraped Content',
                description: `Source: ${targetUrl}`,
                totalFiles: 1,
                totalSize: result.length,
                totalTokens: 0,
              },
            };
            controller.enqueue(encoder.encode(JSON.stringify(metadata) + '\n'));

            // Send the root node
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  type: 'node',
                  data: {
                    ...root,
                    parentPath: '',
                    hasChildren: true,
                  },
                }) + '\n'
              )
            );

            // Send the file node
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  type: 'node',
                  data: {
                    ...root.children[0],
                    parentPath: '',
                    hasChildren: false,
                  },
                }) + '\n'
              )
            );

            // Send completion
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'complete' }) + '\n'));
            controller.close();
          },
        });

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
      }

      // fetchFromWeb returns a FetchResultImpl with root and metadata
      if (!result || !('root' in result)) {
        console.error('Invalid result structure:', result);
        return Response.json({ error: 'Invalid response from codefetch' }, { status: 500 });
      }

      // Get all files from the FetchResultImpl
      const allFiles = result.getAllFiles();

      // Convert files array to tree structure for backward compatibility
      const root = {
        name: result.metadata?.source || 'root',
        path: '',
        type: 'directory' as const,
        children: allFiles.map((file) => ({
          name: file.path.split('/').pop() || file.path,
          path: file.path,
          type: 'file' as const,
          content: file.content || '',
          language: file.language,
          size: file.content ? file.content.length : 0,
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
                title: result.metadata?.source || 'Scraped Content',
                description: `Source: ${result.metadata?.source || targetUrl}`,
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

      const response = new Response(stream, {
        headers: {
          'Content-Type': 'application/x-ndjson',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(Math.floor(resetTime / 1000)),
        },
      });

      // Cache the response if we're in a Cloudflare Workers environment
      if (isWorkerEnvironment) {
        const cache = (caches as any).default;
        const cacheUrl = `https://codefetch.ui/cache/${encodeURIComponent(targetUrl)}`;
        const cacheRequest = new Request(cacheUrl);
        // We need to clone the response to be able to cache it
        await cache.put(cacheRequest, response.clone());
      }

      return response;
    } catch (error) {
      console.error('Error in scrape API:', error);
      return Response.json({ error: 'Failed to scrape URL' }, { status: 500 });
    }
  },
});
