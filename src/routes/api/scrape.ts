import { createServerFileRoute } from '@tanstack/react-start/server';
import {
  fetchFromWeb,
  streamGitHubFiles,
  createMarkdownStream,
  type FetchResult,
} from 'codefetch-sdk/worker';
import { universalRateLimiter, type RateLimiterContext } from '~/lib/rate-limiter-wrapper';
import { getApiSecurityConfig } from '~/lib/api-security';
import { storeRepoData } from '~/server/repo-storage';
import type { FileNode as RepoFileNode } from '~/lib/stores/scraped-data.store';

// Type alias for consistency
type FileNode = RepoFileNode;

interface ScrapeMetadata {
  url: string;
  scrapedAt: string;
  source: string;
  totalFiles?: number;
  totalSize?: number;
  totalTokens?: number;
  title?: string;
  description?: string;
}

export const ServerRoute = createServerFileRoute('/api/scrape').methods({
  /**
   * GET /api/scrape - Scrape and process content from URLs
   *
   * Query Parameters:
   * - url: The URL to scrape (required)
   * - stream: Whether to use streaming response (optional, default: false)
   *
   * Response Formats:
   *
   * 1. Non-streaming (default):
   *    Returns NDJSON stream with complete file tree structure:
   *    - First line: metadata chunk with repository info
   *    - Following lines: node chunks for each file/directory
   *    - Last line: completion signal
   *
   * 2. Streaming (stream=true):
   *    For GitHub repos: Progressive markdown stream
   *    For other URLs: Same as non-streaming
   *
   * The non-streaming approach is recommended for:
   * - File browsing and exploration
   * - Filtering and searching files
   * - When you need the complete file structure
   *
   * The streaming approach is useful for:
   * - Very large repositories
   * - Memory-constrained environments
   * - When you only need markdown output
   *
   * Rate Limiting:
   * - 10 requests per minute per IP
   * - Rate limit headers included in response
   *
   * Caching:
   * - Responses are cached in Cloudflare Workers
   * - Cache key: URL-based
   */
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
    const useStreaming = url.searchParams.get('stream') === 'true';

    if (!targetUrl) {
      return Response.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(targetUrl);
    } catch (e) {
      return Response.json({ error: 'Invalid URL format' }, { status: 400 });
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

      // Check if streaming is requested and URL is a GitHub repository
      const isGitHubUrl = targetUrl.includes('github.com');
      const githubMatch = targetUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);

      if (useStreaming && isGitHubUrl && githubMatch) {
        const [, owner, repo] = githubMatch;

        // Create a streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              // Stream files from GitHub
              const fileStream = streamGitHubFiles(owner, repo, {
                token: githubToken,
                maxTokens: 100000,
                extensions: ['.ts', '.tsx', '.js', '.jsx', '.md', '.json'],
                excludeDirs: ['node_modules', 'dist', 'build', '.git'],
              });

              // Create markdown stream from file stream
              const markdownStream = createMarkdownStream(fileStream, {
                includeTreeStructure: true,
                tokenEncoder: 'cl100k',
              });

              const reader = markdownStream.getReader();

              // Send metadata first
              const metadata = {
                type: 'metadata',
                data: {
                  url: targetUrl,
                  scrapedAt: new Date().toISOString(),
                  title: `${owner}/${repo}`,
                  description: `GitHub repository: ${owner}/${repo}`,
                  streaming: true,
                },
              };
              controller.enqueue(encoder.encode(JSON.stringify(metadata) + '\n'));

              // Stream markdown chunks
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Check if value is already a string or needs decoding
                const text = typeof value === 'string' ? value : new TextDecoder().decode(value);

                const chunk = {
                  type: 'markdown',
                  data: text,
                };
                controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'));
              }

              // Send completion signal
              controller.enqueue(encoder.encode(JSON.stringify({ type: 'complete' }) + '\n'));
              controller.close();
            } catch (error) {
              console.error('Streaming error:', error);
              controller.error(error);
            }
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

      // Non-streaming: use regular fetchFromWeb with JSON format to get file structure
      const result = await fetchFromWeb(targetUrl, {
        ...(githubToken && { token: githubToken }),
        maxTokens: 100000, // Set a reasonable token limit
        format: 'json', // Get structured result with file tree, not markdown
      });

      // Handle different response types from fetchFromWeb
      let root: FileNode;
      let metadata: ScrapeMetadata;

      if (typeof result === 'string') {
        // fetchFromWeb returned markdown directly (this shouldn't happen with format: 'json')
        // Create a single-file tree structure
        console.warn('fetchFromWeb returned markdown string instead of structured data');
        root = {
          name: new URL(targetUrl).hostname || 'content',
          path: '',
          type: 'directory' as const,
          children: [
            {
              name: 'content.md',
              path: 'content.md',
              type: 'file' as const,
              content: result,
              language: 'markdown',
              size: result.length,
              tokens: 0, // We'd need to count tokens if needed
            },
          ],
        };
        metadata = {
          url: targetUrl,
          scrapedAt: new Date().toISOString(),
          source: targetUrl,
          totalFiles: 1,
          totalSize: result.length,
          totalTokens: 0,
        };
      } else if (result && typeof result === 'object' && 'root' in result) {
        // fetchFromWeb returned FetchResultImpl with proper structure
        const allFiles = result.getAllFiles();

        // Helper function to build a proper tree structure from flat file list
        function buildTreeFromFiles(files: Array<any>, resultMetadata: any) {
          const treeRoot = {
            name: resultMetadata?.source || 'root',
            path: '',
            type: 'directory' as const,
            children: [] as any[],
          };

          // Create a map to store directory nodes
          const nodeMap = new Map<string, any>();
          nodeMap.set('', treeRoot);

          // Sort files by path depth to ensure parent directories are created first
          const sortedFiles = [...files].sort((a, b) => {
            const depthA = a.path.split('/').length;
            const depthB = b.path.split('/').length;
            return depthA - depthB;
          });

          for (const file of sortedFiles) {
            const pathParts = file.path.split('/');
            const fileName = pathParts.pop() || file.path;
            const dirPath = pathParts.join('/');

            // Create directory nodes if they don't exist
            let currentPath = '';
            for (let i = 0; i < pathParts.length; i++) {
              const parentPath = currentPath;
              currentPath = i === 0 ? pathParts[i] : `${currentPath}/${pathParts[i]}`;

              if (!nodeMap.has(currentPath)) {
                const dirNode = {
                  name: pathParts[i],
                  path: currentPath,
                  type: 'directory' as const,
                  children: [],
                };

                const parentNode = nodeMap.get(parentPath) || treeRoot;
                parentNode.children.push(dirNode);
                nodeMap.set(currentPath, dirNode);
              }
            }

            // Add the file to its parent directory
            const fileNode = {
              name: fileName,
              path: file.path,
              type: 'file' as const,
              content: file.content || '',
              language: file.language,
              size: file.content ? file.content.length : 0,
              tokens: file.tokens || 0,
            };

            const parentNode = nodeMap.get(dirPath) || treeRoot;
            parentNode.children.push(fileNode);
          }

          // Sort children at each level: directories first, then files
          function sortChildren(node: any) {
            if (node.children && node.children.length > 0) {
              node.children.sort((a: any, b: any) => {
                // Directories come first
                if (a.type === 'directory' && b.type === 'file') return -1;
                if (a.type === 'file' && b.type === 'directory') return 1;
                // Same type: sort alphabetically by name
                return a.name.localeCompare(b.name);
              });

              // Recursively sort children of directories
              for (const child of node.children) {
                if (child.type === 'directory') {
                  sortChildren(child);
                }
              }
            }
          }

          sortChildren(treeRoot);
          return treeRoot;
        }

        // Convert files array to tree structure
        root = buildTreeFromFiles(allFiles, result.metadata);
        metadata = {
          url: targetUrl,
          scrapedAt: new Date().toISOString(),
          source: result.metadata?.source || targetUrl,
          totalFiles: result.metadata?.totalFiles,
          totalSize: result.metadata?.totalSize,
          totalTokens: result.metadata?.totalTokens,
        };
      } else {
        // Unexpected response format
        console.error('Unexpected result format from fetchFromWeb:', result);
        return Response.json({ error: 'Failed to process scraped content' }, { status: 500 });
      }

      // Store the repository data for later searches
      try {
        await storeRepoData(targetUrl, {
          root,
          metadata,
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
            const metadataChunk = {
              type: 'metadata',
              data: {
                url: targetUrl,
                scrapedAt: new Date().toISOString(),
                title: metadata.title || metadata.source || 'Scraped Content',
                description: metadata.description || `Source: ${metadata.source || targetUrl}`,
                totalFiles: metadata.totalFiles,
                totalSize: metadata.totalSize,
                totalTokens: metadata.totalTokens,
              },
            };
            controller.enqueue(encoder.encode(JSON.stringify(metadataChunk) + '\n'));

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
      if (embedQueue && root.type === 'directory' && root.children && root.children.length > 0) {
        // Send job to embed queue only if we have a valid tree structure with files
        try {
          await embedQueue.send(
            JSON.stringify({
              url: targetUrl,
              tree: root,
              metadata,
              timestamp: new Date().toISOString(),
            })
          );
        } catch (queueError) {
          console.error('Failed to queue embedding job:', queueError);
          // Don't fail the request if queue fails
        }
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
