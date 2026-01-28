export interface CacheEntry<T> {
  value: T
  expiresAt: number
  createdAt: number
}

export interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum number of entries
}

const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes
const DEFAULT_MAX_SIZE = 1000

// In-memory cache implementation
class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>()
  private maxSize: number
  private hits = 0
  private misses = 0

  constructor(maxSize: number = DEFAULT_MAX_SIZE) {
    this.maxSize = maxSize

    // Cleanup expired entries every minute
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.cleanup(), 60 * 1000)
    }
  }

  // Get value from cache
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined

    if (!entry) {
      this.misses++
      return null
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      this.misses++
      return null
    }

    this.hits++
    return entry.value
  }

  // Set value in cache
  set<T>(key: string, value: T, ttl: number = DEFAULT_TTL): void {
    // Enforce max size with LRU eviction
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
      createdAt: Date.now(),
    })
  }

  // Check if key exists and is not expired
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }
    return true
  }

  // Delete key from cache
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  // Clear all entries
  clear(): void {
    this.cache.clear()
    this.hits = 0
    this.misses = 0
  }

  // Get cache statistics
  getStats(): {
    size: number
    maxSize: number
    hits: number
    misses: number
    hitRate: number
  } {
    const total = this.hits + this.misses
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
    }
  }

  // Remove expired entries
  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  // Get or set with async factory function
  async getOrSet<T>(key: string, factory: () => Promise<T>, ttl: number = DEFAULT_TTL): Promise<T> {
    const cached = this.get<T>(key)
    if (cached !== null) return cached

    const value = await factory()
    this.set(key, value, ttl)
    return value
  }
}

// Global cache instance
export const cache = new MemoryCache()

// Cache decorator for functions
export function cached<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl: number = DEFAULT_TTL
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args)
    return cache.getOrSet(key, () => fn(...args), ttl)
  }) as T
}

// Create a namespaced cache
export function createNamespacedCache(namespace: string) {
  return {
    get: <T>(key: string) => cache.get<T>(`${namespace}:${key}`),
    set: <T>(key: string, value: T, ttl?: number) => cache.set(`${namespace}:${key}`, value, ttl),
    has: (key: string) => cache.has(`${namespace}:${key}`),
    delete: (key: string) => cache.delete(`${namespace}:${key}`),
    getOrSet: <T>(key: string, factory: () => Promise<T>, ttl?: number) =>
      cache.getOrSet(`${namespace}:${key}`, factory, ttl),
  }
}

// Stale-while-revalidate pattern
export async function staleWhileRevalidate<T>(
  key: string,
  factory: () => Promise<T>,
  ttl: number = DEFAULT_TTL,
  staleTtl: number = ttl * 2
): Promise<T> {
  const entry = cache.get<T>(key)

  if (entry !== null) {
    // If we have data, return it immediately
    // But check if it's stale and needs revalidation
    const cacheEntry = (cache as unknown as { cache: Map<string, CacheEntry<T>> }).cache.get(key)
    if (cacheEntry && Date.now() > cacheEntry.expiresAt - staleTtl + ttl) {
      // Revalidate in background
      factory()
        .then((value) => cache.set(key, value, ttl))
        .catch(console.error)
    }
    return entry
  }

  // No cached data, fetch fresh
  const value = await factory()
  cache.set(key, value, ttl)
  return value
}
