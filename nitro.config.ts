import { defineNitroConfig } from 'nitro/config';

export default defineNitroConfig({
  preset: 'cloudflare_module',
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
