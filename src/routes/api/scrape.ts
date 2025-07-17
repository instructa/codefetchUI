import { createServerFileRoute } from '@tanstack/react-start/server';
import { universalRateLimiter, type RateLimiterContext } from '~/lib/rate-limiter-wrapper';
import { getApiSecurityConfig } from '~/lib/api-security';
import { storeRepoData } from '~/server/repo-storage';
import type { FileNode as RepoFileNode } from '~/lib/stores/scraped-data.store';

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url?: string;
}

interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}

async function fetchGitHubRepo(repoUrl: string, githubToken?: string): Promise<RepoFileNode> {
  // Parse GitHub URL
  const urlMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!urlMatch) {
    throw new Error('Invalid GitHub URL');
  }

  const [, owner, repo] = urlMatch;
  const cleanRepo = repo.replace(/\.git$/, '');

  // Prepare headers
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'codefetch-cloudflare',
  };

  if (githubToken) {
    headers['Authorization'] = `token ${githubToken}`;
  }

  // Get default branch
  const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
    headers,
  });
  if (!repoResponse.ok) {
    throw new Error(`Failed to fetch repository: ${repoResponse.status}`);
  }
  const repoData = (await repoResponse.json()) as any;
  const defaultBranch = repoData.default_branch;

  // Get tree
  const treeResponse = await fetch(
    `https://api.github.com/repos/${owner}/${cleanRepo}/git/trees/${defaultBranch}?recursive=1`,
    { headers }
  );
  if (!treeResponse.ok) {
    throw new Error(`Failed to fetch tree: ${treeResponse.status}`);
  }
  const treeData = (await treeResponse.json()) as GitHubTreeResponse;

  // Build file tree structure
  const root: RepoFileNode = {
    name: cleanRepo,
    path: '',
    type: 'directory',
    children: [],
  };

  // Create a map to store directory nodes
  const dirMap = new Map<string, RepoFileNode>();
  dirMap.set('', root);

  // Sort items by path to ensure parent directories are created first
  const sortedItems = [...treeData.tree].sort((a, b) => a.path.localeCompare(b.path));

  // Process each item in the tree
  for (const item of sortedItems) {
    const pathParts = item.path.split('/');
    const name = pathParts[pathParts.length - 1];
    const parentPath = pathParts.slice(0, -1).join('/');

    // Ensure parent directory exists
    let parent = dirMap.get(parentPath);
    if (!parent) {
      // Create missing parent directories
      let currentPath = '';
      for (let i = 0; i < pathParts.length - 1; i++) {
        const dirName = pathParts[i];
        const newPath = currentPath ? `${currentPath}/${dirName}` : dirName;

        if (!dirMap.has(newPath)) {
          const newDir: RepoFileNode = {
            name: dirName,
            path: newPath,
            type: 'directory',
            children: [],
          };

          const parentDir = dirMap.get(currentPath) || root;
          if (!parentDir.children) parentDir.children = [];
          parentDir.children.push(newDir);
          dirMap.set(newPath, newDir);
        }

        currentPath = newPath;
      }
      parent = dirMap.get(parentPath) || root;
    }

    if (item.type === 'tree') {
      // Directory
      const dir: RepoFileNode = {
        name,
        path: item.path,
        type: 'directory',
        children: [],
      };
      if (!parent.children) parent.children = [];
      parent.children.push(dir);
      dirMap.set(item.path, dir);
    } else {
      // File
      const file: RepoFileNode = {
        name,
        path: item.path,
        type: 'file',
        size: item.size,
      };
      if (!parent.children) parent.children = [];
      parent.children.push(file);
    }
  }

  return root;
}

async function fetchFileContent(
  owner: string,
  repo: string,
  path: string,
  githubToken?: string
): Promise<string> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3.raw',
    'User-Agent': 'codefetch-cloudflare',
  };

  if (githubToken) {
    headers['Authorization'] = `token ${githubToken}`;
  }

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch file content: ${response.status}`);
  }

  return await response.text();
}

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
      // Get GitHub token from environment if available
      const githubToken = (context as any)?.GITHUB_TOKEN || import.meta.env.GITHUB_TOKEN;

      // Fetch repository structure
      const root = await fetchGitHubRepo(targetUrl, githubToken);

      // Parse owner and repo from URL
      const urlMatch = targetUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!urlMatch) {
        throw new Error('Invalid GitHub URL');
      }
      const [, owner, repo] = urlMatch;
      const cleanRepo = repo.replace(/\.git$/, '');

      // Store the repository structure
      const metadata = {
        url: targetUrl,
        source: 'github.com',
        gitRepo: `${owner}/${cleanRepo}`,
        totalFiles: 0,
        totalSize: 0,
      };

      // Count files and calculate size
      const countFiles = (node: RepoFileNode): void => {
        if (node.type === 'file') {
          metadata.totalFiles++;
          metadata.totalSize += node.size || 0;
        } else if (node.children) {
          node.children.forEach(countFiles);
        }
      };
      countFiles(root);

      // Store repository data
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
                title: metadata.gitRepo || 'Scraped Content',
                description: `Source: ${metadata.source || targetUrl}`,
                totalFiles: metadata.totalFiles,
                totalSize: metadata.totalSize,
              },
            };
            controller.enqueue(encoder.encode(JSON.stringify(metadataChunk) + '\n'));

            // Function to process tree nodes and fetch content for code files
            const processNode = async (node: RepoFileNode, parentPath: string = '') => {
              const { children, ...nodeData } = node;

              // For files, try to fetch content if it's a code file
              if (node.type === 'file' && node.path) {
                const ext = node.name.split('.').pop()?.toLowerCase() || '';
                const codeExtensions = [
                  'ts',
                  'tsx',
                  'js',
                  'jsx',
                  'py',
                  'java',
                  'cpp',
                  'c',
                  'h',
                  'hpp',
                  'cs',
                  'rb',
                  'go',
                  'rs',
                  'php',
                  'swift',
                  'kt',
                  'scala',
                  'r',
                  'md',
                  'json',
                  'yaml',
                  'yml',
                  'toml',
                  'xml',
                  'html',
                  'css',
                  'scss',
                ];

                if (codeExtensions.includes(ext) && (node.size || 0) < 100000) {
                  // Skip large files
                  try {
                    const content = await fetchFileContent(
                      owner,
                      cleanRepo,
                      node.path,
                      githubToken
                    );
                    (nodeData as any).content = content;
                  } catch (error) {
                    console.error(`Failed to fetch content for ${node.path}:`, error);
                  }
                }
              }

              // Send node data
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

      // Queue for embeddings if available
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
