import type { CacheEntry, CacheOptions, CacheStats } from "./types.js";

interface DoublyLinkedListNode<K, V> {
  key: K;
  value: V;
  expiresAt: number | undefined;
  prev: DoublyLinkedListNode<K, V> | null;
  next: DoublyLinkedListNode<K, V> | null;
}

export class LRUCache<K, V> {
  private readonly _capacity: number;
  private readonly _defaultTtlMs: number | undefined;
  private readonly _map: Map<K, DoublyLinkedListNode<K, V>>;
  private _head: DoublyLinkedListNode<K, V> | null = null;
  private _tail: DoublyLinkedListNode<K, V> | null = null;
  private _size: number = 0;
  private _hits: number = 0;
  private _misses: number = 0;
  private _evictions: number = 0;
  private _expirations: number = 0;

  constructor(options: CacheOptions) {
    this._capacity = options.capacity;
    this._defaultTtlMs = options.defaultTtlMs;
    this._map = new Map();
  }

  get capacity(): number {
    return this._capacity;
  }

  get size(): number {
    return this._size;
  }

  /**
   * Retrieves a value from the cache.
   * Updates the entry's recency to most recently used.
   * @param key - The key to look up
   * @returns The value if found and not expired, or undefined
   */
  get(key: K): V | undefined {
    const node = this._map.get(key);
    if (!node) {
      this._misses++;
      return undefined;
    }

    if (node.expiresAt !== undefined && Date.now() > node.expiresAt) {
      this.delete(key);
      this._expirations++;
      this._misses++;
      return undefined;
    }

    this._hits++;
    this._moveToHead(node);
    return node.value;
  }

  /**
   * Stores a value in the cache.
   * If the key already exists, updates the value and moves to most recent.
   * If at capacity, evicts the least recently used entry.
   * @param key - The key to store
   * @param value - The value to store
   * @param ttlMs - Optional TTL in milliseconds for this specific entry
   */
  set(key: K, value: V, ttlMs?: number): void {
    const existingNode = this._map.get(key);

    if (existingNode) {
      existingNode.value = value;
      if (ttlMs !== undefined) {
        existingNode.expiresAt = ttlMs === 0 ? undefined : Date.now() + ttlMs;
      } else if (this._defaultTtlMs !== undefined) {
        existingNode.expiresAt = Date.now() + this._defaultTtlMs;
      }
      this._moveToHead(existingNode);
      return;
    }

    const expiresAt = ttlMs === 0
      ? undefined
      : ttlMs !== undefined
        ? Date.now() + ttlMs
        : this._defaultTtlMs !== undefined
          ? Date.now() + this._defaultTtlMs
          : undefined;

    const newNode: DoublyLinkedListNode<K, V> = {
      key,
      value,
      expiresAt,
      prev: null,
      next: null,
    };

    this._map.set(key, newNode);
    this._addToHead(newNode);
    this._size++;

    if (this._size > this._capacity) {
      this._evictLRU();
    }
  }

  /**
   * Checks if a key exists in the cache and is not expired.
   * Does not update recency.
   * @param key - The key to check
   * @returns True if the key exists and is not expired
   */
  has(key: K): boolean {
    const node = this._map.get(key);
    if (!node) {
      return false;
    }

    if (node.expiresAt !== undefined && Date.now() > node.expiresAt) {
      this.delete(key);
      this._expirations++;
      return false;
    }

    return true;
  }

  /**
   * Removes an entry from the cache by key.
   * @param key - The key to remove
   * @returns True if the key was found and removed
   */
  delete(key: K): boolean {
    const node = this._map.get(key);
    if (!node) {
      return false;
    }

    this._removeNode(node);
    this._map.delete(key);
    this._size--;
    return true;
  }

  /**
   * Removes all entries from the cache.
   */
  clear(): void {
    this._map.clear();
    this._head = null;
    this._tail = null;
    this._size = 0;
    this._hits = 0;
    this._misses = 0;
    this._evictions = 0;
    this._expirations = 0;
  }

  /**
   * Returns cache statistics.
   * @returns Object containing hit/miss/eviction/expiration counts and current size
   */
  stats(): CacheStats {
    return {
      size: this._size,
      capacity: this._capacity,
      hits: this._hits,
      misses: this._misses,
      evictions: this._evictions,
      expirations: this._expirations,
    };
  }

  /**
   * Returns all keys in LRU order (oldest first).
   * @returns Array of keys
   */
  keys(): K[] {
    const keys: K[] = [];
    let current = this._tail;
    while (current) {
      keys.push(current.key);
      current = current.prev;
    }
    return keys;
  }

  /**
   * Returns all values in LRU order (oldest first).
   * Expired entries are skipped.
   * @returns Array of values
   */
  values(): V[] {
    const values: V[] = [];
    let current = this._tail;
    const now = Date.now();
    while (current) {
      if (current.expiresAt === undefined || current.expiresAt > now) {
        values.push(current.value);
      }
      current = current.prev;
    }
    return values;
  }

  /**
   * Returns all entries as [key, value] tuples in LRU order (oldest first).
   * Expired entries are skipped.
   * @returns Array of [key, value] tuples
   */
  entries(): [K, V][] {
    const entries: [K, V][] = [];
    let current = this._tail;
    const now = Date.now();
    while (current) {
      if (current.expiresAt === undefined || current.expiresAt > now) {
        entries.push([current.key, current.value]);
      }
      current = current.prev;
    }
    return entries;
  }

  private _addToHead(node: DoublyLinkedListNode<K, V>): void {
    node.next = this._head;
    node.prev = null;

    if (this._head) {
      this._head.prev = node;
    }
    this._head = node;

    if (!this._tail) {
      this._tail = node;
    }
  }

  private _removeNode(node: DoublyLinkedListNode<K, V>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this._head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this._tail = node.prev;
    }
  }

  private _moveToHead(node: DoublyLinkedListNode<K, V>): void {
    if (node === this._head) {
      return;
    }
    this._removeNode(node);
    this._addToHead(node);
  }

  private _evictLRU(): void {
    if (!this._tail) {
      return;
    }
    const keyToEvict = this._tail.key;
    this.delete(keyToEvict);
    this._evictions++;
  }
}
