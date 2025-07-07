<file_map>
/Users/kregenrek/projects/codefetchUI
├── src
│   ├── cloudflare
│   │   ├── api.ts
│   │   ├── consumer.ts
│   │   └── ConverterDO.ts
│   ├── hooks
│   │   └── use-streaming-scrape.ts
│   ├── lib
│   │   ├── stores
│   │   │   └── scraped-data.store.ts
│   │   ├── api-security.ts
│   │   └── rate-limiter.ts
│   ├── routes
│   │   ├── (dashboard)
│   │   │   ├── $url.tsx
│   │   │   └── index.tsx
│   │   ├── api
│   │   │   └── scrape.ts
│   │   └── md
│   │       └── index.tsx
│   └── global-middleware.ts
├── alchemy.run.ts
├── package.json
└── README.md

</file_map>

<file_contents>
File: /Users/kregenrek/projects/codefetchUI/README.md
md
# Constructa Starter

<div align="center">
  <img src="public/constructa_banner_.png" alt="Constructa Starter Banner" width="100%" />
</div>

<div align="center">
  <h2>AI-First SAAS Starter Kit</h2>
  <p>Optimized for coding with AI assistants • Powered by <a href="https://instructa.ai">instructa.ai</a></p>
</div>

> ⚠️ **Work in Progress** - This starter kit is currently under active development. Features and documentation may change frequently.


## ✨ Features

- 🔐 **Authentication** - Login/signup with email, GitHub & Google OAuth, password reset
- 📊 **Dashboard Templates** - AI Chat, Workflows, Documents, Image Chat, Charts (`/dashboard`)
- 🎨 **Marketing Pages** - Modern landing page with responsive design & dark/light mode
- 💾 **Database** - Local PostgreSQL with Docker, Supabase ready, Drizzle ORM
- 🤖 **AI-Optimized** - Cursor rules, consistent patterns, TypeScript for better AI coding
- 🛠️ **Developer Tools** - Hot reload, path aliases, Oxlint, Vitest, custom CLI


## 🚀 Quick Start

### Prerequisites
- Download & Install **[Node.js](https://nodejs.org/en)** 18+ 
- Download & Install **[Docker](https://www.docker.com/)** Desktop
- **pnpm** (recommended package manager)

### Installation
bash
# Clone the repository
npx gitpick git@github.com:instructa/constructa-starter.git my-app
cd my-app

# Install dependencies
pnpm install

# Start development server
pnpm dev
### Setup

# Create env file
cp .env.example .env

# Use CLI to kickstart your project
pnpm ex0 init
## Why?

Why start with a boilerplate when AI can generate almost an entire app for us? Because a solid foundation is still the most important part of building full-stack web applications. Even code generators like v0 or bolt.new bootstrap from a starter project. It provides consistency and a reliable point of departure.

On top of that, we can layer in helpful tooling such as AI rules (Cursor Rules, Agents.md, and more) and configuration settings that make it easier for Cursor, Claude, and similar tools to build your app. That’s the whole idea behind this project. It’s still in an early stage and not production-ready, but it’s already mature enough to create some cool things.


## Tech Stack

- **[TanStack Start](https://tanstack.com/start)** - Modern full-stack React framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible component library
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Modern utility-first CSS framework
- **[TypeScript](https://typescriptlang.org/)** - Full type safety
- **[TanStack Router](https://tanstack.com/router)** - Type-safe file-based routing
- **[Better Auth](https://better-auth.com/)** - Modern authentication library
- **[Better Auth UI](https://github.com/daveyplate/better-auth-ui)** - Pre-built React components for Better Auth
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM for PostgreSQL
- **[Oxlint](https://oxc.rs/docs/guide/usage/linter.html)** - Fast JavaScript/TypeScript linter
- **[Vitest](https://vitest.dev/)** - Lightning fast unit testing framework
- **Cursor Rules** - Pre-configured AI coding assistant rules for optimal development experience


### Project CLI (`pnpm ex0`)

This project includes a custom CLI tool for common tasks. Run it using `pnpm ex0 <command>`.


| Command    | Description                                                                | Args                 |
| :--------- | :------------------------------------------------------------------------- | :------------------- |
| `init`     | Initialize the project (dependencies, DB setup, Docker)                    |                      |
| `stop`     | Stop running Docker containers                                             |                      |
| `reload`   | Reload Docker containers with updated configuration                        |                      |
| `recreate` | Recreate Docker containers and volume (WARNING: deletes all data!)         |                      |
| `recreate` | Recreate Docker containers (use <code>--wipeVolume</code> to also delete the data volume) | `--wipeVolume` |
| `testdata` | Create or delete seed test data in the database                            | `--create`, `--delete` |
| `deploy`   | [TODO] Deploy the application                                              |                      |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory based on `.env.example`:
bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/constructa"

# Client-side Base URL (optional - defaults to current origin in production)
VITE_BASE_URL="http://localhost:3000"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Email Verification (disabled by default)
# Server-side email verification control
ENABLE_EMAIL_VERIFICATION="false"
# Client-side email verification control (for UI decisions)
VITE_ENABLE_EMAIL_VERIFICATION="false"

# Email Service Configuration (Resend is the default provider)
EMAIL_FROM="noreply@yourdomain.com"
RESEND_API_KEY="your-resend-api-key"

# OAuth Providers (optional)
# Server-side OAuth configuration
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Client-side OAuth configuration (for UI buttons)
VITE_GITHUB_CLIENT_ID="your-github-client-id"
VITE_GOOGLE_CLIENT_ID="your-google-client-id"
- `VITE_BASE_URL` is optional - in production, it will automatically use the current domain
- For local development, it defaults to `http://localhost:3000`

### Email Service Setup

The application supports **multiple email providers** for maximum flexibility. You can choose between console logging, Mailhog (for local development), SMTP, or Resend based on your needs.

#### Email Provider Options

1. **Console Provider** (Default for development)
   - Logs emails to the console
   - No external dependencies
   - Perfect for initial development
bash
   EMAIL_PROVIDER="console"
   
2. **Mailhog** (Recommended for local development)
   - Catches all emails locally
   - Web UI to view emails at http://localhost:8025
   - Already included in Docker Compose
bash
   EMAIL_PROVIDER="mailhog"
   # No additional configuration needed
   
Start Mailhog with Docker:
bash
   docker-compose up -d mailhog
   
3. **SMTP Provider** (For production or custom email servers)
bash
   EMAIL_PROVIDER="smtp"
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   
4. **Resend** (Modern email API)
bash
   EMAIL_PROVIDER="resend"
   RESEND_API_KEY="re_xxxxxxxxxxxx"
   
- Sign up at [resend.com](https://resend.com)
   - Create an API key in your dashboard
   - Add your domain and verify it (for production)

#### Common Email Configuration
bash
# Set the default "from" address
EMAIL_FROM="noreply@yourdomain.com"

# Enable email verification (optional)
ENABLE_EMAIL_VERIFICATION="true"
VITE_ENABLE_EMAIL_VERIFICATION="true"
#### Adding Custom Email Providers

The email system is designed to be extensible. To add a new provider:

1. **Create a new provider class** in `src/server/email/providers.ts`:
typescript
   export class MyCustomProvider implements EmailProvider {
     async sendEmail({ from, to, subject, html }) {
       // Your implementation here
     }
   }
   
2. **Add the provider to the factory** in `src/server/email/index.ts`:
typescript
   case "custom":
     emailProvider = new MyCustomProvider();
     break;
   
3. **Update your environment variables**:
bash
   EMAIL_PROVIDER="custom"
   # Add any custom configuration needed
   
#### Email Verification Behavior

**When disabled** (default):
- Users are automatically signed in after registration
- No verification email is sent
- Users are redirected directly to the dashboard

**When enabled**:
- Users must verify their email before signing in
- A verification email is sent upon registration
- Users are redirected to a "check your email" page
- Users cannot sign in until their email is verified

### OAuth Providers Setup

The application supports OAuth authentication with GitHub and Google. Here's how to set them up:

#### GitHub OAuth Setup

1. **Create a GitHub OAuth App:**
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"
   - Fill in the application details:
     - **Application name**: Your app name
     - **Homepage URL**: `http://localhost:3000` (for development)
     - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

2. **Get your credentials:**
   - After creating the app, copy the **Client ID**
   - Generate a new **Client Secret**

3. **Add to environment variables:**
bash
   # Server-side configuration
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   
   # Client-side configuration (for UI buttons)
   VITE_GITHUB_CLIENT_ID="your-github-client-id"
   
4. **For production deployment:**
   - Update the **Homepage URL** to your production domain
   - Update the **Authorization callback URL** to `https://yourdomain.com/api/auth/callback/github`

#### Google OAuth Setup

1. **Create a Google OAuth App:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"

2. **Configure OAuth consent screen:**
   - Fill in the required application information
   - Add your domain to authorized domains

3. **Create OAuth 2.0 Client ID:**
   - Application type: **Web application**
   - **Authorized JavaScript origins**: `http://localhost:3000` (for development)
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`

4. **Get your credentials:**
   - Copy the **Client ID** and **Client Secret**

5. **Add to environment variables:**
bash
   # Server-side configuration
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Client-side configuration (for UI buttons)
   VITE_GOOGLE_CLIENT_ID="your-google-client-id"
   
6. **For production deployment:**
   - Update authorized origins to your production domain
   - Update redirect URI to `https://yourdomain.com/api/auth/callback/google`

#### Testing OAuth Integration

Once configured, users will see GitHub and Google sign-in options on the authentication pages. The OAuth providers are conditionally enabled based on the presence of their respective environment variables.


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Links

- X/Twitter: [@kregenrek](https://x.com/kregenrek)
- Bluesky: [@kevinkern.dev](https://bsky.app/profile/kevinkern.dev)

## AI Academy & Courses
- Learn Cursor AI: [Ultimate Cursor Course](https://www.instructa.ai/en/cursor-ai)
- Learn to build software with AI: [instructa.ai](https://www.instructa.ai)

## See my other projects:

* [AI Prompts](https://github.com/instructa/ai-prompts/blob/main/README.md) - Curated AI Prompts for Cursor AI, Cline, Windsurf and Github Copilot
* [codefetch](https://github.com/regenrek/codefetch) - Turn code into Markdown for LLMs with one simple terminal command
* [aidex](https://github.com/regenrek/aidex) A CLI tool that provides detailed information about AI language models, helping developers choose the right model for their needs.# tool-starter


File: /Users/kregenrek/projects/codefetchUI/src/routes/(dashboard)/$url.tsx
tsx
import { isUrl } from '~/utils/is-url';
import { AlertCircle, Globe, RefreshCw, Loader2, FileCode, FolderOpen } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { useScrapedDataStore } from '~/lib/stores/scraped-data.store';
import { useEffect, useRef } from 'react';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';
import { useStreamingScrape } from '~/hooks/use-streaming-scrape';

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
  const hasStartedScraping = useRef(false);

  const { startScraping, cancel, isLoading, error, progress, metadata } = useStreamingScrape(url, {
    onComplete: (data, meta) => {
      setScrapedData(data, meta);

      // If we have a file path from URL and haven't set it yet, set it now
      if (filePath && !hasSetInitialFilePath.current) {
        setTimeout(() => {
          setSelectedFilePath(filePath);
          hasSetInitialFilePath.current = true;
        }, 0);
      }
    },
    onError: (err) => {
      console.error('[ValidUrlContent] Scraping error:', err);
    },
  });

  // Start scraping only on client side when component mounts or URL changes
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    if (!hasStartedScraping.current) {
      hasStartedScraping.current = true;
      startScraping();
    }
  }, [url, startScraping]);

  // Handle file path changes after initial load
  useEffect(() => {
    if (filePath && scrapedData && hasSetInitialFilePath.current) {
      setSelectedFilePath(filePath);
    }
  }, [filePath, scrapedData, setSelectedFilePath]);

  // Cleanup when component unmounts or URL changes
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        hasSetInitialFilePath.current = false;
        hasStartedScraping.current = false;
        cancel();
      }
    };
  }, [url, cancel]); // Keep cancel in deps to ensure we have the latest

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
              <Button onClick={() => startScraping()} variant="outline" disabled={isLoading}>
                {isLoading ? (
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
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Scraping Content
            </CardTitle>
            <CardDescription>
              {metadata ? `Fetching from ${metadata.title || url}` : `Fetching from ${url}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={progress * 100} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Loading file tree... {Math.round(progress * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
                <CardDescription>{metadata?.title || 'Website Content'}</CardDescription>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => startScraping()}
              disabled={isLoading}
            >
              {isLoading ? (
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

          {metadata?.scrapedAt && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Scraped</label>
              <p className="mt-1 text-sm">{new Date(metadata.scrapedAt).toLocaleString()}</p>
            </div>
          )}

          {metadata?.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="mt-1 text-sm">{metadata.description}</p>
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

      {!selectedFile && scrapedData && (
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


File: /Users/kregenrek/projects/codefetchUI/src/routes/(dashboard)/index.tsx
tsx
// import { AuthLoading, RedirectToSignIn, SignedIn } from '@daveyplate/better-auth-ui';
// import { redirect } from '@tanstack/react-router';

export const Route = createFileRoute({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      {/* Show loading skeleton while checking authentication */}
      {/* <AuthLoading>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </AuthLoading> */}

      {/* Redirect to sign-in if not authenticated */}
      {/* <RedirectToSignIn /> */}

      {/* Only show dashboard content to authenticated users */}
      {/* <SignedIn> */}
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p>Welcome to your dashboard!</p>
      </div>
      {/* </SignedIn> */}
    </>
  );
}


File: /Users/kregenrek/projects/codefetchUI/src/routes/api/scrape.ts
ts
import { createServerFileRoute } from '@tanstack/react-start/server';
import { fetch as codefetchFetch } from 'codefetch-sdk';
import { apiRateLimiter } from '~/lib/rate-limiter';
import { getApiSecurityConfig } from '~/lib/api-security';

export const ServerRoute = createServerFileRoute('/api/scrape').methods({
  GET: async ({ request }) => {
    const securityConfig = getApiSecurityConfig();

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

    if (!apiRateLimiter.isAllowed(clientIp)) {
      const resetTime = apiRateLimiter.getResetTime(clientIp);
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
      let codefetch;

      try {
        // First attempt: fetch with cache enabled (default behavior)
        codefetch = await codefetchFetch({ source: targetUrl, format: 'json' });
      } catch (error: any) {
        // Check if it's a cache-related error (ENOENT)
        if (error.code === 'ENOENT' && error.path?.includes('.codefetch-cache')) {
          console.warn('Cache error encountered, retrying without cache:', error.message);

          // Second attempt: fetch with cache disabled
          codefetch = await codefetchFetch({
            source: targetUrl,
            format: 'json',
            noCache: true,
          } as any);
        } else {
          // Re-throw if it's not a cache-related error
          throw error;
        }
      }
      // Fetch data from codefetch
      // const codefetch = await codefetchFetch({ source: targetUrl, format: 'json' });

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
            await processNode(codefetch.root);

            // Send completion signal
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'complete' }) + '\n'));
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      // Return streaming response with rate limit headers
      const remaining = apiRateLimiter.getRemainingRequests(clientIp);
      const resetTime = apiRateLimiter.getResetTime(clientIp);

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


File: /Users/kregenrek/projects/codefetchUI/src/global-middleware.ts
ts
import { registerGlobalMiddleware } from '@tanstack/react-start';
import { logMiddleware } from '~/utils/loggingMiddleware';

registerGlobalMiddleware({
  middleware: [logMiddleware],
});


File: /Users/kregenrek/projects/codefetchUI/package.json
json
{
  "name": "constructa-starter",
  "private": true,
  "sideEffects": false,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "start": "node .output/server/index.mjs",
    "test": "vitest",
    "test:auth": "vitest tests/auth-integration.test.ts",
    "test:auth:watch": "vitest tests/auth-integration.test.ts --watch",
    "db:pull": "npx drizzle-kit pull",
    "db:generate": "npx drizzle-kit generate",
    "db:migrate": "npx drizzle-kit migrate",
    "db:studio": "npx drizzle-kit studio",
    "lint": "oxlint",
    "lint:fix": "oxlint --fix",
    "auth:init": "npx -y @better-auth/cli@latest generate --config src/server/auth.ts --output src/server/db/auth.schema.ts",
    "ex0": "tsx cli/index.ts",
    "rules:setup": "./scripts/setup-ai-rules.sh",
    "rules:sync": "./scripts/setup-ai-rules.sh",
    "rules:list": "vibe-rules list",
    "deploy": "bun tsx --env-file .env ./alchemy.run.ts",
    "destroy": "bun tsx --env-file .env ./alchemy.run.ts --destroy",
    "dev:infra": "tsx infra/alchemy.run.ts --dev",
    "dev:cf-ui": "tanstack start dev --adapter=cloudflare",
    "cf:deploy": "bun tsx --env-file .env ./alchemy.run.ts"
  },
  "dependencies": {
    "@better-fetch/fetch": "^1.1.18",
    "@clack/prompts": "^0.11.0",
    "@daveyplate/better-auth-tanstack": "^1.3.6",
    "@daveyplate/better-auth-ui": "github:regenrek/better-auth-ui#main",
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/modifiers": "^9.0.0",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@hookform/resolvers": "^5.1.1",
    "@mastra/core": "^0.10.5",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@t3-oss/env-core": "^0.13.8",
    "@tanstack/react-query": "^5.80.6",
    "@tanstack/react-query-devtools": "^5.80.6",
    "@tanstack/react-router": "^1.121.0-alpha.22",
    "@tanstack/react-router-devtools": "^1.121.0-alpha.22",
    "@tanstack/react-start": "^1.121.0-alpha.25",
    "@tanstack/react-table": "^8.21.3",
    "@types/nodemailer": "^6.4.17",
    "ai": "^4.3.16",
    "alchemy": "^0.43.5",
    "ansis": "^4.1.0",
    "better-auth": "^1.2.9",
    "citty": "^0.1.6",
    "clsx": "^2.1.1",
    "codefetch-sdk": "1.5.2-alpha.0",
    "drizzle-kit": "^0.31.1",
    "drizzle-orm": "^0.44.2",
    "framer-motion": "^12.16.0",
    "lucide-react": "^0.513.0",
    "motion": "^12.16.0",
    "nodemailer": "^7.0.3",
    "pg": "^8.16.0",
    "postgres": "^3.4.7",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-hook-form": "^7.57.0",
    "recharts": "^2.15.3",
    "resend": "^4.6.0",
    "sonner": "^2.0.5",
    "tailwind-merge": "^3.3.0",
    "tailwindcss": "^4.1.8",
    "tsx": "^4.19.4",
    "vaul": "^1.1.2",
    "vibe-rules": "^0.3.41",
    "vite": "^6.3.5",
    "zod": "^3.25.56",
    "zustand": "^5.0.6"
  },
  "devDependencies": {
    "@napi-rs/cli": "^2.18.4",
    "@tailwindcss/postcss": "^4.1.8",
    "@tailwindcss/vite": "^4.1.8",
    "@tanstack/config": "^0.18.2",
    "@tanstack/react-router-with-query": "^1.120.20",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@types/node": "^22.15.30",
    "@types/pg": "^8.15.4",
    "@types/react": "^19.1.6",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^4.5.1",
    "autoprefixer": "^10.4.21",
    "better-sqlite3": "^11.10.0",
    "class-variance-authority": "^0.7.1",
    "dotenv": "^16.5.0",
    "oxlint": "^1.0.0",
    "prettier": "^3.5.3",
    "shadcn": "^2.6.1",
    "tailwindcss": "^4.1.6",
    "tw-animate-css": "^1.3.4",
    "typescript": "^5.8.3",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^3.2.3",
    "wrangler": "^4.23.0"
  },
  "packageManager": "pnpm@9.14.4+sha512.c8180b3fbe4e4bca02c94234717896b5529740a6cbadf19fa78254270403ea2f27d4e1d46a08a0f56c89b63dc8ebfd3ee53326da720273794e6200fcf0d184ab"
}


File: /Users/kregenrek/projects/codefetchUI/src/routes/md/index.tsx
tsx
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/md')({
  component: MdSpike,
});

function MdSpike() {
  const [repo, setRepo] = React.useState('vercel/next.js');
  const [sha,  setSha]  = React.useState('main');
  const [output, setOutput] = React.useState<string>('');

  async function convert() {
    setOutput('Requesting conversion…');
    const r = await fetch(`/convert?repo=${repo}&sha=${sha}`);
    if (r.status === 202) {
      /*  simple polling until artefact is ready  */
      const poll = setInterval(async () => {
        const res = await fetch(`/convert?repo=${repo}&sha=${sha}`);
        if (res.ok) {
          clearInterval(poll);
          setOutput(await res.text());
        }
      }, 1000);
    } else {
      setOutput(await r.text());
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Markdown Conversion Spike</h1>

      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <input
          className="border px-2 py-1 rounded-md w-full md:w-96"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="org/repo"
        />
        <input
          className="border px-2 py-1 rounded-md w-full md:w-40"
          value={sha}
          onChange={(e) => setSha(e.target.value)}
          placeholder="commit / branch"
        />
        <button
          className="bg-primary text-white px-4 py-1 rounded-md"
          onClick={convert}
        >
          Convert README
        </button>
      </div>

      <pre className="mt-6 whitespace-pre-wrap bg-muted p-4 rounded-md">
        {output}
      </pre>
    </div>
  );
}


File: /Users/kregenrek/projects/codefetchUI/src/cloudflare/api.ts
ts
export default {
  async fetch(req: Request, env: Env) {
    const url = new URL(req.url);

    // /convert?repo=<org/name>&sha=<commit>
    if (url.pathname !== '/convert') {
      return new Response('not found', { status: 404 });
    }

    const repo = url.searchParams.get('repo') ?? '';
    const sha = url.searchParams.get('sha') ?? '';

    if (!repo || !sha) {
      return new Response('bad request', { status: 400 });
    }

    /* 0️⃣  cache lookup */
    const key = `${repo}@${sha}`;
    const cached = await env.KV_CACHE.get(key);
    if (cached) {
      const obj = await env.FILES_R2.get(cached);
      return new Response(obj?.body, {
        headers: { 'content-type': 'text/markdown' },
      });
    }

    /* 1️⃣  enqueue a conversion job */
    await env.md_jobs.send({ repo, sha });
    return new Response('queued', { status: 202 });
  },
} satisfies ExportedHandler<Env>;

interface Env {
  KV_CACHE: KVNamespace;
  md_jobs: Queue<{ repo: string; sha: string }>;
  FILES_R2: R2Bucket;
}


File: /Users/kregenrek/projects/codefetchUI/src/cloudflare/consumer.ts
ts
import { ConverterDO } from './ConverterDO';
export { ConverterDO };

export default {
  async queue(batch: MessageBatch<Payload>, env: Env) {
    for (const msg of batch.messages) {
      const { repo, sha } = msg.body;
      const key = `${repo}@${sha}`;

      /* Call the per‑repo Durable Object to perform/ensure conversion */
      const id = env.Converter.idFromName(repo);
      const obj = env.Converter.get(id);

      const r2Key = await obj.fetch(`https://do/convert?sha=${sha}`).then((r) => r.text());

      /* Update KV so subsequent API calls are served from cache */
      await env.KV_CACHE.put(key, r2Key);
      msg.ack();
    }
  },
} satisfies QueueHandler<Payload, Env>;

interface Payload {
  repo: string;
  sha: string;
}
interface Env {
  Converter: DurableObjectNamespace;
  KV_CACHE: KVNamespace;
  FILES_R2: R2Bucket;
}


File: /Users/kregenrek/projects/codefetchUI/src/cloudflare/ConverterDO.ts
ts
import { fetch as codefetchFetch } from 'codefetch-sdk';

export class ConverterDO implements DurableObject {
  constructor(
    private readonly state: DurableObjectState,
    private readonly env: Env,
  ) {}

  /**
   * Converts the entire repository at the requested commit to Markdown using
   * codefetch‑sdk and stores the artefact in R2.
   *
   * URL: /convert?sha=<commitSha>
   * DO name == GitHub repo (e.g. "vercel/next.js")
   */
  async fetch(req: Request) {
    const url = new URL(req.url);
    const sha = url.searchParams.get('sha');
    if (!sha) {
      return new Response('Missing "sha" query parameter', { status: 400 });
    }

    const repo  = this.state.id.toString();          // DO name equals repo
    const r2Key = `${repo}-${sha}.md`;

    /* Skip conversion if artefact already exists */
    const head = await this.env.FILES_R2.head(r2Key);
    if (!head) {
      /* Build GitHub source URL understood by codefetch‑sdk */
      const sourceUrl = `github.com/${repo}`;

      let markdown: string;
      try {
        markdown = await codefetchFetch({
          source: sourceUrl,
          ref: sha,
          format: 'markdown',
        } as any);
      } catch (error: any) {
        /* Retry without cache on ENOENT (.codefetch-cache) errors */
        if (error.code === 'ENOENT' && error.path?.includes('.codefetch-cache')) {
          markdown = await codefetchFetch({
            source: sourceUrl,
            ref: sha,
            format: 'markdown',
            noCache: true,
          } as any);
        } else {
          console.error('[ConverterDO] codefetch error:', error);
          return new Response('Failed to convert repository', { status: 500 });
        }
      }

      if (typeof markdown !== 'string') {
        return new Response('Invalid response from codefetch‑sdk', { status: 500 });
      }

      await this.env.FILES_R2.put(r2Key, markdown, {
        httpMetadata: { contentType: 'text/markdown' },
      });
    }

    return new Response(r2Key);
  }
}

interface Env { FILES_R2: R2Bucket }


File: /Users/kregenrek/projects/codefetchUI/src/lib/stores/scraped-data.store.ts
ts
import { create } from 'zustand';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  language?: string;
  size?: number;
  tokens?: number;
  lastModified?: string;
  children?: FileNode[];
}

export interface ScrapedData {
  root: FileNode;
}

export interface ScrapedDataMetadata {
  url: string;
  scrapedAt: string;
  title?: string;
  description?: string;
}

interface ScrapedDataStore {
  scrapedData: ScrapedData | null;
  metadata: ScrapedDataMetadata | null;
  selectedFilePath: string | null;
  searchQuery: string;
  expandedPaths: Set<string>;
  urlExpandedPaths: Map<string, Set<string>>; // Store expanded paths per URL
  setScrapedData: (data: ScrapedData | null, metadata: ScrapedDataMetadata | null) => void;
  setSelectedFilePath: (path: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleExpandedPath: (path: string) => void;
  clearData: () => void;
  getFileByPath: (path: string) => FileNode | null;
  loadExpandedPathsForUrl: (url: string) => void;
  saveExpandedPathsForUrl: (url: string) => void;
}

const STORAGE_KEY = 'scraped-data-expanded-paths';

// Helper to get/set from localStorage
const getStoredExpandedPaths = (): Map<string, Set<string>> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Map();
    
    const parsed = JSON.parse(stored);
    const map = new Map<string, Set<string>>();
    
    Object.entries(parsed).forEach(([url, paths]) => {
      map.set(url, new Set(paths as string[]));
    });
    
    return map;
  } catch {
    return new Map();
  }
};

const saveStoredExpandedPaths = (map: Map<string, Set<string>>) => {
  try {
    const obj: Record<string, string[]> = {};
    map.forEach((paths, url) => {
      obj[url] = Array.from(paths);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {
    // Ignore localStorage errors
  }
};

export const useScrapedDataStore = create<ScrapedDataStore>((set, get) => ({
  scrapedData: null,
  metadata: null,
  selectedFilePath: null,
  searchQuery: '',
  expandedPaths: new Set<string>(),
  urlExpandedPaths: getStoredExpandedPaths(),

  setScrapedData: (data, metadata) => {
    const state = get();
    const currentUrl = state.metadata?.url;
    
    // Only reset selectedFilePath if we're switching to a different URL
    const shouldResetSelectedFile = currentUrl !== metadata?.url;
    
    // Save current expanded paths before switching
    if (currentUrl && state.expandedPaths.size > 0) {
      state.saveExpandedPathsForUrl(currentUrl);
    }
    
    set({ 
      scrapedData: data, 
      metadata,
      selectedFilePath: shouldResetSelectedFile ? null : state.selectedFilePath,
      searchQuery: '',
      expandedPaths: new Set<string>() // Will be loaded in loadExpandedPathsForUrl
    });
    
    // Load expanded paths for the new URL
    if (metadata?.url) {
      get().loadExpandedPathsForUrl(metadata.url);
    }
  },

  setSelectedFilePath: (path) => {
    set({ selectedFilePath: path });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  toggleExpandedPath: (path) => {
    set((state) => {
      const newExpandedPaths = new Set(state.expandedPaths);
      if (newExpandedPaths.has(path)) {
        newExpandedPaths.delete(path);
      } else {
        newExpandedPaths.add(path);
      }
      
      // Save to localStorage immediately
      if (state.metadata?.url) {
        const urlPaths = state.urlExpandedPaths;
        urlPaths.set(state.metadata.url, newExpandedPaths);
        saveStoredExpandedPaths(urlPaths);
      }
      
      return { expandedPaths: newExpandedPaths };
    });
  },

  clearData: () => {
    const state = get();
    
    // Save current expanded paths before clearing
    if (state.metadata?.url && state.expandedPaths.size > 0) {
      state.saveExpandedPathsForUrl(state.metadata.url);
    }
    
    set({
      scrapedData: null,
      metadata: null,
      selectedFilePath: null,
      searchQuery: '',
      expandedPaths: new Set<string>()
    });
  },

  getFileByPath: (path) => {
    const { scrapedData } = get();
    if (!scrapedData) return null;

    const findFile = (node: FileNode, targetPath: string): FileNode | null => {
      if (node.path === targetPath) return node;
      
      if (node.children) {
        for (const child of node.children) {
          const found = findFile(child, targetPath);
          if (found) return found;
        }
      }
      
      return null;
    };

    return findFile(scrapedData.root, path);
  },

  loadExpandedPathsForUrl: (url) => {
    set((state) => {
      const storedPaths = state.urlExpandedPaths.get(url);
      return {
        expandedPaths: storedPaths ? new Set(storedPaths) : new Set<string>()
      };
    });
  },

  saveExpandedPathsForUrl: (url) => {
    set((state) => {
      const newUrlPaths = new Map(state.urlExpandedPaths);
      newUrlPaths.set(url, new Set(state.expandedPaths));
      saveStoredExpandedPaths(newUrlPaths);
      return { urlExpandedPaths: newUrlPaths };
    });
  }
}));

// Helper function to search files
export const searchFiles = (node: FileNode, query: string): FileNode[] => {
  const results: FileNode[] = [];
  const lowerQuery = query.toLowerCase();

  const search = (currentNode: FileNode) => {
    if (currentNode.name.toLowerCase().includes(lowerQuery)) {
      results.push(currentNode);
    }

    if (currentNode.children) {
      currentNode.children.forEach(search);
    }
  };

  search(node);
  return results;
};


File: /Users/kregenrek/projects/codefetchUI/src/lib/rate-limiter.ts
ts
// Simple in-memory rate limiter for API endpoints
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Clean up old entries every minute
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.limits.entries()) {
        if (entry.resetTime < now) {
          this.limits.delete(key);
        }
      }
    }, 60000);
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    if (!entry || entry.resetTime < now) {
      // Create new entry or reset existing one
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const entry = this.limits.get(identifier);
    if (!entry || entry.resetTime < Date.now()) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - entry.count);
  }

  getResetTime(identifier: string): number {
    const entry = this.limits.get(identifier);
    return entry?.resetTime || 0;
  }
}

// Export singleton instance
export const apiRateLimiter = new RateLimiter(10, 60000); // 10 requests per minute


File: /Users/kregenrek/projects/codefetchUI/src/lib/api-security.ts
ts
// API Security Configuration
export const getApiSecurityConfig = () => {
  // Get additional allowed origins from environment
  // Note: Same-origin requests are always allowed automatically
  const additionalAllowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(origin => origin)
    : [];

  return {
    // These are additional origins beyond same-origin requests
    allowedOrigins: additionalAllowedOrigins,
    rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  };
};


File: /Users/kregenrek/projects/codefetchUI/src/hooks/use-streaming-scrape.ts
ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { FileNode, ScrapedData, ScrapedDataMetadata } from '~/lib/stores/scraped-data.store';

interface StreamChunk {
  type: 'metadata' | 'node' | 'complete';
  data?: any;
}

interface UseStreamingScrapeOptions {
  onComplete?: (data: ScrapedData, metadata: ScrapedDataMetadata) => void;
  onError?: (error: Error) => void;
}

export function useStreamingScrape(url: string | null, options: UseStreamingScrapeOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  const [metadata, setMetadata] = useState<ScrapedDataMetadata | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const nodesRef = useRef<Map<string, FileNode>>(new Map());
  const rootRef = useRef<FileNode | null>(null);
  const metadataRef = useRef<ScrapedDataMetadata | null>(null);


  const startScraping = useCallback(async () => {
    if (!url) {
      return;
    }

    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);
    nodesRef.current.clear();
    rootRef.current = null;
    metadataRef.current = null;

    try {
      abortControllerRef.current = new AbortController();
      
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`, {
        signal: abortControllerRef.current.signal,
      });


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';
      let nodeCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          
          // Process any remaining data in buffer
          if (buffer.trim()) {
            try {
              const chunk: StreamChunk = JSON.parse(buffer);
              
              if (chunk.type === 'complete') {
                setProgress(1);
                setIsLoading(false);
                
                if (rootRef.current && metadataRef.current) {
                  const scrapedData: ScrapedData = { root: rootRef.current };
                  options.onComplete?.(scrapedData, metadataRef.current);
                } else {
                }
              }
            } catch (err) {
              console.error('[useStreamingScrape] Error parsing final buffer:', err, buffer);
            }
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const chunk: StreamChunk = JSON.parse(line);

            switch (chunk.type) {
              case 'metadata':
                metadataRef.current = chunk.data;
                setMetadata(chunk.data);
                break;

              case 'node':
                const nodeData = chunk.data;
                const node: FileNode = {
                  name: nodeData.name,
                  path: nodeData.path,
                  type: nodeData.type,
                  size: nodeData.size,
                  lastModified: nodeData.lastModified,
                  language: nodeData.language,
                  tokens: nodeData.tokens,
                  content: nodeData.content,
                  children: nodeData.hasChildren ? [] : undefined,
                };

                nodesRef.current.set(node.path, node);
                nodeCount++;

                if (nodeCount % 50 === 0) {
                }

                // Update progress based on node count
                setProgress(Math.min(nodeCount / 100, 0.95)); // Cap at 95% until complete

                // Handle root node
                if (node.path === '') {
                  rootRef.current = node;
                } else {
                  // Add to parent's children
                  const parentPath = nodeData.parentPath;
                  const parent = nodesRef.current.get(parentPath);
                  if (parent && parent.children) {
                    parent.children.push(node);
                  }
                }
                break;

              case 'complete':
                setProgress(1);
                setIsLoading(false);
                
                if (rootRef.current && metadataRef.current) {
                  const scrapedData: ScrapedData = { root: rootRef.current };
                  options.onComplete?.(scrapedData, metadataRef.current);
                } else {
                }
                break;
            }
          } catch (err) {
            console.error('Error parsing chunk:', err);
          }
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
        } else {
          setError(err);
          options.onError?.(err);
        }
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [url, options]);

  // Cancel ongoing request
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    startScraping,
    cancel,
    isLoading,
    error,
    progress,
    metadata,
  };
}


File: /Users/kregenrek/projects/codefetchUI/alchemy.run.ts
ts
// infra/alchemy.run.ts  (run with:  node --loader ts-node/esm infra/alchemy.run.ts)

import alchemy from 'alchemy';
import {
  DOStateStore,
  TanStackStart,
  Worker,
  Queue,
  R2Bucket,
  DurableObjectNamespace,
  KVNamespace,
  D1Database, // optional analytics DB
} from 'alchemy/cloudflare';

const BRANCH = process.env.BRANCH_PREFIX ?? '';

/** 1️⃣  initialise the app & pick a state‑store */
const app = await alchemy('md-repo-tool', {
  stage: BRANCH || undefined, // isolates preview/staging stacks
  stateStore:
    process.env.ALCHEMY_STATE_STORE === 'cloudflare'
      ? (scope) => new DOStateStore(scope) // durable, multi‑developer state
      : undefined,
});

/** 2️⃣  global, read‑heavy cache (commit‑SHA → R2 key) */
export const KV_CACHE = await KVNamespace(`md-cache${BRANCH}`, {
  dev: { remote: true },
  adopt: true,
});

/** 3️⃣  blob storage for generated Markdown */
export const ARTEFACTS = await R2Bucket('md-artefacts', { dev: { remote: true }, adopt: true });

/** 4️⃣  queue that fan‑outs conversion jobs */
export const CONVERT_Q = await Queue<{ repo: string; sha: string }>(`convert-md${BRANCH}`, {
  dev: { remote: true },
  adopt: true,
});

/** 5️⃣  per‑repo DO with embedded 10 GB SQLite store */
export const ConverterDO = new DurableObjectNamespace('ConverterDO', {
  className: 'ConverterDO',
  sqlite: true,
  dev: { remote: true },
  adopt: true,
});

/** 6️⃣  HTTP+Edge‑function entry point (publishes jobs, serves cached files) */
export const api = await Worker(`md-api${BRANCH}`, {
  entrypoint: './src/cloudflare/api.ts',
  bindings: { KV_CACHE, CONVERT_Q, ARTEFACTS },
  url: true,
});

/** 7️⃣  queue‑consumer Worker (runs heavy conversion logic inside DO) */
export const consumer = await Worker(`md-consumer${BRANCH}`, {
  entrypoint: './src/cloudflare/consumer.ts',
  bindings: { ConverterDO, KV_CACHE, ARTEFACTS },
});

/** 8️⃣  TanStack Start site (SSR UI, static assets) */
export const website = await TanStackStart(`md-site${BRANCH}`, {
  api, // mounts the API under /api/*
});

/** 9️⃣  optional cross‑repo analytics DB */
export const ANALYTICS_DB = await D1Database(`md-analytics${BRANCH}`, {
  dev: { remote: true },
  adopt: true,
});

await app.finalize(); // ⇢ creates / updates / deletes

</file_contents>
<meta prompt 1 = "[Engineer]">
You are a senior software engineer whose role is to provide clear, actionable code changes. For each edit required:

1. Specify locations and changes:
   - File path/name
   - Function/class being modified
   - The type of change (add/modify/remove)

2. Show complete code for:
   - Any modified functions (entire function)
   - New functions or methods
   - Changed class definitions
   - Modified configuration blocks
   Only show code units that actually change.

3. Format all responses as:

   File: path/filename.ext
   Change: Brief description of what's changing
   
language
   [Complete code block for this change]

You only need to specify the file and path for the first change in a file, and split the rest into separate codeblocks.
</meta prompt 1>
<meta prompt 2 = "Latest 2025 ">
- always give latest 2025 june 22 best practices, frameworks & code results.
- best sources are github.com, forums, x.com and other blogs
</meta prompt 2>
<xml_formatting_instructions>
### Role
- You are an **architect**: In charge of planning detailed and exhaustive multi-file edits, and assisting users with code related inquiries that don't involve file edits.

### Capabilities
- Can create new files.
- Can delete existing files.
- Can produce instructions with placeholders for an external agent to finalize.
- Can rename or move files.

You can use placeholders for delegate edits, like // existing code here, for brevity. For create, show full code.

## Tools & Actions
1. **create** – Create a new file if it doesn’t exist.
2. **delete** – Remove a file entirely (empty <content>).
3. **rename** – Rename/move a file with `<new path="..."/>`.
4. **delegate edit** – Provide targetted code change instructions that will be integrated by another ai model. Indicate <complexity> to help route changes to the right model.

### **Format to Follow for Repo Prompt's Diff Protocol**

<chatName="Brief descriptive name of the change"/>

<Plan>
Describe your approach or reasoning here.
</Plan>

<file path="path/to/example.swift" action="one_of_the_tools">
  <change>
    <description>Brief explanation of this specific change</description>
    <content>
===
// Provide placeholders or partial code. Must also include <complexity> after </content>.
===
    </content>
    <complexity>3</complexity> <!-- Always required for delegate edits -->
  </change>
  <!-- Add more <change> blocks if you have multiple edits for the same file -->
</file>

#### Tools Demonstration
1. `<file path="NewFile.swift" action="create">` – Full file in <content>
2. `<file path="DeleteMe.swift" action="delete">` – Empty <content>
3. `<file path="DelegateMe.swift" action="delegate edit">` – Placeholders in <content>, each <change> must include <complexity>
4. `<file path="OldName.swift" action="rename">` – `<new path="NewName.swift"/>` with no <content>

## Format Guidelines
1. **General Guidelines**
   - Always Include `<chatName="Descriptive Name"/>` at the top, briefly summarizing the change/request.
   - Begin with a `<Plan>` block explaining your approach.
   - Use `<file path="Models/User.swift" action="...">`. Action must match an available tool.
   - Provide `<description>` within each `<change>` to clarify the specific change. Then `<content>` for the new or modified code. Additional rules depend on your capabilities.
2. **delegate edit**
   - `// <rm oldFoo()>`…`// </rm>` deletes, `// <add newFoo()>`…`// </add>` inserts; place `<add>` right after `<rm>` to show a replacement.
   - **One logical scope = one `<change>`** (all edits inside the same function, property, or small helper).
   - **One edited file = one `<file>` block**; put as many *non‑overlapping* `<change>` blocks inside as needed.
   - Show enough context in `<rm>`: keep at least the first & last lines (collapse big middles with `// …`)—if unsure, include extra lines.
   - Replacing an entire function/struct/class? **Skip `<rm>/<add>`**—paste the full new scope in `<content>` and note in `<description>` that it replaces the old one.
   - Label deletions: add a short tag after `<rm>` and repeat the target in `<description>` (e.g. “Remove legacy `fetchUser()` implementation”).
3. **create & delete**
   - **create**: For new files, put the full file in `<content>`.
   - **delete**: Provide an empty `<content>`. The file is removed.
4. **rename**
   - Provide `<new path="..."/>` inside the `<file>`, no `<content>` needed.
5. **encoding and escaping**
   - Escape quotes as `\"` and backslashes as `\\` where needed.

## Code Examples

-----
### Example: Create New File
<Plan>
Create a new RoundedButton for a custom Swift UIButton subclass.
</Plan>

<file path="Views/RoundedButton.swift" action="create">
  <change>
    <description>Create custom RoundedButton class</description>
    <content>
===
import UIKit
@IBDesignable
class RoundedButton: UIButton {
    @IBInspectable var cornerRadius: CGFloat = 0
}
===
    </content>
  </change>
</file>

-----
### Example: Delegate Edit
<chatName="Delegate Edit – Complex Add/Delete"/>
<Plan>
Replace a legacy networking block with async/await **and** switch the
UI colour assignment to a dark‑mode‑aware variant—all without rewriting
entire methods.
</Plan>

<file path="Networking/UserService.swift" action="delegate edit">
  <change>
    <description>Replace legacy networking with async/await</description>
    <content>
===
func loadUserData() async throws {
    // <rm legacy networking>
    NetworkService.requestOld(endpoint: .user) { data in
        // old completion‑handler logic
    }
    // </rm>

    // <add async/await networking>
    let data = try await api.fetchUser()
    handle(data)
    // </add>
}
===
    </content>
    <complexity>4</complexity>
  </change>
</file>

<file path="UI/HomeViewController.swift" action="delegate edit">
  <change>
    <description>Delete hard‑coded colour; add dark‑mode colour</description>
    <content>
===
func configureUI() {
    // existing setup code

    // <rm old colour assignment>
    view.backgroundColor = .white
    // </rm>

    // … other mid‑section code …

    // <add dark‑mode aware colour>
    view.backgroundColor = UIColor(named: "BackgroundColor")
    // </add>
}
===
    </content>
    <complexity>3</complexity>
  </change>
</file>

-----
### Example: Delete a File
<Plan>
Remove an obsolete file.
</Plan>

<file path="Obsolete/File.swift" action="delete">
  <change>
    <description>Completely remove the file from the project</description>
    <content>
===
===
    </content>
  </change>
</file>

-----
### Example: Rename a File
<Plan>
Rename OldName to NewName.
</Plan>

<file path="Models/OldName.swift" action="rename">
  <new path="Models/NewName.swift"/>
</file>

## Final Notes
1. **delegate edit**
   - Every `<change>` carries `<complexity>` 1‑10 and a clear `<description>`.
   - Exactly **one `<file>` block per edited file**; its `<change>` blocks must not overlap lines.
   - Merge edits that touch the same scope; split changes across distinct scopes.
   - Use `<rm>/<add>` only for precision deletes/inserts—keep `<rm>` minimal but unambiguous; better to include extra context than too little.
   - Avoid the use of +, - @@ diff markers. Rely only on the <rm> / <add> comments to indicate deletions and additions.
   - Full‑scope replacement? Paste the complete new function/struct in `<content>`—no markers needed—and state it’s a full replacement.
   - Removing the whole file? Skip delegate‑edit—use `action="delete"` instead.
2. **create & delete**
   - You can always **create** new files and **delete** existing files. Provide full code for create, and empty content for delete. Avoid creating files you know exist already.
   - If a file tree is provided, place your files logically within that structure. Respect the user’s relative or absolute paths.
3. **rename**
   - Use **rename** to move a file by adding `<new path="…"/>` and leaving `<content>` empty. This deletes the old file and materialises the new one with the original content.
   - After a rename, **do not** pair it with **delegate edit** on either the old **or** the new path in the same response.
   - Never reference the *old* path again, and never add a `<file action="create">` that duplicates the **new** path in the same run.
   - Ensure the destination path does **not** already exist and rename a given file **at most once per response**.
   - If the new file requires changes, first delete it, then create a fresh file with the desired content.
4. **additional formatting rules**
   - Wrap your final output in
XML … 
for clarity.
   - **Important:** do **not** wrap XML in CDATA tags (`<![CDATA[ … ]]>`). Repo Prompt expects raw XML exactly as shown in the examples.
5. **capabilities**
   - If you see mentions of capabilities not listed above in the user’s chat history, **do not** try to use them.
6. **chatName**
   - Always include `<chatName="Descriptive Name"/>` near the top when you produce multi-file or complex changes.
7. **Editing rules**
   - Never attempt to edit a file not listed in the user prompt's file_contents section.
   - If you must edit a file not in the file_contents block, ask the user to include it in their next message.
   - If the file is in the file_contents block, you have everything you need to successfuly complete the edit.
8. **escaping**
   - Escape quotes as `\"` and backslashes as `\\` if necessary.
9. **MANDATORY**
   - WHEN MAKING FILE CHANGES, YOU **MUST** USE THE XML FORMATTING CAPABILITIES SHOWN ABOVE—IT IS THE *ONLY* WAY FOR CHANGES TO BE APPLIED.
   - The final output must apply cleanly with **no leftover syntax errors**.
</xml_formatting_instructions>
<user_instructions>

  cause: undefined
}
[error]     md-consumer Failed to start Miniflare server
ERROR Scope failed md-repo-tool/kregenrek/md-consumer
WARN Scope is in error, skipping finalize
ERROR Scope failed md-repo-tool/kregenrek
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

Error: Failed to start Miniflare server for worker "md-consumer"
    at Object.onBuildEnd (/Users/kregenrek/projects/codefetchUI/node_modules/.pnpm/alchemy@0.43.5_@ai-sdk+openai-compatible@0.2.14_zod@3.25.56__@ai-sdk+openai@1.3.22_zod@3.25.5_a632xcocn6fui3tov2knuboyx4/node_modules/alchemy/src/cloudflare/worker.ts:1101:21)
    at async <anonymous> (/Users/kregenrek/projects/codefetchUI/node_modules/.pnpm/alchemy@0.43.5_@ai-sdk+openai-compatible@0.2.14_zod@3.25.56__@ai-sdk+openai@1.3.22_zod@3.25.5_a632xcocn6fui3tov2knuboyx4/node_modules/alchemy/lib/cloudflare/bundle/bundle-worker-dev.js:79:21)
    at async /Users/kregenrek/projects/codefetchUI/node_modules/.pnpm/esbuild@0.25.5/node_modules/esbuild/lib/main.js:1313:27 {
  [cause]: MiniflareCoreError [ERR_MODULE_STRING_SCRIPT]: Unable to resolve "script:1" dependency: imports are unsupported in string `script` without defined `scriptPath`
      at ModuleLocator.#visitModule (/Users/kregenrek/projects/codefetchUI/node_modules/.pnpm/miniflare@4.20250617.5/node_modules/miniflare/src/plugins/core/modules.ts:314:10)
      at Object.ImportDeclaration (/Users/kregenrek/projects/codefetchUI/node_modules/.pnpm/miniflare@4.20250617.5/node_modules/miniflare/src/plugins/core/modules.ts:225:10)
      at c (/Users/kregenrek/projects/codefetchUI/node_modules/.pnpm/acorn-walk@8.3.2/node_modules/acorn-walk/dist/walk.js:30:43)
      at Object.skipThrough (/Users/kregenrek/projects/codefetchUI/node_modules/.pnpm/acorn-walk@8.3.2/node_modules/acorn-walk/dist/walk.js:186:39)
      at c (/Users/kregenrek/projects/codefetchUI/node_modules/.pnpm/acorn-walk@8.3.2/node_modules/acorn-walk/dist/walk.js:29:24)
      at base.Program.base.BlockStatement.base.StaticBlock (/Users/kregenrek/projects/codefetchUI/node_modules/.pnpm/acorn-walk@8.3.2/node_modules/acorn-walk/dist/walk.js:198:7)
      at c (/Users/kregenrek/projects/codefetchUI/node_modules/.pnpm/acorn-walk@8.3.2/node_modules/acorn-walk/dist/walk.js:29:24)
      at simple (/Users/kregenrek/projects/codefetchUI/node_modules/.pnpm/acorn-walk@8.3.2/node_modules/acorn-walk/dist/walk.js:31:7)
      at ModuleLocator.#visitJavaScriptModule (/Users/kregenrek/projects/codefetchUI/node_modules/.pnpm/miniflare@4.20250617.5/node_modules/miniflare/src/plugins/core/modules.ts:252:3)
      at ModuleLocator.visitEntrypoint (/Users/kregenrek/projects/codefetchUI/node_modules/.pnpm/miniflare@4.20250617.5/node_modules/miniflare/src/plugins/core/modules.ts:185:8) {
    code: 'ERR_MODULE_STRING_SCRIPT',
    cause: undefined
  }
}

Node.js v20.19.3
(base) kregenrek@MacBookPro codefetchUI % 
**IMPORTANT** IF MAKING FILE CHANGES, YOU MUST USE THE AVAILABLE XML FORMATTING CAPABILITIES PROVIDED ABOVE – IT IS THE ONLY WAY FOR YOUR CHANGES TO BE APPLIED.
</user_instructions>


ChatGPT said:
Request for o3 pro
Reasoned for 4m 22s
XML
Copy
<chatName="Fix Miniflare import error in consumer worker"/>

<Plan>
Miniflare fails to start the **md‑consumer** queue worker because it’s handed a raw
script string that still contains `import` statements.  
Adding the `bundle: true` option to the Worker declaration forces Alchemy to run
esbuild bundling for this worker, producing a single file with no unresolved
imports.  This gives Miniflare a self‑contained script and eliminates the
“imports are unsupported in string `script`” error.
</Plan>

<file path="alchemy.run.ts" action="delegate edit">
  <change>
    <description>Enable bundling for the md‑consumer queue worker so all imports are inlined.</description>
    <content>
===
// …existing imports and preceding declarations …

/** 7️⃣  queue‑consumer Worker (runs heavy conversion logic inside DO) */
export const consumer = await Worker(`md-consumer${BRANCH}`, {
    entrypoint: './src/cloudflare/consumer.ts',
    bindings: { ConverterDO, KV_CACHE, ARTEFACTS },
    // <add bundle option>
    bundle: true,                    // ensure esbuild bundles modules for Miniflare
    // </add>
});
===
    </content>
    <complexity>2</complexity>
  </change>
</file>