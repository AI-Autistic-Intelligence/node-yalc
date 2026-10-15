import { StorageEngine, MemoryStorageAdapter } from '@node-yalc/storage';

export class StorageService {
  private engine: StorageEngine;

  constructor() {
    this.engine = new StorageEngine(new MemoryStorageAdapter());
  }

  async storeFile(key: string, content: Buffer | string, mimeType: string): Promise<string> {
    return await this.engine.upload(key, content, mimeType);
  }

  async getFile(key: string): Promise<Buffer> {
    return await this.engine.download(key);
  }

  async removeFile(key: string): Promise<boolean> {
    return await this.engine.delete(key);
  }

  async getDownloadUrl(key: string): Promise<string> {
    return await this.engine.getPresignedUrl(key, 3600);
  }
}
