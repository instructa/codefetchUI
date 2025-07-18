import { createStorage } from 'unstorage';
import memoryDriver from 'unstorage/drivers/memory';

// Create storage instance with memory driver
const storage = createStorage({
  driver: memoryDriver(),
});

/**
 * Normalize GitHub URLs for consistent key generation
 */
function normalizeGitHubUrl(url: string): string {
  try {
    const parsed = new URL(url);

    // Convert to lowercase
    let normalized = parsed.hostname.toLowerCase() + parsed.pathname.toLowerCase();

    // Remove trailing slashes
    normalized = normalized.replace(/\/+$/, '');

    // Remove .git extension
    normalized = normalized.replace(/\.git$/, '');

    // Remove common prefixes
    normalized = normalized.replace(/^(www\.)?/, '');

    return `https://${normalized}`;
  } catch {
    // If URL parsing fails, just return lowercase trimmed version
    return url.toLowerCase().trim();
  }
}

/**
 * Generate a storage key from a repository URL
 */
export async function generateRepoKey(url: string): Promise<string> {
  const normalized = normalizeGitHubUrl(url);

  // Use Web Crypto API for Cloudflare Workers compatibility
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  const hash = hashHex.substring(0, 16);

  return `repo:${hash}:v1`;
}

/**
 * Store repository data
 */
export async function storeRepoData(url: string, data: any): Promise<void> {
  const key = await generateRepoKey(url);

  // Store with 2 hour TTL
  await storage.setItem(
    key,
    {
      url,
      fetchedAt: new Date().toISOString(),
      data,
    },
    {
      ttl: 7200, // 2 hours in seconds
    }
  );
}

/**
 * Retrieve repository data
 */
export async function getRepoData(url: string): Promise<any | null> {
  const key = await generateRepoKey(url);

  const stored = await storage.getItem(key);

  if (!stored) {
    return null;
  }

  return stored.data;
}

/**
 * Check if repository data exists
 */
export async function hasRepoData(url: string): Promise<boolean> {
  const key = await generateRepoKey(url);
  return await storage.hasItem(key);
}

/**
 * Remove repository data
 */
export async function removeRepoData(url: string): Promise<void> {
  const key = await generateRepoKey(url);
  await storage.removeItem(key);
}

/**
 * Get storage stats (for debugging)
 */
export async function getStorageStats(): Promise<{ keys: string[]; count: number }> {
  const keys = await storage.getKeys();
  return {
    keys,
    count: keys.length,
  };
}
