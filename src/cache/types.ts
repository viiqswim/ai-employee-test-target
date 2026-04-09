/**
 * Configuration options for creating a new cache instance.
 */
export interface CacheOptions {
  /**
   * The maximum number of entries the cache can hold.
   * When capacity is reached, the least recently used entry is evicted.
   */
  capacity: number;

  /**
   * The default time-to-live in milliseconds for cache entries.
   * If not specified, entries will not expire by default.
   */
  defaultTtlMs?: number;
}

/**
 * A single entry stored in the cache.
 */
export interface CacheEntry<V> {
  /**
   * The cached value.
   */
  value: V;

  /**
   * The timestamp (in milliseconds since epoch) when this entry expires.
   * If undefined, the entry never expires.
   */
  expiresAt: number | undefined;
}

/**
 * Statistics about cache performance and state.
 */
export interface CacheStats {
  /**
   * The current number of entries in the cache.
   */
  size: number;

  /**
   * The maximum capacity of the cache.
   */
  capacity: number;

  /**
   * The number of cache hits (successful lookups).
   */
  hits: number;

  /**
   * The number of cache misses (unsuccessful lookups).
   */
  misses: number;

  /**
   * The number of entries evicted due to capacity constraints.
   */
  evictions: number;

  /**
   * The number of entries that expired due to TTL.
   */
  expirations: number;
}
