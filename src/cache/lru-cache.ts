import type { CacheEntry, CacheOptions, CacheStats } from "./types.js";

class DoublyLinkedListNode<K, V> {
  key: K;
  value: V;
  createdAt: number;
  ttlMs: number | undefined;
  prev: DoublyLinkedListNode<K, V> | null = null;
  next: DoublyLinkedListNode<K, V> | null = null;

  constructor(key: K, value: V, createdAt: number, ttlMs?: number) {
    this.key = key;
    this.value = value;
    this.createdAt = createdAt;
    this.ttlMs = ttlMs;
  }
}

export class LRUCache<K = string, V = unknown> {
  private _capacity: number;
  private defaultTtlMs: number | undefined;
  private cache: Map<K, DoublyLinkedListNode<K, V>> = new Map();
  private head: DoublyLinkedListNode<K, V> | null = null;
  private tail: DoublyLinkedListNode<K, V> | null = null;
  private _hits = 0;
  private _misses = 0;
  private _evictions = 0;
  private _expirations = 0;

  constructor(options: CacheOptions<K, V>) {
    this._capacity = options.capacity;
    this.defaultTtlMs = options.defaultTtlMs;
  }

  get(key: K): V | undefined {
    const node = this.cache.get(key);
    if (!node) {
      this._misses++;
      return undefined;
    }

    if (this.isExpired(node)) {
      this.delete(key);
      this._misses++;
      this._expirations++;
      return undefined;
    }

    this._hits++;
    this.moveToFront(node);
    return node.value;
  }

  set(key: K, value: V, ttlMs?: number): void {
    const existingNode = this.cache.get(key);

    if (existingNode) {
      existingNode.value = value;
      existingNode.createdAt = Date.now();
      existingNode.ttlMs = ttlMs ?? this.defaultTtlMs;
      this.moveToFront(existingNode);
      return;
    }

    const now = Date.now();
    const node = new DoublyLinkedListNode(key, value, now, ttlMs ?? this.defaultTtlMs);
    this.cache.set(key, node);
    this.addToFront(node);

    if (this.cache.size > this.capacity) {
      this.evictLRU();
    }
  }

  has(key: K): boolean {
    const node = this.cache.get(key);
    if (!node) {
      return false;
    }

    if (this.isExpired(node)) {
      this.delete(key);
      this._expirations++;
      return false;
    }

    return true;
  }

  delete(key: K): boolean {
    const node = this.cache.get(key);
    if (!node) {
      return false;
    }

    this.removeNode(node);
    this.cache.delete(key);
    return true;
  }

  clear(): void {
    this.cache.clear();
    this.head = null;
    this.tail = null;
    this._hits = 0;
    this._misses = 0;
    this._evictions = 0;
    this._expirations = 0;
  }

  get size(): number {
    this.cleanupExpired();
    return this.cache.size;
  }

  get capacity(): number {
    return this._capacity;
  }

  stats(): CacheStats {
    return {
      hits: this._hits,
      misses: this._misses,
      evictions: this._evictions,
      expirations: this._expirations,
    };
  }

  *keys(): IterableIterator<K> {
    this.cleanupExpired();
    let current = this.head;
    while (current) {
      yield current.key;
      current = current.next;
    }
  }

  *values(): IterableIterator<V> {
    this.cleanupExpired();
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }

  *entries(): IterableIterator<[K, V]> {
    this.cleanupExpired();
    let current = this.head;
    while (current) {
      yield [current.key, current.value];
      current = current.next;
    }
  }

  private isExpired(node: DoublyLinkedListNode<K, V>): boolean {
    if (node.ttlMs === undefined) {
      return false;
    }
    return Date.now() - node.createdAt > node.ttlMs;
  }

  private addToFront(node: DoublyLinkedListNode<K, V>): void {
    node.next = this.head;
    node.prev = null;

    if (this.head) {
      this.head.prev = node;
    }
    this.head = node;

    if (!this.tail) {
      this.tail = node;
    }
  }

  private removeNode(node: DoublyLinkedListNode<K, V>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }

    node.prev = null;
    node.next = null;
  }

  private moveToFront(node: DoublyLinkedListNode<K, V>): void {
    if (node === this.head) {
      return;
    }
    this.removeNode(node);
    this.addToFront(node);
  }

  private evictLRU(): void {
    if (!this.tail) {
      return;
    }
    const nodeToRemove = this.tail;
    this.removeNode(nodeToRemove);
    this.cache.delete(nodeToRemove.key);
    this._evictions++;
  }

  private cleanupExpired(): void {
    const keysToDelete: K[] = [];
    let current = this.tail;

    while (current) {
      if (this.isExpired(current)) {
        keysToDelete.push(current.key);
      }
      current = current.prev;
    }

    for (const key of keysToDelete) {
      const node = this.cache.get(key);
      if (node) {
        this.removeNode(node);
        this.cache.delete(key);
        this._expirations++;
      }
    }
  }
}