import alchemy from "alchemy";
import { R2Bucket, KVNamespace, D1Database } from "alchemy/cloudflare";
import { config } from "dotenv";

// Load environment variables
config();

// Check for Cloudflare credentials
if (!process.env.CLOUDFLARE_API_TOKEN) {
  console.error("❌ Missing CLOUDFLARE_API_TOKEN!");
  console.error("\nYou can create an API token at: https://dash.cloudflare.com/profile/api-tokens");
  console.error("Required permissions:");
  console.error("  - Account:Cloudflare Workers:Edit");
  console.error("  - Account:D1:Edit");
  console.error("  - Zone:Workers Routes:Edit (if using custom domains)");
  process.exit(1);
}

// Debug: Log that env vars are loaded
console.log("✅ API Token loaded:", process.env.CLOUDFLARE_API_TOKEN.substring(0, 10) + "...");

if (!process.env.CLOUDFLARE_ACCOUNT_ID) {
  console.error("❌ Missing CLOUDFLARE_ACCOUNT_ID!");
  console.error("\nFind your account ID at: https://dash.cloudflare.com/ (in the right sidebar)");
  process.exit(1);
}

// Check for Alchemy password for secret encryption
if (!process.env.ALCHEMY_PASSWORD) {
  console.error("❌ Missing ALCHEMY_PASSWORD!");
  console.error("This is required for encrypting secrets.");
  console.error("Add ALCHEMY_PASSWORD=your-secure-password to your .env file");
  process.exit(1);
}

// Get stage from environment or CLI
const stage = process.env.STAGE || "dev";

// Create the app with password for secret encryption
const app = await alchemy("codefetch-ui", {
  stage,
  password: process.env.ALCHEMY_PASSWORD,
  // We'll add R2 state store configuration later after creating the bucket
});

console.log(`🚀 Deploying CodeFetch UI to stage: ${app.stage}`);
console.log(`📦 Phase: ${app.phase}`);

// Create R2 bucket for state storage (we'll use this in a future update)
const stateBucket = await R2Bucket("state-store", {
  name: `codefetch-ui-state-${app.stage}`,
  adopt: true, // Adopt existing bucket if it exists
});

// Create R2 bucket for file uploads/storage if needed
const uploadsBucket = await R2Bucket("uploads", {
  name: `codefetch-ui-uploads-${app.stage}`,
  adopt: true,
});

// Create KV namespace for sessions and cache
const sessionsKV = await KVNamespace("sessions", {
  title: `CodeFetch UI Sessions - ${app.stage}`,
  adopt: true,
});

const cacheKV = await KVNamespace("cache", {
  title: `CodeFetch UI Cache - ${app.stage}`,
  adopt: true,
});

// Create D1 database for application data
const database = await D1Database("main-db", {
  name: `codefetch-ui-db-${app.stage}`,
  adopt: true,
});

// Analytics database for logging and metrics
const analyticsDb = await D1Database("analytics", {
  name: `codefetch-ui-analytics-${app.stage}`,
  adopt: true,
});

// Prepare encrypted secrets for the worker
const secrets = {
  // Database URL (will need to be transformed for D1 later)
  DATABASE_URL: alchemy.secret(process.env.DATABASE_URL || ""),
  
  // Authentication
  BETTER_AUTH_SECRET: alchemy.secret(process.env.BETTER_AUTH_SECRET || ""),
  BETTER_AUTH_URL: alchemy.secret(process.env.BETTER_AUTH_URL || "https://codefetch-ui.workers.dev"),
  SESSION_COOKIE_NAME: alchemy.secret(process.env.SESSION_COOKIE_NAME || "codefetch_session"),
  
  // Email Configuration
  RESEND_API_KEY: alchemy.secret(process.env.RESEND_API_KEY || ""),
  EMAIL_FROM: alchemy.secret(process.env.EMAIL_FROM || "noreply@codefetch.dev"),
  ENABLE_EMAIL_VERIFICATION: alchemy.secret(process.env.ENABLE_EMAIL_VERIFICATION || "false"),
  
  // OAuth Providers (optional)
  GITHUB_CLIENT_ID: alchemy.secret(process.env.GITHUB_CLIENT_ID || ""),
  GITHUB_CLIENT_SECRET: alchemy.secret(process.env.GITHUB_CLIENT_SECRET || ""),
  GOOGLE_CLIENT_ID: alchemy.secret(process.env.GOOGLE_CLIENT_ID || ""),
  GOOGLE_CLIENT_SECRET: alchemy.secret(process.env.GOOGLE_CLIENT_SECRET || ""),
  
  // CodeFetch SDK
  CODEFETCH_API_KEY: alchemy.secret(process.env.CODEFETCH_API_KEY || ""),
  
  // Environment
  NODE_ENV: alchemy.secret(app.stage === "prod" ? "production" : "development"),
};

// TODO: Create the main worker (after we configure the build)
// const worker = await Worker("api", {
//   entrypoint: "./.output/server/index.mjs",
//   bindings: {
//     // Databases
//     DB: database,
//     ANALYTICS_DB: analyticsDb,
//     
//     // Storage
//     SESSIONS: sessionsKV,
//     CACHE: cacheKV,
//     UPLOADS: uploadsBucket,
//     
//     // Secrets
//     ...secrets,
//   },
// });

// Clean up orphaned resources
await app.finalize();

console.log("✅ Infrastructure setup complete!");
console.log("\n📋 Resources created:");
console.log(`  - State Bucket: ${stateBucket.name}`);
console.log(`  - Uploads Bucket: ${uploadsBucket.name}`);
console.log(`  - Sessions KV: ${sessionsKV.title}`);
console.log(`  - Cache KV: ${cacheKV.title}`);
console.log(`  - Main Database: ${database.name}`);
console.log(`  - Analytics Database: ${analyticsDb.name}`);