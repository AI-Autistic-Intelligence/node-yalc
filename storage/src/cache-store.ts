import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

export interface CacheEntry {
  readonly storedAt: number;
  readonly body: unknown;
}

/**
 * Common cache store interface for key-value caching with expiration/timestamp tracking.
 */
export interface CacheStore {
  get(key: string): Promise<CacheEntry | undefined>;
  set(key: string, entry: CacheEntry): Promise<void>;
  delete?(key: string): Promise<boolean>;
  clear?(): Promise<void>;
}

/**
 * In-memory LRU cache store.
 */
export class MemoryCacheStore implements CacheStore {
  private readonly map = new Map<string, CacheEntry>();

  constructor(private readonly maxEntries = 2000) {}

  async get(key: string): Promise<CacheEntry | undefined> {
    const hit = this.map.get(key);
    if (hit) {
      this.map.delete(key);
      this.map.set(key, hit);
    }
    return hit;
  }

  async set(key: string, entry: CacheEntry): Promise<void> {
    this.map.delete(key);
    this.map.set(key, entry);
    while (this.map.size > this.maxEntries) {
      const oldest = this.map.keys().next().value as string;
      this.map.delete(oldest);
    }
  }

  async delete(key: string): Promise<boolean> {
    return this.map.delete(key);
  }

  async clear(): Promise<void> {
    this.map.clear();
  }
}

/**
 * Durable on-disk JSON file cache store.
 */
export class FileCacheStore implements CacheStore {
  constructor(private readonly dir: string) {}

  private fileFor(key: string): string {
    return path.join(this.dir, `${createHash('sha1').update(key).digest('hex')}.json`);
  }

  async get(key: string): Promise<CacheEntry | undefined> {
    try {
      const raw = await fs.readFile(this.fileFor(key), 'utf8');
      const parsed = JSON.parse(raw) as { key: string; storedAt: number; body: unknown };
      return parsed.key === key ? { storedAt: parsed.storedAt, body: parsed.body } : undefined;
    } catch {
      return undefined;
    }
  }

  async set(key: string, entry: CacheEntry): Promise<void> {
    try {
      await fs.mkdir(this.dir, { recursive: true });
      await fs.writeFile(this.fileFor(key), JSON.stringify({ key, ...entry }), 'utf8');
    } catch {
      // Tolerate failure in read-only filesystems or restricted environments
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      await fs.unlink(this.fileFor(key));
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Two-level tiered cache store (L1 hot Memory + L2 durable Disk/Remote).
 * Automatically promotes L2 hits into L1 memory for subsequent zero-IO accesses.
 */
export class TieredCacheStore implements CacheStore {
  constructor(
    private readonly memory: CacheStore,
    private readonly durable: CacheStore
  ) {}

  async get(key: string): Promise<CacheEntry | undefined> {
    const hot = await this.memory.get(key);
    if (hot) return hot;
    const cold = await this.durable.get(key);
    if (cold) {
      await this.memory.set(key, cold);
    }
    return cold;
  }

  async set(key: string, entry: CacheEntry): Promise<void> {
    await this.memory.set(key, entry);
    await this.durable.set(key, entry);
  }

  async delete(key: string): Promise<boolean> {
    const d1 = this.memory.delete ? await this.memory.delete(key) : false;
    const d2 = this.durable.delete ? await this.durable.delete(key) : false;
    return d1 || d2;
  }
}
