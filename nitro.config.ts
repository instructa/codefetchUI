import { defineNitroConfig } from 'nitropack/config';

/**
 * During Nitro's internal Rollup build the TanStack Start virtual modules that Vite
 * already handled (`tanstack-start-route-tree:v`, etc.) are no longer available.
 * We provide a small Rollup plugin that stubs these ids so the resolver doesn't
 * fail.  The exported objects are never used at runtime for our use-case
 * (reactStartCookies only needs `setCookie`), so an empty module is sufficient.
 */
function tanstackVirtualModules() {
  const virtualIds = [
    'tanstack-start-route-tree:v',
    'tanstack-start-manifest:v',
    'tanstack-start-server-fn-manifest:v',
  ];

  return {
    name: 'tanstack-virtual-modules',
    resolveId(id: string) {
      if (virtualIds.includes(id)) {
        // mark as resolved so Rollup stops searching on file system
        return id;
      }
      return null;
    },
    load(id: string) {
      if (virtualIds.includes(id)) {
        // Return an empty stub; nothing from these modules is required
        return 'export default {}';
      }
      return null;
    },
  };
}

export default defineNitroConfig({
  rollupConfig: {
    plugins: [tanstackVirtualModules()],
    output: {
      format: 'es',
    },
  },
  preset: 'cloudflare-module',
  experimental: {
    wasm: true,
  },
  // Remove the problematic unenv and alias configurations
  // These are causing type errors and build failures
});
