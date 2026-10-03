import { StorageEngine, MemoryStorageAdapter } from '../storage-engine';

describe('StorageEngine and MemoryStorageAdapter', () => {
  it('should upload, download, and delete correctly', async () => {
    const engine = new StorageEngine();
    
    // Upload string
    const url = await engine.upload('test.txt', 'hello world');
    expect(url).toBe('memory://test.txt');

    // Download
    const downloaded = await engine.download('test.txt');
    expect(downloaded.toString()).toBe('hello world');

    // Upload Buffer
    await engine.upload('buf.bin', Buffer.from('data'));
    expect((await engine.download('buf.bin')).toString()).toBe('data');

    // Presigned
    const presigned = await engine.getPresignedUrl('test.txt');
    expect(presigned).toBe('https://storage.ferrox.dev/memory/test.txt?ttl=3600');

    // Delete
    expect(await engine.delete('test.txt')).toBe(true);
    expect(await engine.delete('non_existent')).toBe(false);

    // Download non-existent
    await expect(engine.download('test.txt')).rejects.toThrow('Object not found in MemoryStorage: test.txt');
  });
});
