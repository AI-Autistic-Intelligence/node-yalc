export type DocumentStatus = 'PENDING' | 'SCANNED' | 'STORED' | 'FAILED' | 'REJECTED';

export interface DocumentEntity {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  storageUrl?: string;
  ownerId: string;
  status: DocumentStatus;
  createdAt: string;
  scannedAt?: string;
}
