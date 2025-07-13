# Plan: Implement `codefetch-sdk` with Cloudflare Support

This document outlines the plan to replace the current data scraping implementation with the `@codefetch/sdk`, which provides enhanced capabilities including Cloudflare Worker support for fetching and converting repositories and websites to markdown.

## 1. Dependency Update: Switch to `@codefetch/sdk`

There appears to be a discrepancy between the installed package (`codefetch-sdk`) and the package mentioned in the provided documentation (`@codefetch/sdk`). To use the Cloudflare-enabled features described in `readme-cd-codefetch-sdk.md`, we need to use the `@codefetch/sdk` package.

**Action:**
1.  Uninstall the old package.
2.  Install the new package.

```bash
pnpm remove codefetch-sdk
pnpm add @codefetch/sdk@latest
```
*Note: The user mentioned version `1.5.3-alpha.0`. If this specific version is available under the new name, it should be used. `pnpm add @codefetch/sdk@1.5.3-alpha.0`*

## 2. Refactor API Endpoint (`src/routes/api/scrape.ts`)

The primary change will be in the `GET` handler of the `/api/scrape` route. We will replace the existing `codefetchFetch` call with the new `fetchFromWeb` function from `@codefetch/sdk`.

The current implementation streams a detailed JSON tree. The new implementation, according to the readme, will return a markdown string. This will simplify the endpoint significantly.

**Action:**
-   Modify `src/routes/api/scrape.ts` to implement the following logic.

```typescript
// src/routes/api/scrape.ts

import { createServerFileRoute } from '@tanstack/react-start/server';
import { fetchFromWeb } from '@codefetch/sdk'; // Assuming a node-compatible entrypoint
import { apiRateLimiter } from '~/lib/rate-limiter';
import { getApiSecurityConfig } from '~/lib/api-security';

export const ServerRoute = createServerFileRoute('/api/scrape').methods({
  GET: async ({ request }) => {
    // ... (keep existing security and rate limiting logic)

    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return Response.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    try {
      const result = await fetchFromWeb(targetUrl, {
        // For websites
        maxPages: 20,
        maxDepth: 2,
        
        // For GitHub repos
        maxFiles: 100,
        // Example extensions, can be parameterized
        extensions: ['.ts', '.js', '.md', '.tsx', '.jsx'],
        excludeDirs: ["node_modules", "dist", "build"],
        githubToken: process.env.GITHUB_TOKEN, // Use environment variable
        
        // General options
        verbose: 1,
      });

      // The new SDK returns markdown directly
      return new Response(result.markdown, {
        headers: { 
          'Content-Type': 'text/markdown; charset=utf-8',
          // ... (add rate limit headers back)
        },
      });

    } catch (error: any) {
      console.error("Fetch error:", error);
      // Add specific error handling based on readme examples
      if (error.message.includes("exceeds Worker storage limit")) {
          return new Response("Repository too large. Try filtering files.", { 
              status: 413 
          });
      }
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  },
});

```

**Note on imports:** The readme specifies `import { fetchFromWeb } from "@codefetch/sdk/worker";`. This might be specific to a Cloudflare Worker environment. We may need to use `import { fetchFromWeb } from "@codefetch/sdk";` if a Node.js-compatible entry point exists. This needs to be verified during implementation.

## 3. Frontend Adaptation

The current frontend is likely expecting a stream of `ndjson` from the `/api/scrape` endpoint (as seen in `use-streaming-scrape.ts`). This will need to be updated to handle a plain `text/markdown` response.

**Action:**
-   Locate the frontend code that calls `/api/scrape` (likely in `~/hooks/use-streaming-scrape.ts`).
-   Modify the fetching logic to expect a single markdown response.
-   Update the UI components that render the scraped data to display markdown instead of the file tree.

## 4. Environment Variables

The new implementation uses `process.env.GITHUB_TOKEN` to access private repositories and get a higher API rate limit from GitHub.

**Action:**
-   Add `GITHUB_TOKEN` to your `.env.example` file.
-   Instruct developers to create a `.env` file and add their personal GitHub token.

**.env.example:**
```
GITHUB_TOKEN=""
```

## 5. Verification and Testing

After implementing the changes, we need to verify that the new flow works correctly.

**Action:**
1.  Start the development server.
2.  Test the scraping functionality in the UI with a public GitHub repository URL.
3.  Verify that the markdown content is fetched and displayed correctly.
4.  If possible, test with a private repository to ensure the `GITHUB_TOKEN` is being used correctly.
5.  Check the browser's network tab to confirm the response from `/api/scrape` is now `text/markdown`. 