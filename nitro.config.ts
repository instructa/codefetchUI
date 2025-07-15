import { defineNitroConfig } from 'nitropack/config';

export default defineNitroConfig({
  preset: 'cloudflare',
  rollupConfig: {
    external: [
      'node:async_hooks',
      'cloudflare:workers',
      'tanstack-start-manifest:v',
      'tanstack-start-route-tree:v',
      'tanstack-start-server-fn-manifest:v',
    ],
  },
});