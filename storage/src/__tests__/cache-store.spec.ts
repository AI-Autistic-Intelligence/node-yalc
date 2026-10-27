import { MemoryCacheStore, FileCacheStore, TieredCacheStore } from '../cache-store.js';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

describe('CacheStore Suite', () => {
  describe('MemoryCacheStore', () => {
    it('should store, retrieve, and evict least recently used entries', async () => {
      const store = new MemoryCacheStore(2);
      await store.set('k1', { storedAt: 100, body: 'val1' });
      await store.set('k2', { storedAt: 200, body: 'val2' });

      // Access k1 to make it recently used
      const hit1 = await store.get('k1');
      expect(hit1?.body).toBe('val1');

      // Insert k3 -> should evict k2 (oldest)
      await store.set('k3', { storedAt: 300, body: 'val3' });

      expect(await store.get('k2')).toBeUndefined();
      expect(await store.get('k1')).toBeDefined();
      expect(await store.get('k3')).toBeDefined();

      await store.delete('k1');
      expect(await store.get('k1')).toBeUndefined();

      await store.clear();
      expect(await store.get('k3')).toBeUndefined();
    });
  });

  describe('FileCacheStore', () => {
    const tmpDir = path.join(os.tmpdir(), `test-cache-store-${Date.now()}`);

    afterAll(async () => {
      try {
        await fs.rm(tmpDir, { recursive: true, force: true });
      } catch {}
    });

    it('should round-trip cache entries and handle missing/corrupted files', async () => {
      const store = new FileCacheStore(tmpDir);
      expect(await store.get('non-existent')).toBeUndefined();

      await store.set('test-key', { storedAt: 12345, body: { msg: 'hello' } });
      const hit = await store.get('test-key');
      expect(hit).toBeDefined();
      expect(hit?.storedAt).toBe(12345);
      expect((hit?.body as any).msg).toBe('hello');

      const deleted = await store.delete('test-key');
      expect(deleted).toBe(true);
      expect(await store.get('test-key')).toBeUndefined();
    });
  });

  describe('TieredCacheStore', () => {
    it('should promote cold durable hits to hot memory', async () => {
      const memory = new MemoryCacheStore(10);
      const durable = new MemoryCacheStore(10);
      const tiered = new TieredCacheStore(memory, durable);

      // Seed directly into durable
      await durable.set('cold-key', { storedAt: 500, body: 'cold-data' });

      expect(await memory.get('cold-key')).toBeUndefined();

      const res = await tiered.get('cold-key');
      expect(res?.body).toBe('cold-data');

      // Now it should have been promoted to memory
      const hotRes = await memory.get('cold-key');
      expect(hotRes?.body).toBe('cold-data');

      // Test tiered set
      await tiered.set('new-key', { storedAt: 600, body: 'new-data' });
      expect((await memory.get('new-key'))?.body).toBe('new-data');
      expect((await durable.get('new-key'))?.body).toBe('new-data');

      await tiered.delete('new-key');
      expect(await tiered.get('new-key')).toBeUndefined();
    });
  });
});
