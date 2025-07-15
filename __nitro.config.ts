import { readFileSync } from 'node:fs';

// nitro.config.ts
export default {
  rollupConfig: {
    plugins: [
      {
        name: 'tanstack-start-manifest-resolver',
        resolveId(id) {
          if (
            id.startsWith('tanstack-start-manifest:') ||
            id.startsWith('tanstack-start-server-fn-manifest:')
          ) {
            return '\0' + id;
          }
        },
        load(id) {
          if (id.startsWith('\0tanstack-start-manifest:')) {
            const json = readFileSync(
              '.tanstack/start/build/client-dist/.vite/manifest.json',
              'utf8'
            );
            return `export default ${json}`;
          }
          if (id.startsWith('\0tanstack-start-server-fn-manifest:')) {
            const json = readFileSync('.tanstack/start/build/server-fn-manifest.json', 'utf8');
            return `export default ${json}`;
          }
          return null;
        },
      },
    ],
  },
};
