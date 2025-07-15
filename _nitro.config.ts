import fs from 'node:fs';
import path from 'node:path';

/**
 * Inline the TanStack‑Start Vite manifest for Nitro’s server build.
 * Without this, the virtual ID `tanstack-start-manifest:*` is treated
 * as an external and Cloudflare‑module preset aborts the build.
 */
export default {
  rollupConfig: {
    plugins: [
      {
        name: 'tanstack-start-manifest-resolver',

        resolveId(id) {
          if (id.startsWith('tanstack-start-manifest:')) {
            // \0 prefix tells Rollup this is an internal virtual module.
            return '\0' + id;
          }
          return null;
        },

        load(id) {
          if (id.startsWith('\0tanstack-start-manifest:')) {
            const manifestPath = path.resolve(
              process.cwd(),
              '.tanstack',
              'start',
              'build',
              'client-dist',
              '.vite',
              'manifest.json'
            );

            const json = fs.readFileSync(manifestPath, 'utf-8');
            return `export default ${json};`;
          }
          return null;
        },
      },
    ],
  },
};
