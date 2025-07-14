import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import path from 'path';

const astGrepShim = path.resolve(__dirname, 'src/shims/ast-grep-napi.ts');

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({
      customViteReactPlugin: true,
      server: {
        preset: 'cloudflare',
        rollupConfig: {
          external: ['node:async_hooks'],
        },
      },
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@ast-grep/napi': astGrepShim,
    },
  },
});
