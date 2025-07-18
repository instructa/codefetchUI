import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import { createWorker } from '../setup';

describe('Non-Streaming Scrape API Tests', () => {
  let worker: any;

  beforeAll(async () => {
    worker = await createWorker();
  });

  afterAll(async () => {
    if (worker) {
      await worker.stop();
    }
  });

  test('should default to non-streaming mode when stream parameter is not provided', async () => {
    const request = new Request(
      'http://localhost/api/scrape?url=https://github.com/example/test-repo',
      {
        method: 'GET',
        headers: {
          Origin: 'http://localhost',
        },
      }
    );

    const response = await worker.fetch(request);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/x-ndjson');

    const text = await response.text();
    const lines = text.trim().split('\n');
    const chunks = lines.map((line) => JSON.parse(line));

    // Should have metadata, nodes, and complete
    expect(chunks.length).toBeGreaterThan(2);
    expect(chunks[0].type).toBe('metadata');
    expect(chunks[chunks.length - 1].type).toBe('complete');

    // Metadata should have all required fields
    const metadata = chunks[0].data;
    expect(metadata).toHaveProperty('url');
    expect(metadata).toHaveProperty('scrapedAt');
    expect(metadata).toHaveProperty('title');
    expect(metadata).toHaveProperty('description');
  });

  test('should return complete file tree structure in non-streaming mode', async () => {
    const request = new Request(
      'http://localhost/api/scrape?url=https://github.com/example/test-repo',
      {
        method: 'GET',
        headers: {
          Origin: 'http://localhost',
        },
      }
    );

    const response = await worker.fetch(request);
    const text = await response.text();
    const lines = text.trim().split('\n');
    const chunks = lines.map((line) => JSON.parse(line));

    // Find all node chunks
    const nodeChunks = chunks.filter((c) => c.type === 'node');
    expect(nodeChunks.length).toBeGreaterThan(0);

    // Check node structure
    const rootNode = nodeChunks.find((n) => n.data.path === '');
    expect(rootNode).toBeDefined();
    expect(rootNode.data.type).toBe('directory');
    expect(rootNode.data.hasChildren).toBe(true);

    // Check for file nodes
    const fileNodes = nodeChunks.filter((n) => n.data.type === 'file');
    expect(fileNodes.length).toBeGreaterThan(0);

    // Files should have content
    const fileWithContent = fileNodes.find((n) => n.data.content);
    expect(fileWithContent).toBeDefined();
  });

  test('should handle non-GitHub URLs gracefully', async () => {
    const request = new Request('http://localhost/api/scrape?url=https://example.com/some-page', {
      method: 'GET',
      headers: {
        Origin: 'http://localhost',
      },
    });

    const response = await worker.fetch(request);
    expect(response.status).toBe(200);

    const text = await response.text();
    const lines = text.trim().split('\n');
    const chunks = lines.map((line) => JSON.parse(line));

    // Should still return a valid structure
    expect(chunks[0].type).toBe('metadata');
    expect(chunks[chunks.length - 1].type).toBe('complete');
  });

  test('should use caching for repeated requests', async () => {
    const url = 'https://github.com/example/cached-repo';
    const request1 = new Request(`http://localhost/api/scrape?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        Origin: 'http://localhost',
      },
    });

    // First request
    const response1 = await worker.fetch(request1);
    expect(response1.status).toBe(200);

    // Second request (should be cached)
    const request2 = new Request(`http://localhost/api/scrape?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        Origin: 'http://localhost',
      },
    });

    const response2 = await worker.fetch(request2);
    expect(response2.status).toBe(200);

    // Both responses should have the same structure
    const text1 = await response1.text();
    const text2 = await response2.text();

    const chunks1 = text1
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
    const chunks2 = text2
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));

    expect(chunks1.length).toBe(chunks2.length);
    expect(chunks1[0].type).toBe(chunks2[0].type);
  });

  test('should validate URL format', async () => {
    const request = new Request('http://localhost/api/scrape?url=not-a-valid-url', {
      method: 'GET',
      headers: {
        Origin: 'http://localhost',
      },
    });

    const response = await worker.fetch(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe('Invalid URL format');
  });

  test('should handle GitHub repos with proper file tree structure', async () => {
    const request = new Request(
      'http://localhost/api/scrape?url=https://github.com/facebook/react',
      {
        method: 'GET',
        headers: {
          Origin: 'http://localhost',
        },
      }
    );

    const response = await worker.fetch(request);
    const text = await response.text();
    const lines = text.trim().split('\n');
    const chunks = lines.map((line) => JSON.parse(line));

    // Build tree from chunks
    const nodeChunks = chunks.filter((c) => c.type === 'node');
    const nodeMap = new Map();

    nodeChunks.forEach((chunk) => {
      nodeMap.set(chunk.data.path, chunk.data);
    });

    // Verify tree structure
    nodeChunks.forEach((chunk) => {
      if (chunk.data.path !== '') {
        const parentPath = chunk.data.parentPath;
        const parent = nodeMap.get(parentPath);
        expect(parent).toBeDefined();
        expect(parent.type).toBe('directory');
      }
    });
  });

  test('should include rate limit headers', async () => {
    const request = new Request('http://localhost/api/scrape?url=https://github.com/example/test', {
      method: 'GET',
      headers: {
        Origin: 'http://localhost',
      },
    });

    const response = await worker.fetch(request);
    expect(response.headers.get('X-RateLimit-Limit')).toBe('10');
    expect(response.headers.get('X-RateLimit-Remaining')).toBeTruthy();
    expect(response.headers.get('X-RateLimit-Reset')).toBeTruthy();
  });
});
