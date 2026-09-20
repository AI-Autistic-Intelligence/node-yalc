export * from './stub';

export class StorageEngine {
  async uploadFile(path: string, buffer: Buffer): Promise<void> {}
}
