#!/usr/bin/env node

// This script creates a bundled deployment for Cloudflare Workers
// It works around the TanStack Start virtual module issues

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile, writeFile } from 'fs/promises';
import { build } from 'esbuild';
import path from 'path';

const execAsync = promisify(exec);

async function deploy() {
  console.log('🔨 Building TanStack Start app...');
  
  // First, build the app
  await execAsync('pnpm run build:prod');
  
  console.log('📦 Creating bundled worker...');
  
  // Bundle everything into a single file
  await build({
    entryPoints: ['.output/server/index.mjs'],
    bundle: true,
    outfile: 'dist/worker.js',
    platform: 'browser',
    format: 'esm',
    external: [
      'node:*',
      'cloudflare:workers',
    ],
    conditions: ['worker', 'browser'],
    mainFields: ['browser', 'module', 'main'],
    target: 'es2022',
    minify: true,
    sourcemap: false,
    alias: {
      'tanstack-start-manifest:v': './src/shims/empty.js',
      'tanstack-start-route-tree:v': './src/shims/empty.js',
      'tanstack-start-server-fn-manifest:v': './src/shims/empty.js',
    },
  });
  
  console.log('🚀 Deploying to Cloudflare...');
  
  // Deploy the bundled worker
  await execAsync('npx wrangler deploy dist/worker.js --assets .output/public');
  
  console.log('✅ Deployment complete!');
}

deploy().catch(console.error);