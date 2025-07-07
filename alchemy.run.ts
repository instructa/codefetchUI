import alchemy from "alchemy";
import { R2Bucket, KVNamespace, D1Database, Worker } from "alchemy/cloudflare";

// Get stage from environment or CLI
const stage = process.env.STAGE || "dev";

// Create the app with R2 state store configuration
const app = await alchemy("codefetch-ui", {
  stage,
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

// TODO: Create the main worker (after we configure the build)
// const worker = await Worker("api", {
//   entrypoint: "./.output/server/index.mjs",
//   bindings: {
//     DB: database,
//     ANALYTICS_DB: analyticsDb,
//     SESSIONS: sessionsKV,
//     CACHE: cacheKV,
//     UPLOADS: uploadsBucket,
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