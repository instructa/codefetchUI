// Rate limiter wrapper that works in both development and production
import { apiRateLimiter as inMemoryRateLimiter } from './rate-limiter';
import { apiRateLimiter as kvRateLimiter } from './rate-limiter-kv';

// Define KVNamespace interface for TypeScript
interface KVNamespace {
  get(key: string, options?: { type?: 'text' | 'json' | 'arrayBuffer' | 'stream' }): Promise<any>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface RateLimiterContext {
  RATE_LIMIT_KV?: KVNamespace;
}

export class UniversalRateLimiter {
  async isAllowed(identifier: string, context?: RateLimiterContext): Promise<boolean> {
    if (context?.RATE_LIMIT_KV) {
      // Production: Use KV storage
      return kvRateLimiter.isAllowed(identifier, context.RATE_LIMIT_KV);
    }
    // Development: Use in-memory storage
    return inMemoryRateLimiter.isAllowed(identifier);
  }

  async getRemainingRequests(identifier: string, context?: RateLimiterContext): Promise<number> {
    if (context?.RATE_LIMIT_KV) {
      // Production: Use KV storage
      return kvRateLimiter.getRemainingRequests(identifier, context.RATE_LIMIT_KV);
    }
    // Development: Use in-memory storage
    return inMemoryRateLimiter.getRemainingRequests(identifier);
  }

  async getResetTime(identifier: string, context?: RateLimiterContext): Promise<number> {
    if (context?.RATE_LIMIT_KV) {
      // Production: Use KV storage
      return kvRateLimiter.getResetTime(identifier, context.RATE_LIMIT_KV);
    }
    // Development: Use in-memory storage
    return inMemoryRateLimiter.getResetTime(identifier);
  }
}

export const universalRateLimiter = new UniversalRateLimiter();