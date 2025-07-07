// KV-based rate limiter for Cloudflare Workers
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Define KVNamespace interface for TypeScript (mimics Cloudflare's KVNamespace)
interface KVNamespace {
  get(key: string, options?: { type?: 'text' | 'json' | 'arrayBuffer' | 'stream' }): Promise<any>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

interface WorkerContext {
  RATE_LIMIT_KV?: KVNamespace;
}

export class KVRateLimiter {
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly keyPrefix: string;

  constructor(maxRequests: number = 10, windowMs: number = 60000, keyPrefix: string = 'rate_limit:') {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.keyPrefix = keyPrefix;
  }

  async isAllowed(identifier: string, kv: KVNamespace): Promise<boolean> {
    const now = Date.now();
    const key = `${this.keyPrefix}${identifier}`;
    
    // Get existing rate limit data
    const data = await kv.get(key, { type: 'json' }) as RateLimitEntry | null;
    
    if (!data || data.resetTime < now) {
      // Create new entry or reset existing one
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + this.windowMs,
      };
      
      // Set expiration to match the reset time
      await kv.put(key, JSON.stringify(newEntry), {
        expirationTtl: Math.ceil(this.windowMs / 1000), // Convert to seconds
      });
      
      return true;
    }

    if (data.count >= this.maxRequests) {
      return false;
    }

    // Increment count - create new object to avoid mutation
    const updatedData: RateLimitEntry = {
      count: data.count + 1,
      resetTime: data.resetTime,
    };
    
    await kv.put(key, JSON.stringify(updatedData), {
      expirationTtl: Math.ceil((data.resetTime - now) / 1000),
    });
    
    return true;
  }

  async getRemainingRequests(identifier: string, kv: KVNamespace): Promise<number> {
    const key = `${this.keyPrefix}${identifier}`;
    const data = await kv.get(key, 'json') as RateLimitEntry | null;
    
    if (!data || data.resetTime < Date.now()) {
      return this.maxRequests;
    }
    
    return Math.max(0, this.maxRequests - data.count);
  }

  async getResetTime(identifier: string, kv: KVNamespace): Promise<number> {
    const key = `${this.keyPrefix}${identifier}`;
    const data = await kv.get(key, 'json') as RateLimitEntry | null;
    
    return data?.resetTime || 0;
  }
}

// Export default instance configuration
export const apiRateLimiter = new KVRateLimiter(10, 60000); // 10 requests per minute