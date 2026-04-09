import { describe, it, expect, beforeEach, vi } from "vitest";
import { LRUCache } from "./lru-cache.js";
import type { CacheStats } from "./types.js";

describe("LRUCache", () => {
  describe("basic set/get/has/delete/clear operations", () => {
    it("should store and retrieve a value", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      expect(cache.get("a")).toBe(1);
    });

    it("should return undefined for non-existent key", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      expect(cache.get("nonexistent")).toBeUndefined();
    });

    it("should return true for has() on existing key", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      expect(cache.has("a")).toBe(true);
    });

    it("should return false for has() on non-existent key", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      expect(cache.has("nonexistent")).toBe(false);
    });

    it("should delete an existing key", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      expect(cache.delete("a")).toBe(true);
      expect(cache.has("a")).toBe(false);
    });

    it("should return false when deleting non-existent key", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      expect(cache.delete("nonexistent")).toBe(false);
    });

    it("should clear all entries", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.clear();
      expect(cache.size).toBe(0);
      expect(cache.get("a")).toBeUndefined();
      expect(cache.get("b")).toBeUndefined();
    });

    it("should report correct size", () => {
      const cache = new LRUCache<string, number>({ capacity: 5 });
      expect(cache.size).toBe(0);
      cache.set("a", 1);
      expect(cache.size).toBe(1);
      cache.set("b", 2);
      expect(cache.size).toBe(2);
    });

    it("should report correct capacity", () => {
      const cache = new LRUCache<string, number>({ capacity: 10 });
      expect(cache.capacity).toBe(10);
    });
  });

  describe("LRU eviction order correctness", () => {
    it("should evict least recently used when at capacity", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);
      cache.set("d", 4);

      expect(cache.get("a")).toBeUndefined();
      expect(cache.get("b")).toBe(2);
      expect(cache.get("c")).toBe(3);
      expect(cache.get("d")).toBe(4);
    });

    it("should evict in correct order - oldest first", () => {
      const cache = new LRUCache<number, string>({ capacity: 3 });
      cache.set(1, "one");
      cache.set(2, "two");
      cache.set(3, "three");

      cache.set(4, "four");

      expect(cache.get(1)).toBeUndefined();
      expect(cache.keys()).toEqual([2, 3, 4]);
    });

    it("should evict only when over capacity", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      expect(cache.get("a")).toBe(1);
      expect(cache.size).toBe(3);

      cache.set("d", 4);
      expect(cache.size).toBe(3);
      expect(cache.get("b")).toBeUndefined();
      expect(cache.get("a")).toBe(1);
    });
  });

  describe("access updates recency (get moves entry to most-recent)", () => {
    it("should update recency on get", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      cache.get("a");

      cache.set("d", 4);

      expect(cache.get("b")).toBeUndefined();
      expect(cache.get("a")).toBe(1);
      expect(cache.get("c")).toBe(3);
      expect(cache.get("d")).toBe(4);
    });

    it("should move accessed item to head", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      cache.get("b");

      cache.set("d", 4);

      expect(cache.get("a")).toBeUndefined();
      expect(cache.get("b")).toBe(2);
      expect(cache.get("c")).toBe(3);
      expect(cache.get("d")).toBe(4);
    });
  });

  describe("TTL expiry behavior", () => {
    it("should expire entries after TTL", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3 });
        cache.set("a", 1, 1000);

        expect(cache.get("a")).toBe(1);

        vi.advanceTimersByTime(1001);

        expect(cache.get("a")).toBeUndefined();
      } finally {
        vi.useRealTimers();
      }
    });

    it("should not expire entries before TTL", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3 });
        cache.set("a", 1, 5000);

        vi.advanceTimersByTime(4000);

        expect(cache.get("a")).toBe(1);
      } finally {
        vi.useRealTimers();
      }
    });

    it("should allow ttl of 0 for no expiry", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1, 0);

      expect(cache.get("a")).toBe(1);
    });

    it("should expire entries with has()", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3 });
        cache.set("a", 1, 1000);

        expect(cache.has("a")).toBe(true);

        vi.advanceTimersByTime(1001);

        expect(cache.has("a")).toBe(false);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe("default TTL option", () => {
    it("should apply default TTL to entries without specific TTL", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3, defaultTtlMs: 1000 });
        cache.set("a", 1);

        expect(cache.get("a")).toBe(1);

        vi.advanceTimersByTime(1001);

        expect(cache.get("a")).toBeUndefined();
      } finally {
        vi.useRealTimers();
      }
    });

    it("should allow specific TTL to override default", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3, defaultTtlMs: 1000 });
        cache.set("a", 1, 3000);

        vi.advanceTimersByTime(2000);
        expect(cache.get("a")).toBe(1);

        vi.advanceTimersByTime(2000);
        expect(cache.get("a")).toBeUndefined();
      } finally {
        vi.useRealTimers();
      }
    });

    it("should not apply TTL when defaultTtlMs is not set", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3 });
        cache.set("a", 1);

        vi.advanceTimersByTime(100000);

        expect(cache.get("a")).toBe(1);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe("stats accuracy for hits/misses/evictions/expirations", () => {
    it("should track hits correctly", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      cache.get("a");
      cache.get("a");
      cache.get("a");

      const stats = cache.stats();
      expect(stats.hits).toBe(3);
    });

    it("should track misses correctly", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      cache.get("nonexistent1");
      cache.get("nonexistent2");

      const stats = cache.stats();
      expect(stats.misses).toBe(2);
    });

    it("should track evictions correctly", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);
      cache.set("d", 4);
      cache.set("e", 5);

      const stats = cache.stats();
      expect(stats.evictions).toBe(2);
    });

    it("should track expirations correctly", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3 });
        cache.set("a", 1, 1000);
        cache.set("b", 2, 2000);

        vi.advanceTimersByTime(1500);
        cache.get("a");

        vi.advanceTimersByTime(1000);
        cache.get("b");

        const stats = cache.stats();
        expect(stats.expirations).toBe(2);
      } finally {
        vi.useRealTimers();
      }
    });

    it("should reset stats on clear", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      cache.get("a");
      cache.get("nonexistent");
      cache.set("b", 2);
      cache.set("c", 3);
      cache.set("d", 4);

      cache.clear();

      const stats = cache.stats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.evictions).toBe(0);
      expect(stats.expirations).toBe(0);
    });

    it("should track size correctly in stats", () => {
      const cache = new LRUCache<string, number>({ capacity: 5 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      const stats = cache.stats();
      expect(stats.size).toBe(3);
      expect(stats.capacity).toBe(5);
    });
  });

  describe("capacity=1 edge case", () => {
    it("should work correctly with capacity 1", () => {
      const cache = new LRUCache<string, number>({ capacity: 1 });
      cache.set("a", 1);
      expect(cache.get("a")).toBe(1);
      expect(cache.size).toBe(1);

      cache.set("b", 2);
      expect(cache.get("a")).toBeUndefined();
      expect(cache.get("b")).toBe(2);
      expect(cache.size).toBe(1);
    });

    it("should update existing key in capacity 1 cache", () => {
      const cache = new LRUCache<string, number>({ capacity: 1 });
      cache.set("a", 1);
      cache.set("a", 2);

      expect(cache.size).toBe(1);
      expect(cache.get("a")).toBe(2);
    });

    it("should evict correctly when accessing in capacity 1", () => {
      const cache = new LRUCache<string, number>({ capacity: 1 });
      cache.set("a", 1);
      cache.get("a");
      cache.set("b", 2);

      expect(cache.get("a")).toBeUndefined();
      expect(cache.get("b")).toBe(2);
    });
  });

  describe("update existing key does not evict", () => {
    it("should not evict when updating existing key", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      cache.set("a", 10);

      expect(cache.size).toBe(3);

      cache.set("d", 4);

      expect(cache.get("a")).toBe(10);
      expect(cache.get("b")).toBeUndefined();
    });

    it("should update value when setting existing key", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      cache.set("a", 2);

      expect(cache.get("a")).toBe(2);
    });

    it("should update TTL when setting existing key with new TTL", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3 });
        cache.set("a", 1, 1000);

        vi.advanceTimersByTime(500);
        cache.set("a", 2, 3000);

        vi.advanceTimersByTime(2500);
        expect(cache.get("a")).toBe(2);

        vi.advanceTimersByTime(1000);
        expect(cache.get("a")).toBeUndefined();
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe("delete removes entries from size", () => {
    it("should decrease size on delete", () => {
      const cache = new LRUCache<string, number>({ capacity: 5 });
      cache.set("a", 1);
      cache.set("b", 2);
      expect(cache.size).toBe(2);

      cache.delete("a");
      expect(cache.size).toBe(1);

      cache.delete("b");
      expect(cache.size).toBe(0);
    });

    it("should not affect size when deleting non-existent key", () => {
      const cache = new LRUCache<string, number>({ capacity: 5 });
      cache.set("a", 1);
      expect(cache.size).toBe(1);

      cache.delete("nonexistent");
      expect(cache.size).toBe(1);
    });

    it("should allow adding after delete", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.delete("a");
      cache.set("c", 3);
      cache.set("d", 4);

      expect(cache.get("b")).toBe(2);
      expect(cache.get("c")).toBe(3);
      expect(cache.get("d")).toBe(4);
    });
  });

  describe("keys/values/entries return items in LRU order", () => {
    it("should return keys in LRU order (oldest first)", () => {
      const cache = new LRUCache<string, number>({ capacity: 5 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      expect(cache.keys()).toEqual(["a", "b", "c"]);
    });

    it("should return keys in LRU order after access", () => {
      const cache = new LRUCache<string, number>({ capacity: 5 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      cache.get("a");

      expect(cache.keys()).toEqual(["b", "c", "a"]);
    });

    it("should return values in LRU order (oldest first)", () => {
      const cache = new LRUCache<string, number>({ capacity: 5 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      expect(cache.values()).toEqual([1, 2, 3]);
    });

    it("should return entries as [key, value] tuples in LRU order", () => {
      const cache = new LRUCache<string, number>({ capacity: 5 });
      cache.set("a", 1);
      cache.set("b", 2);

      expect(cache.entries()).toEqual([["a", 1], ["b", 2]]);
    });

    it("should skip expired entries in values()", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 5 });
        cache.set("a", 1, 1000);
        cache.set("b", 2);

        vi.advanceTimersByTime(1001);

        expect(cache.values()).toEqual([2]);
      } finally {
        vi.useRealTimers();
      }
    });

    it("should skip expired entries in entries()", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 5 });
        cache.set("a", 1, 1000);
        cache.set("b", 2);

        vi.advanceTimersByTime(1001);

        expect(cache.entries()).toEqual([["b", 2]]);
      } finally {
        vi.useRealTimers();
      }
    });

    it("should return empty arrays for empty cache", () => {
      const cache = new LRUCache<string, number>({ capacity: 5 });

      expect(cache.keys()).toEqual([]);
      expect(cache.values()).toEqual([]);
      expect(cache.entries()).toEqual([]);
    });
  });

  describe("generic type support with different key/value types", () => {
    it("should work with number keys", () => {
      const cache = new LRUCache<number, string>({ capacity: 3 });
      cache.set(1, "one");
      cache.set(2, "two");

      expect(cache.get(1)).toBe("one");
      expect(cache.get(2)).toBe("two");
    });

    it("should work with object values", () => {
      interface User {
        id: number;
        name: string;
      }
      const cache = new LRUCache<string, User>({ capacity: 3 });
      const user: User = { id: 1, name: "Alice" };
      cache.set("user1", user);

      const retrieved = cache.get("user1");
      expect(retrieved).toEqual(user);
    });

    it("should work with complex key types", () => {
      interface CacheKey {
        id: string;
      }
      const cache = new LRUCache<CacheKey, number>({ capacity: 3 });
      const key1: CacheKey = { id: "a" };
      const key2: CacheKey = { id: "b" };

      cache.set(key1, 1);
      cache.set(key2, 2);

      expect(cache.get(key1)).toBe(1);
      expect(cache.get(key2)).toBe(2);
    });

    it("should work with array values", () => {
      const cache = new LRUCache<string, number[]>({ capacity: 3 });
      cache.set("numbers", [1, 2, 3]);

      expect(cache.get("numbers")).toEqual([1, 2, 3]);
    });

    it("should work with undefined value", () => {
      const cache = new LRUCache<string, undefined>({ capacity: 3 });
      cache.set("key", undefined);

      expect(cache.get("key")).toBeUndefined();
    });

    it("should work with null value", () => {
      const cache = new LRUCache<string, null>({ capacity: 3 });
      cache.set("key", null);

      expect(cache.get("key")).toBeNull();
    });
  });
});