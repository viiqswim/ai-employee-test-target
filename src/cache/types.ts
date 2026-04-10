/**
 * Options for configuring an LRUCache instance.
 * @template K - The type of keys stored in the cache
 * @template V - The type of values stored in the cache
 */
export interface CacheOptions<K = string, V = unknown> {
  /** The maximum number of entries the cache can hold. */
  capacity: number;
  /** Default time-to-live in milliseconds for cache entries. If not specified, entries do not expire by default. */
  defaultTtlMs?: number;
}

/**
 * Represents a single cache entry with its metadata.
 * @template V - The type of value stored in the entry
 */
export interface CacheEntry<V = unknown> {
  /** The value stored in the cache. */
  value: V;
  /** Unix timestamp in milliseconds when the entry was created. */
  createdAt: number;
  /** Optional time-to-live in milliseconds for this specific entry. */
  ttlMs?: number;
}

/**
 * Statistics about cache performance and operations.
 */
export interface CacheStats {
  /** Number of successful cache retrievals (get() returning a value). */
  hits: number;
  /** Number of cache misses (get() returning undefined). */
  misses: number;
  /** Number of entries evicted due to capacity limits. */
  evictions: number;
  /** Number of entries expired due to TTL. */
  expirations: number;
}

/**
 * A Least-Recently-Used (LRU) cache with optional TTL support.
 * Implements O(1) get and set operations using a doubly-linked list and Map.
 * @template K - The type of keys stored in the cache
 * @template V - The type of values stored in the cache
 */
export interface LRUCache<K = string, V = unknown> {
  /**
   * Retrieves a value from the cache.
   * Updates the entry's recency if found.
   * @param key - The key to look up
   * @returns The value if found and not expired, undefined otherwise
   */
  get(key: K): V | undefined;

  /**
   * Stores a value in the cache.
   * If the key exists, updates the value and TTL.
   * If capacity is exceeded, evicts the least recently used entry.
   * @param key - The key to store
   * @param value - The value to store
   * @param ttlMs - Optional TTL in milliseconds for this entry
   */
  set(key: K, value: V, ttlMs?: number): void;

  /**
   * Checks if a key exists in the cache (and is not expired).
   * @param key - The key to check
   * @returns True if the key exists and is not expired
   */
  has(key: K): boolean;

  /**
   * Removes an entry from the cache.
   * @param key - The key to remove
   * @returns True if the key was found and removed
   */
  delete(key: K): boolean;

  /**
   * Removes all entries from the cache and resets statistics.
   */
  clear(): void;

  /**
   * The current number of entries in the cache (excluding expired entries).
   */
  readonly size: number;

  /**
   * The maximum capacity of the cache.
   */
  readonly capacity: number;

  /**
   * Returns cache statistics.
   * @returns An object with hits, misses, evictions, and expirations counts
   */
  stats(): CacheStats;

  /**
   * Returns an iterator over keys in LRU order (oldest first).
   */
  keys(): IterableIterator<K>;

  /**
   * Returns an iterator over values in LRU order (oldest first).
   */
  values(): IterableIterator<V>;

  /**
   * Returns an iterator over key-value pairs in LRU order (oldest first).
   */
  entries(): IterableIterator<[K, V]>;
}