export default {
  rollupConfig: {
    external: [
      'tanstack-start-route-tree:v',
      'tanstack-start-manifest:v',
      /^tanstack-start-/,
    ],
  },
  experimental: {
    wasm: true,
  },
};