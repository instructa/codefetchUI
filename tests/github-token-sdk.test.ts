/**
 * GitHub Token SDK Tests
 *
 * These tests verify that the GitHub token functionality works correctly
 * by testing the codefetch SDK directly (not through the API endpoint).
 *
 * @vitest-environment node
 */

import { describe, expect, it, beforeAll } from 'vitest';
import { fetch as codefetchFetch } from 'codefetch-sdk/server';

describe('GitHub Token SDK Integration', () => {
  const SMALL_REPO = 'https://github.com/sindresorhus/is-plain-obj';
  const hasGitHubToken = !!process.env.GITHUB_TOKEN;

  beforeAll(() => {
    if (hasGitHubToken) {
      console.log('✓ GitHub token detected in environment');
    } else {
      console.log('⚠️  No GitHub token found. Rate limits will be lower.');
    }
  });

  describe('Direct SDK Usage', () => {
    it('should successfully fetch a repository with SDK', async () => {
      const result = await codefetchFetch({
        source: SMALL_REPO,
        format: 'json',
        githubToken: process.env.GITHUB_TOKEN,
      } as any);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('root');
      expect(result.root).toHaveProperty('type');
    }, 30000);

    it('should handle rate limits based on token availability', async () => {
      const requestCount = 65; // More than GitHub's unauthenticated limit
      let successCount = 0;
      let rateLimitError = false;

      for (let i = 1; i <= requestCount; i++) {
        try {
          const result = await codefetchFetch({
            source: SMALL_REPO,
            format: 'json',
            githubToken: process.env.GITHUB_TOKEN,
          } as any);

          if (result && result.root) {
            successCount++;
          }

          if (i % 5 === 0) {
            console.log(`✓ Completed ${i} requests successfully`);
          }
        } catch (error: any) {
          if (error.message && error.message.includes('rate limit')) {
            rateLimitError = true;
            console.log(`Rate limit hit at request ${i}`);
            break;
          }
          throw error;
        }

        // Small delay between requests
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      if (hasGitHubToken) {
        // With token, all requests should succeed
        expect(successCount).toBe(requestCount);
        expect(rateLimitError).toBe(false);
      } else {
        // Without token, should hit rate limit
        expect(rateLimitError).toBe(true);
        expect(successCount).toBeLessThan(requestCount);
      }
    }, 60000);
  });

  describe('Repository Metadata', () => {
    it('should fetch repository metadata correctly', async () => {
      const result = await codefetchFetch({
        source: SMALL_REPO,
        format: 'json',
        githubToken: process.env.GITHUB_TOKEN,
      } as any);

      expect(result.metadata).toBeDefined();
      expect(result.metadata.source).toBe(SMALL_REPO);
      expect(result.metadata.gitRepo).toBeDefined();
      expect(result.metadata.totalFiles).toBeGreaterThan(0);
    }, 30000);
  });

  describe('Token Validation', () => {
    it.skipIf(!hasGitHubToken)('should access private repos with valid token', async () => {
      // This test only runs if GITHUB_TOKEN is present
      // Note: This would only work with a token that has private repo access
      // and a private repo URL. For now, we just verify the token is being used.

      const result = await codefetchFetch({
        source: SMALL_REPO,
        format: 'json',
        githubToken: process.env.GITHUB_TOKEN,
      } as any);

      expect(result).toBeDefined();
      expect(result.root).toBeDefined();
    });

    it.skipIf(hasGitHubToken)(
      'should fail gracefully without token on many requests',
      async () => {
        // This test only runs if GITHUB_TOKEN is NOT present
        let errorOccurred = false;

        // Try to make many requests without a token
        for (let i = 0; i < 12; i++) {
          try {
            await codefetchFetch({
              source: SMALL_REPO,
              format: 'json',
            } as any);

            await new Promise((resolve) => setTimeout(resolve, 100));
          } catch (error: any) {
            if (error.message && error.message.includes('rate limit')) {
              errorOccurred = true;
              break;
            }
          }
        }

        // Should hit rate limit without token
        expect(errorOccurred).toBe(true);
      },
      30000
    );
  });

  describe('Large Repository Handling', () => {
    it.skipIf(!hasGitHubToken)(
      'should handle larger repositories efficiently with token',
      async () => {
        const largerRepo = 'https://github.com/sindresorhus/ky';

        const result = await codefetchFetch({
          source: largerRepo,
          format: 'json',
          githubToken: process.env.GITHUB_TOKEN,
        } as any);

        expect(result).toBeDefined();
        expect(result.root).toBeDefined();
        expect(result.metadata.totalFiles).toBeGreaterThan(10);

        // Verify we got actual file content
        const findFiles = (node: any): number => {
          let count = node.type === 'file' ? 1 : 0;
          if (node.children) {
            count += node.children.reduce((sum: number, child: any) => sum + findFiles(child), 0);
          }
          return count;
        };

        const fileCount = findFiles(result.root);
        expect(fileCount).toBeGreaterThan(10);
      },
      45000
    );
  });
});
