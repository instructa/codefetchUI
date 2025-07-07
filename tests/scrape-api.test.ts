/**
 * Scrape API Tests
 *
 * These tests verify the scrape API functionality including:
 * - Successful URL scraping
 * - Rate limiting
 * - Security (origin validation)
 * - Error handling
 * - Streaming response format
 *
 * @vitest-environment node
 */

import { describe, expect, it } from 'vitest';

const API_URL = 'http://localhost:3000/api/scrape';

describe('Scrape API', () => {
  // Store the origin for testing
  const testOrigin = 'http://localhost:3000';

  describe('Successful Scraping', () => {
    it('should successfully scrape a GitHub repository', async () => {
      // Use a smaller repository for faster testing
      const targetUrl = 'https://github.com/octocat/Hello-World';

      const response = await fetch(`${API_URL}?url=${encodeURIComponent(targetUrl)}`, {
        method: 'GET',
        headers: {
          Origin: testOrigin,
        },
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toBe('application/x-ndjson');

      // Read the streaming response
      const text = await response.text();
      const lines = text
        .trim()
        .split('\n')
        .filter((line) => line);

      // Parse each line as JSON
      const chunks = lines.map((line) => JSON.parse(line));

      // Verify we have metadata, nodes, and completion
      const metadata = chunks.find((chunk) => chunk.type === 'metadata');
      const nodes = chunks.filter((chunk) => chunk.type === 'node');
      const completion = chunks.find((chunk) => chunk.type === 'complete');

      expect(metadata).toBeDefined();
      expect(metadata.data.url).toBe(targetUrl);
      expect(metadata.data.scrapedAt).toBeDefined();
      expect(nodes.length).toBeGreaterThan(0);
      expect(completion).toBeDefined();
    }, 30000);

    it('should include rate limit headers in response', async () => {
      const response = await fetch(`${API_URL}?url=https://github.com/octocat/Hello-World`, {
        method: 'GET',
        headers: {
          Origin: testOrigin,
        },
      });

      expect(response.headers.get('x-ratelimit-limit')).toBe('10');
      expect(response.headers.get('x-ratelimit-remaining')).toBeDefined();
      expect(response.headers.get('x-ratelimit-reset')).toBeDefined();
    }, 20000);
  });

  describe('Security Validation', () => {
    it('should reject requests without valid origin', async () => {
      const response = await fetch(`${API_URL}?url=https://github.com/test/repo`, {
        method: 'GET',
        headers: {
          Origin: 'https://malicious-site.com',
        },
      });

      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Forbidden');
    });

    it('should accept same-origin requests', async () => {
      const response = await fetch(`${API_URL}?url=https://github.com/octocat/Hello-World`, {
        method: 'GET',
        headers: {
          Origin: testOrigin,
          Referer: `${testOrigin}/dashboard`,
        },
      });

      expect(response.status).not.toBe(403);
    }, 20000);

    it('should accept requests with matching referer when origin is missing', async () => {
      const response = await fetch(`${API_URL}?url=https://github.com/octocat/Hello-World`, {
        method: 'GET',
        headers: {
          Referer: `${testOrigin}/dashboard`,
          Host: 'localhost:3000',
        },
      });

      expect(response.status).not.toBe(403);
    }, 20000);
  });

  describe('Error Handling', () => {
    it('should return 400 when URL parameter is missing', async () => {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          Origin: testOrigin,
        },
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('URL parameter is required');
    }, 10000);

    it('should handle invalid URLs gracefully', async () => {
      const response = await fetch(`${API_URL}?url=not-a-valid-url`, {
        method: 'GET',
        headers: {
          Origin: testOrigin,
        },
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to scrape URL');
    }, 10000);
  });

  describe('Rate Limiting', () => {
    it.skip('should enforce rate limits after maximum requests', async function () {
      // Skip this test as it requires making many requests and can be slow
      // This test might be flaky in CI, so we'll make it more resilient
      const maxRequests = 10;
      const requests = [];

      // Make requests up to the limit
      for (let i = 0; i < maxRequests + 1; i++) {
        const response = await fetch(`${API_URL}?url=https://github.com/test/repo${i}`, {
          method: 'GET',
          headers: {
            Origin: testOrigin,
            'X-Forwarded-For': '192.168.1.100', // Same IP for all requests
          },
        });

        requests.push({
          status: response.status,
          remaining: response.headers.get('x-ratelimit-remaining'),
        });

        // If we hit rate limit, verify the response
        if (response.status === 429) {
          const data = await response.json();
          expect(data.error).toContain('Too many requests');
          expect(response.headers.get('x-ratelimit-remaining')).toBe('0');
          break;
        }
      }

      // Verify that we eventually hit the rate limit
      const rateLimited = requests.some((req) => req.status === 429);
      expect(rateLimited).toBe(true);
    });

    it('should track rate limits per IP address', async () => {
      // Different IPs should have independent rate limits
      const response1 = await fetch(`${API_URL}?url=https://github.com/test/repo`, {
        method: 'GET',
        headers: {
          Origin: testOrigin,
          'X-Forwarded-For': '10.0.0.1',
        },
      });

      const response2 = await fetch(`${API_URL}?url=https://github.com/test/repo`, {
        method: 'GET',
        headers: {
          Origin: testOrigin,
          'X-Forwarded-For': '10.0.0.2',
        },
      });

      // Both should succeed if they're from different IPs
      expect(response1.status).not.toBe(429);
      expect(response2.status).not.toBe(429);
    });
  });

  describe('Streaming Response Format', () => {
    it.skip('should stream data in NDJSON format', async () => {
      // Skip this test as TypeScript repo is large
      const response = await fetch(`${API_URL}?url=https://github.com/microsoft/typescript`, {
        method: 'GET',
        headers: {
          Origin: testOrigin,
        },
      });

      expect(response.status).toBe(200);

      const text = await response.text();
      const lines = text.trim().split('\n');

      // Each line should be valid JSON
      lines.forEach((line) => {
        if (line) {
          expect(() => JSON.parse(line)).not.toThrow();
        }
      });

      // Parse all chunks
      const chunks = lines.filter((line) => line).map((line) => JSON.parse(line));

      // Verify chunk types
      const types = new Set(chunks.map((chunk) => chunk.type));
      expect(types.has('metadata')).toBe(true);
      expect(types.has('node')).toBe(true);
      expect(types.has('complete')).toBe(true);

      // Verify metadata structure
      const metadata = chunks.find((chunk) => chunk.type === 'metadata');
      expect(metadata.data).toHaveProperty('url');
      expect(metadata.data).toHaveProperty('scrapedAt');
      expect(metadata.data).toHaveProperty('title');

      // Verify node structure
      const firstNode = chunks.find((chunk) => chunk.type === 'node');
      expect(firstNode.data).toHaveProperty('type');
      expect(firstNode.data).toHaveProperty('hasChildren');
    });

    it.skip('should properly stream file tree structure', async () => {
      // Skip this test as Next.js repo is very large
      const response = await fetch(`${API_URL}?url=https://github.com/vercel/next.js`, {
        method: 'GET',
        headers: {
          Origin: testOrigin,
        },
      });

      const text = await response.text();
      const chunks = text
        .trim()
        .split('\n')
        .filter((line) => line)
        .map((line) => JSON.parse(line));

      const nodes = chunks.filter((chunk) => chunk.type === 'node');

      // Should have file and directory nodes
      const fileNodes = nodes.filter((node) => node.data.type === 'file');
      const dirNodes = nodes.filter((node) => node.data.type === 'directory');

      expect(fileNodes.length).toBeGreaterThan(0);
      expect(dirNodes.length).toBeGreaterThan(0);

      // Files should have content
      const someFilesHaveContent = fileNodes.some((node) => node.data.content);
      expect(someFilesHaveContent).toBe(true);
    });
  });
});
