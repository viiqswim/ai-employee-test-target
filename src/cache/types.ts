export interface CacheOptions<K = string, V = unknown> {
  capacity: number;
  defaultTtlMs?: number;
}

export interface CacheEntry<V = unknown> {
  value: V;
  createdAt: number;
  ttlMs?: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  expirations: number;
}

export interface LRUCache<K = string, V = unknown> {
  get(key: K): V | undefined;
  set(key: K, value: V, ttlMs?: number): void;
  has(key: K): boolean;
  delete(key: K): boolean;
  clear(): void;
  readonly size: number;
  readonly capacity: number;
  stats(): CacheStats;
  keys(): IterableIterator<K>;
  values(): IterableIterator<V>;
  entries(): IterableIterator<[K, V]>;
}