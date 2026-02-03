/**
 * Caching Utility
 *
 * Provides in-memory caching with TTL support
 * For production with multiple instances, consider using Redis
 */

import config from '../config';
import { logger } from './logger';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class Cache {
  private store: Map<string, CacheEntry<any>>;
  private defaultTTL: number;

  constructor() {
    this.store = new Map();
    this.defaultTTL = config.cache.ttl * 1000; // Convert to milliseconds

    // Cleanup expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    logger.debug('Cache hit', { key });
    return entry.value as T;
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const ttlMs = (ttl || config.cache.ttl) * 1000;
    const expiresAt = Date.now() + ttlMs;

    this.store.set(key, {
      value,
      expiresAt,
    });

    logger.debug('Cache set', { key, ttl: ttlMs });
  }

  /**
   * Delete value from cache
   */
  delete(key: string): boolean {
    logger.debug('Cache delete', { key });
    return this.store.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    logger.info('Cache cleared');
    this.store.clear();
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const entry = this.store.get(key);

    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get or set value (lazy loading)
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    logger.debug('Cache miss, fetching', { key });
    const value = await fetcher();
    this.set(key, value, ttl);

    return value;
  }

  /**
   * Get cache stats
   */
  getStats(): {
    size: number;
    keys: string[];
  } {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys()),
    };
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug('Cache cleanup', { cleaned, remaining: this.store.size });
    }
  }
}

// Export singleton instance
export const cache = new Cache();

/**
 * Cache decorator for functions
 */
export function cached(ttl?: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`;
      const cached = cache.get(cacheKey);

      if (cached !== null) {
        return cached;
      }

      const result = await originalMethod.apply(this, args);
      cache.set(cacheKey, result, ttl);

      return result;
    };

    return descriptor;
  };
}

export default cache;
