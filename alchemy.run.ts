import alchemy from 'alchemy';
import {
  TanStackStart,
  R2Bucket,
  KVNamespace,
  D1Database,
  Queue,
  DurableObjectNamespace,
  AiGateway,
  Ai,
} from 'alchemy/cloudflare';
// Vectorize might need to be imported separately or might not be available yet
import { config } from 'dotenv';

// Load environment variables
config();

// Check for Cloudflare credentials
if (!process.env.CLOUDFLARE_API_TOKEN) {
  console.error('❌ Missing CLOUDFLARE_API_TOKEN!');
  console.error('\nYou can create an API token at: https://dash.cloudflare.com/profile/api-tokens');
  console.error('Required permissions:');
  console.error('  - Account:Cloudflare Workers:Edit');
  console.error('  - Account:D1:Edit');
  console.error('  - Zone:Workers Routes:Edit (if using custom domains)');
  process.exit(1);
}

// Debug: Log that env vars are loaded
console.log('✅ API Token loaded:', process.env.CLOUDFLARE_API_TOKEN.substring(0, 10) + '...');

if (!process.env.CLOUDFLARE_ACCOUNT_ID) {
  console.error('❌ Missing CLOUDFLARE_ACCOUNT_ID!');
  console.error('\nFind your account ID at: https://dash.cloudflare.com/ (in the right sidebar)');
  process.exit(1);
}

// Check for Alchemy password for secret encryption
if (!process.env.ALCHEMY_PASSWORD) {
  console.error('❌ Missing ALCHEMY_PASSWORD!');
  console.error('This is required for encrypting secrets.');
  console.error('Add ALCHEMY_PASSWORD=your-secure-password to your .env file');
  process.exit(1);
}

// Get stage from environment or CLI
const stage = process.env.STAGE || 'dev';

// Create the app with password for secret encryption
const app = await alchemy('codefetch-ui', {
  stage,
  password: process.env.ALCHEMY_PASSWORD,
});

console.log(`🚀 Deploying CodeFetch UI to stage: ${app.stage}`);
console.log(`📦 Phase: ${app.phase}`);

// Create R2 bucket for state storage (we'll use this in a future update)
const stateBucket = await R2Bucket('state-store', {
  name: `codefetch-ui-state-${app.stage}`,
  adopt: true, // Adopt existing bucket if it exists
});

// Create R2 bucket for file uploads/storage if needed
const uploadsBucket = await R2Bucket('uploads', {
  name: `codefetch-ui-uploads-${app.stage}`,
  adopt: true,
});

// Create KV namespace for sessions and cache
const sessionsKV = await KVNamespace('sessions', {
  title: `CodeFetch UI Sessions - ${app.stage}`,
  adopt: true,
});

const cacheKV = await KVNamespace('cache', {
  title: `CodeFetch UI Cache - ${app.stage}`,
  adopt: true,
});

// Create D1 database for application data
const mainDb = await D1Database('main-db', {
  name: `codefetch-ui-db-${app.stage}`,
  adopt: true,
  migrationsDir: './drizzle/main',
});

// Analytics database for logging and metrics
const analyticsDb = await D1Database('analytics', {
  name: `codefetch-ui-analytics-${app.stage}`,
  adopt: true,
  migrationsDir: './drizzle/analytics',
});

// Queue for background tasks
const embedQueue = await Queue('embed-queue', {
  name: `codefetch-embed-${app.stage}`,
  adopt: true,
});

const authDb = await D1Database('auth-db', {
  name: `codefetch-auth-${app.stage}`,
  adopt: true,
  migrationsDir: './drizzle/auth',
});

const aiLimit = await AiGateway('ai-rpm', {
  rateLimitingInterval: 60, // seconds
  rateLimitingLimit: 100, // requests per window
  rateLimitingTechnique: 'sliding',
});

const quotaDO = DurableObjectNamespace('QuotaDO', {
  className: 'QuotaDO',
  sqlite: true,
});

// Prepare encrypted secrets for the worker
const secrets = {
  // Authentication
  BETTER_AUTH_SECRET: alchemy.secret(process.env.BETTER_AUTH_SECRET || ''),
  BETTER_AUTH_URL: alchemy.secret(
    process.env.BETTER_AUTH_URL || 'https://codefetch-ui.workers.dev'
  ),
  SESSION_COOKIE_NAME: alchemy.secret(process.env.SESSION_COOKIE_NAME || 'codefetch_session'),

  // Email Configuration
  RESEND_API_KEY: alchemy.secret(process.env.RESEND_API_KEY || ''),
  EMAIL_FROM: alchemy.secret(process.env.EMAIL_FROM || 'noreply@codefetch.dev'),
  ENABLE_EMAIL_VERIFICATION: alchemy.secret(process.env.ENABLE_EMAIL_VERIFICATION || 'false'),

  // OAuth Providers (optional)
  GITHUB_CLIENT_ID: alchemy.secret(process.env.GITHUB_CLIENT_ID || ''),
  GITHUB_CLIENT_SECRET: alchemy.secret(process.env.GITHUB_CLIENT_SECRET || ''),
  GOOGLE_CLIENT_ID: alchemy.secret(process.env.GOOGLE_CLIENT_ID || ''),
  GOOGLE_CLIENT_SECRET: alchemy.secret(process.env.GOOGLE_CLIENT_SECRET || ''),

  // CodeFetch SDK
  CODEFETCH_API_KEY: alchemy.secret(process.env.CODEFETCH_API_KEY || ''),

  // Environment
  NODE_ENV: alchemy.secret(app.stage === 'prod' ? 'production' : 'development'),

  MONTHLY_TOKEN_LIMIT: alchemy.secret(process.env.MONTHLY_TOKEN_LIMIT || '1000000'),
};

// ------------------------------------------------------------
// Deploy the TanStack Start site (v1.126) using the new helper
// ------------------------------------------------------------

const site = await TanStackStart('codefetch-ui', {
  // Build command – override if you have a custom one
  command: 'pnpm run build',

  // Make all previously-created resources available to the app
  bindings: {
    // Storage (KV and R2)
    SESSIONS: sessionsKV,
    CACHE: cacheKV,
    UPLOADS: uploadsBucket,
    DATABASE: mainDb,

    // Rate-limit KV alias
    RATE_LIMIT_KV: cacheKV,

    // Secrets
    ...secrets,

    // Cloudflare AI Gateway + Workers AI
    AI: aiLimit,

    // Queue + Analytics + DBs
    EMBED_QUEUE: embedQueue,
    ANALYTICS: analyticsDb,
    AUTH_DB: authDb,

    // Custom bindings used by our server routes
    AI_RATELIMIT: aiLimit,
    QUOTA_DO: quotaDO,
    AI_GATEWAY_URL: alchemy.secret(process.env.AI_GATEWAY_URL || 'https://gw.example.ai'),
  },
});

export { site as worker };

// Deploy the embed worker separately
// TODO: Uncomment when Vectorize is available and configured
// const embedWorker = await Worker('embed-worker', {
//   name: `codefetch-embed-worker-${app.stage}`,
//   script: './src/cloudflare/workers/embed.worker.ts',
//   bindings: {
//     EMBED_QUEUE: embedQueue,
//     // Add any other bindings the embed worker needs
//     // CF_VECTORIZE_INDEX: vectorizeIndex, // When Vectorize is available
//     // CF_AI_MODEL: 'text-embedding-ada-002', // Or whatever model you're using
//   },
// });

// Clean up orphaned resources
await app.finalize();

console.log('✅ Infrastructure setup complete!');
console.log('\n📋 Resources created:');
console.log(`  - State Bucket: ${stateBucket.name}`);
console.log(`  - Uploads Bucket: ${uploadsBucket.name}`);
console.log(`  - Sessions KV: ${sessionsKV.title}`);
console.log(`  - Cache KV: ${cacheKV.title}`);
console.log(`  - Main Database: ${mainDb.name}`);
console.log(`  - Analytics Database: ${analyticsDb.name}`);
console.log(`  - TanStack Start site: ${site.name}`);

if (site.url) {
  console.log(`\n🌐 Site deployed at: ${site.url}`);
  console.log(`\n🧪 Test your API:`);
  console.log(`  curl "${site.url}/api/scrape?url=https://github.com/facebook/react"`);
}
