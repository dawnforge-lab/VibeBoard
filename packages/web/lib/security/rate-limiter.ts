/**
 * Rate Limiter
 * Simple in-memory rate limiting for API endpoints
 * For production, consider using Redis or Upstash for distributed rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Cleanup old entries every 5 minutes
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup();
      },
      5 * 60 * 1000
    );
  }

  /**
   * Check if request should be rate limited
   * @param identifier Unique identifier (e.g., IP address, user ID)
   * @param limit Maximum requests allowed in window
   * @param windowMs Time window in milliseconds
   * @returns Object with allowed status and remaining count
   */
  check(
    identifier: string,
    limit: number,
    windowMs: number
  ): {
    allowed: boolean;
    remaining: number;
    resetAt: number;
  } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    // First request or window expired
    if (!entry || now > entry.resetAt) {
      const resetAt = now + windowMs;
      this.requests.set(identifier, {
        count: 1,
        resetAt,
      });

      return {
        allowed: true,
        remaining: limit - 1,
        resetAt,
      };
    }

    // Within window
    if (entry.count < limit) {
      entry.count++;
      this.requests.set(identifier, entry);

      return {
        allowed: true,
        remaining: limit - entry.count,
        resetAt: entry.resetAt,
      };
    }

    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  /**
   * Reset rate limit for a specific identifier
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetAt) {
        toDelete.push(key);
      }
    }

    toDelete.forEach((key) => this.requests.delete(key));
  }

  /**
   * Get current stats for monitoring
   */
  getStats(): {
    totalEntries: number;
    activeEntries: number;
  } {
    const now = Date.now();
    let activeEntries = 0;

    for (const entry of this.requests.values()) {
      if (now <= entry.resetAt) {
        activeEntries++;
      }
    }

    return {
      totalEntries: this.requests.size,
      activeEntries,
    };
  }

  /**
   * Cleanup interval on shutdown
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.requests.clear();
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Rate limit configurations
export const RATE_LIMITS = {
  // Admin endpoints: 100 requests per minute
  admin: {
    limit: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  // API endpoints: 60 requests per minute
  api: {
    limit: 60,
    windowMs: 60 * 1000,
  },
  // Auth endpoints: 5 requests per 15 minutes (prevent brute force)
  auth: {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  },
  // Public endpoints: 120 requests per minute
  public: {
    limit: 120,
    windowMs: 60 * 1000,
  },
} as const;
