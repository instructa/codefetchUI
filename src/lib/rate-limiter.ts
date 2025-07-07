// Simple in-memory rate limiter for API endpoints
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    
    // Note: Removed setInterval for Cloudflare Workers compatibility
    // Old entries are cleaned up on-demand in isAllowed() instead
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    
    // Clean up a few old entries on each request (for memory management)
    let cleaned = 0;
    for (const [key, entry] of this.limits.entries()) {
      if (entry.resetTime < now && cleaned < 5) {
        this.limits.delete(key);
        cleaned++;
      }
    }
    
    const entry = this.limits.get(identifier);

    if (!entry || entry.resetTime < now) {
      // Create new entry or reset existing one
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const entry = this.limits.get(identifier);
    if (!entry || entry.resetTime < Date.now()) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - entry.count);
  }

  getResetTime(identifier: string): number {
    const entry = this.limits.get(identifier);
    return entry?.resetTime || 0;
  }
}

// Export singleton instance
export const apiRateLimiter = new RateLimiter(10, 60000); // 10 requests per minute