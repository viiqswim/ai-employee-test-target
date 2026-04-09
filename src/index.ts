export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export { LRUCache } from "./cache/index.js";
export type { CacheOptions, CacheEntry, CacheStats } from "./cache/index.js";
