import { describe, it, expect, beforeEach, vi } from "vitest";
import { LRUCache } from "./lru-cache.js";

describe("LRUCache", () => {
  describe("basic operations", () => {
    it("should set and get a value", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      expect(cache.get("a")).toBe(1);
    });

    it("should return undefined for missing key", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      expect(cache.get("nonexistent")).toBeUndefined();
    });

    it("should check if key exists with has()", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      expect(cache.has("a")).toBe(true);
      expect(cache.has("b")).toBe(false);
    });

    it("should delete a key", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      expect(cache.delete("a")).toBe(true);
      expect(cache.has("a")).toBe(false);
      expect(cache.get("a")).toBeUndefined();
    });

    it("should return false when deleting nonexistent key", () => {
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
  });

  describe("LRU eviction order", () => {
    it("should evict least recently used entry when capacity exceeded", () => {
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

    it("should evict LRU entry after accessing other entries", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);
      cache.get("a");
      cache.set("d", 4);

      expect(cache.get("a")).toBe(1);
      expect(cache.get("b")).toBeUndefined();
      expect(cache.get("c")).toBe(3);
      expect(cache.get("d")).toBe(4);
    });

    it("should update eviction order when setting existing key", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);
      cache.set("a", 10);
      cache.set("d", 4);

      expect(cache.get("a")).toBe(10);
      expect(cache.get("b")).toBeUndefined();
      expect(cache.get("c")).toBe(3);
      expect(cache.get("d")).toBe(4);
    });
  });

  describe("get() recency updates", () => {
    it("should move accessed entry to most recent position", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);
      cache.get("a");
      cache.set("d", 4);

      expect(cache.get("a")).toBe(1);
      expect(cache.get("b")).toBeUndefined();
    });

    it("should not change order for expired entries accessed via has()", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3 });
        cache.set("a", 1, 50);
        cache.set("b", 2, 50);
        cache.set("c", 3, 50);
        vi.advanceTimersByTime(100);
        cache.has("a");
        cache.set("d", 4);

        expect(cache.get("a")).toBeUndefined();
        expect(cache.get("b")).toBeUndefined();
        expect(cache.get("c")).toBeUndefined();
        expect(cache.get("d")).toBe(4);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe("TTL expiry", () => {
    it("should return undefined for expired entries", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3 });
        cache.set("a", 1, 50);
        vi.advanceTimersByTime(100);
        expect(cache.get("a")).toBeUndefined();
      } finally {
        vi.useRealTimers();
      }
    });

    it("should delete expired entries on access", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3 });
        cache.set("a", 1, 50);
        vi.advanceTimersByTime(100);
        cache.get("a");
        expect(cache.size).toBe(0);
      } finally {
        vi.useRealTimers();
      }
    });

    it("should not expire entries without TTL", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3 });
        cache.set("a", 1);
        vi.advanceTimersByTime(1000000);
        expect(cache.get("a")).toBe(1);
      } finally {
        vi.useRealTimers();
      }
    });

    it("should handle expired entries during has() check", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3 });
        cache.set("a", 1, 50);
        vi.advanceTimersByTime(100);
        expect(cache.has("a")).toBe(false);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe("default TTL", () => {
    it("should apply defaultTtlMs when no per-entry ttl specified", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3, defaultTtlMs: 50 });
        cache.set("a", 1);
        vi.advanceTimersByTime(100);
        expect(cache.get("a")).toBeUndefined();
      } finally {
        vi.useRealTimers();
      }
    });

    it("should override default TTL with per-entry ttl", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3, defaultTtlMs: 50 });
        cache.set("a", 1, 200);
        vi.advanceTimersByTime(100);
        expect(cache.get("a")).toBe(1);
        vi.advanceTimersByTime(150);
        expect(cache.get("a")).toBeUndefined();
      } finally {
        vi.useRealTimers();
      }
    });

    it("should allow 0 as default TTL", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3, defaultTtlMs: 0 });
        cache.set("a", 1);
        vi.advanceTimersByTime(100);
        expect(cache.get("a")).toBeUndefined();
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe("stats accuracy", () => {
    it("should count hits", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      cache.get("a");
      cache.get("a");
      expect(cache.stats().hits).toBe(2);
    });

    it("should count misses", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.get("nonexistent");
      cache.get("a");
      expect(cache.stats().misses).toBe(2);
    });

    it("should count evictions", () => {
      const cache = new LRUCache<string, number>({ capacity: 2 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);
      expect(cache.stats().evictions).toBe(1);
    });

    it("should count expirations", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3 });
        cache.set("a", 1, 50);
        vi.advanceTimersByTime(100);
        cache.get("a");
        expect(cache.stats().expirations).toBe(1);
      } finally {
        vi.useRealTimers();
      }
    });

    it("should reset stats on clear", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      cache.get("a");
      cache.get("nonexistent");
      cache.clear();
      const stats = cache.stats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.evictions).toBe(0);
      expect(stats.expirations).toBe(0);
    });
  });

  describe("capacity=1 edge case", () => {
    it("should work correctly with capacity 1", () => {
      const cache = new LRUCache<string, number>({ capacity: 1 });
      cache.set("a", 1);
      expect(cache.get("a")).toBe(1);
      cache.set("b", 2);
      expect(cache.get("a")).toBeUndefined();
      expect(cache.get("b")).toBe(2);
    });

    it("should update value when setting same key with capacity 1", () => {
      const cache = new LRUCache<string, number>({ capacity: 1 });
      cache.set("a", 1);
      cache.set("a", 10);
      expect(cache.get("a")).toBe(10);
      expect(cache.size).toBe(1);
    });

    it("should maintain order with get and set on capacity 1", () => {
      const cache = new LRUCache<string, number>({ capacity: 1 });
      cache.set("a", 1);
      cache.get("a");
      cache.set("b", 2);
      expect(cache.get("a")).toBeUndefined();
      expect(cache.get("b")).toBe(2);
    });
  });

  describe("update existing key", () => {
    it("should update value without evicting when setting existing key", () => {
      const cache = new LRUCache<string, number>({ capacity: 2 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("a", 10);
      expect(cache.size).toBe(2);
      expect(cache.get("a")).toBe(10);
      expect(cache.get("b")).toBe(2);
    });

    it("should update TTL when setting existing key", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 2 });
        cache.set("a", 1, 50);
        vi.advanceTimersByTime(30);
        cache.set("a", 10, 100);
        vi.advanceTimersByTime(50);
        expect(cache.get("a")).toBe(10);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe("delete verification", () => {
    it("should not count deleted entries toward size", () => {
      const cache = new LRUCache<string, number>({ capacity: 3 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.delete("a");
      expect(cache.size).toBe(1);
      cache.set("c", 3);
      cache.set("d", 4);
      expect(cache.size).toBe(3);
    });

    it("should allow adding new entries after delete", () => {
      const cache = new LRUCache<string, number>({ capacity: 2 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.delete("a");
      cache.set("c", 3);
      expect(cache.get("a")).toBeUndefined();
      expect(cache.get("b")).toBe(2);
      expect(cache.get("c")).toBe(3);
    });
  });

  describe("keys/values/entries LRU order", () => {
    it("should return keys in LRU order (most recent first)", () => {
      const cache = new LRUCache<string, number>({ capacity: 4 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);
      const keys = Array.from(cache.keys());
      expect(keys).toEqual(["c", "b", "a"]);
    });

    it("should return values in LRU order (most recent first)", () => {
      const cache = new LRUCache<string, number>({ capacity: 4 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);
      const values = Array.from(cache.values());
      expect(values).toEqual([3, 2, 1]);
    });

    it("should return entries in LRU order (most recent first)", () => {
      const cache = new LRUCache<string, number>({ capacity: 4 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);
      const entries = Array.from(cache.entries());
      expect(entries).toEqual([["c", 3], ["b", 2], ["a", 1]]);
    });

    it("should update order after get()", () => {
      const cache = new LRUCache<string, number>({ capacity: 4 });
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);
      cache.get("a");
      const entries = Array.from(cache.entries());
      expect(entries).toEqual([["a", 1], ["c", 3], ["b", 2]]);
    });
  });

  describe("generic types", () => {
    it("should work with number keys", () => {
      const cache = new LRUCache<number, string>({ capacity: 3 });
      cache.set(1, "a");
      cache.set(2, "b");
      expect(cache.get(1)).toBe("a");
      expect(cache.get(2)).toBe("b");
    });

    it("should work with object keys", () => {
      const cache = new LRUCache<object, string>({ capacity: 3 });
      const key1 = { id: 1 };
      const key2 = { id: 2 };
      cache.set(key1, "a");
      cache.set(key2, "b");
      expect(cache.get(key1)).toBe("a");
      expect(cache.get(key2)).toBe("b");
    });

    it("should work with various value types", () => {
      const cache = new LRUCache<string, object>({ capacity: 3 });
      cache.set("obj", { foo: "bar" });
      cache.set("arr", [1, 2, 3]);
      cache.set("fn", () => "result");
      expect(cache.get("obj")).toEqual({ foo: "bar" });
      expect(cache.get("arr")).toEqual([1, 2, 3]);
      expect(cache.get("fn")).toBeDefined();
    });

    it("should work with mixed generic types", () => {
      interface Person {
        name: string;
        age: number;
      }
      const cache = new LRUCache<string, Person[]>({ capacity: 2 });
      cache.set("people", [
        { name: "Alice", age: 30 },
        { name: "Bob", age: 25 },
      ]);
      expect(cache.get("people")).toEqual([
        { name: "Alice", age: 30 },
        { name: "Bob", age: 25 },
      ]);
    });
  });

  describe("size getter with expired entries", () => {
    it("should not count expired entries in size", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3 });
        cache.set("a", 1, 50);
        cache.set("b", 2);
        vi.advanceTimersByTime(100);
        expect(cache.size).toBe(1);
      } finally {
        vi.useRealTimers();
      }
    });

    it("should update size after expired entries are cleaned up", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3 });
        cache.set("a", 1, 50);
        cache.set("b", 2, 50);
        cache.set("c", 3, 50);
        vi.advanceTimersByTime(100);
        expect(cache.size).toBe(0);
        cache.set("d", 4);
        expect(cache.size).toBe(1);
      } finally {
        vi.useRealTimers();
      }
    });

    it("should handle empty cache after all entries expire", () => {
      vi.useFakeTimers();
      try {
        const cache = new LRUCache<string, number>({ capacity: 3 });
        cache.set("a", 1, 50);
        cache.set("b", 2, 50);
        vi.advanceTimersByTime(100);
        expect(cache.size).toBe(0);
        cache.set("c", 3);
        expect(cache.size).toBe(1);
      } finally {
        vi.useRealTimers();
      }
    });
  });
});