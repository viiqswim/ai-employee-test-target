export interface CacheOptions {
  capacity: number;
  defaultTtlMs?: number;
}

export interface CacheEntry<T> {
  value: T;
  expiresAt: number | null;
}

export interface CacheStats {
  size: number;
  capacity: number;
  hits: number;
  misses: number;
  evictions: number;
  expirations: number;
}
