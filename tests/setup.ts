import { vi } from 'vitest';

// Minimal Vectorize mock
vi.mock('@cloudflare/vectorize', () => {
  class VectorizeMock {
    constructor() {}
    async upsert() {}
    async query() {
      return { ids: [], values: [] };
    }
  }
  return { Vectorize: VectorizeMock };
});

// Minimal Workers AI mock
vi.mock('@cloudflare/ai', () => {
  return {
    ai: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      embedding: async (text: string) => Array(768).fill(0),
    },
  };
});
