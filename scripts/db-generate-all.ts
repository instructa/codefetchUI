#!/usr/bin/env tsx
/**
 * Generate Drizzle migrations for all database targets (main, auth, analytics).
 *
 * Usage: pnpm run db:generate:all
 */
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, relative } from 'node:path';
import dotenv from 'dotenv';

// Ensure .env is loaded so CLOUDFLARE_DATABASE_* vars are available
dotenv.config();

const targets = ['main', 'auth', 'analytics'] as const;

const root = dirname(fileURLToPath(import.meta.url));

for (const target of targets) {
  console.log(`\n🔄 Generating schema for ${target}…`);
  try {
    execSync('pnpm drizzle-kit generate', {
      stdio: 'inherit',
      env: {
        ...process.env,
        D1_TARGET: target,
        NODE_ENV: 'production', // use d1-http driver to avoid local SQLite requirement
      },
    });
  } catch (err) {
    console.error(`❌ Failed generating schema for ${target}`);
    process.exitCode = 1;
  }
}

console.log('\n✅ All Drizzle schemas generated.');
