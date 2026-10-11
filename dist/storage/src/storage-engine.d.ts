/**
 * Represents metadata and content for a file stored via the Storage Engine.
 */
export interface StorageObject {
    key: string;
    content: Buffer;
    mimeType: string;
    size: number;
}
/**
 * Standard contract for Storage Providers (e.g., S3, Google Cloud Storage, Local Disk, Memory).
 * Ensures that swapping the underlying storage provider does not require changing business logic.
 */
export interface IStorageAdapter {
    upload(key: string, content: Buffer | string, mimeType?: string): Promise<string>;
    download(key: string): Promise<Buffer>;
    delete(key: string): Promise<boolean>;
    getPresignedUrl(key: string, ttlSecs?: number): Promise<string>;
}
export declare class MemoryStorageAdapter implements IStorageAdapter {
    private store;
    upload(key: string, content: Buffer | string, mimeType?: string): Promise<string>;
    download(key: string): Promise<Buffer>;
    delete(key: string): Promise<boolean>;
    getPresignedUrl(key: string, ttlSecs?: number): Promise<string>;
}
export declare class StorageEngine {
    private adapter;
    constructor(adapter?: IStorageAdapter);
    upload(key: string, content: Buffer | string, mimeType?: string): Promise<string>;
    download(key: string): Promise<Buffer>;
    delete(key: string): Promise<boolean>;
    getPresignedUrl(key: string, ttlSecs?: number): Promise<string>;
}
