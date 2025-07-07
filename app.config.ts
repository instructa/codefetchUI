export default {
  server: {
    preset: 'cloudflare',
    rollupConfig: {
      external: ['node:async_hooks'],
    },
  },
};