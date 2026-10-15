import { AcidSagaCoordinator, SagaTransaction } from '@node-yalc/cqrs';
import { AppLoggerFactory } from '@node-yalc/logger';
import { StorageService } from '../infrastructure/storage.service';
import { DocumentEntity } from './document.model';

const logger = AppLoggerFactory('DocumentIngestionSaga');

export interface DocumentUploadInput {
  documentId: string;
  filename: string;
  mimeType: string;
  content: string; // Base64 or utf8 string
  ownerId: string;
  simulateScanFailure?: boolean;
}

export class DocumentIngestionSaga {
  private documentDb: Map<string, DocumentEntity> = new Map();

  constructor(private storageService: StorageService) {}

  async processUpload(input: DocumentUploadInput): Promise<DocumentEntity> {
    const coordinator = new AcidSagaCoordinator();
    const docEntity: DocumentEntity = {
      id: input.documentId,
      filename: input.filename,
      mimeType: input.mimeType,
      sizeBytes: Buffer.byteLength(input.content),
      ownerId: input.ownerId,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    const tx: SagaTransaction = {
      id: input.documentId,
      payload: { ...input, docEntity, storageKey: null }
    };

    // STEP 1: Security & Antivirus Scan
    coordinator.addStep(
      'SecurityScanStep',
      async (t) => {
        if (t.payload.simulateScanFailure) {
          throw new Error('Antivirus heuristic triggered: Malicious signature detected.');
        }
        logger.log(`[SAGA STEP 1] Document ${t.id} successfully passed security scanner`);
        t.payload.docEntity.status = 'SCANNED';
        t.payload.docEntity.scannedAt = new Date().toISOString();
        return { scanned: true };
      },
      async (t) => {
        logger.warn(`[SAGA STEP 1 ROLLBACK] Resetting document state for ${t.id}`);
        t.payload.docEntity.status = 'REJECTED';
      }
    );

    // STEP 2: Storage Upload
    coordinator.addStep(
      'StorageUploadStep',
      async (t) => {
        const key = `docs/${t.payload.ownerId}/${t.id}/${t.payload.filename}`;
        const url = await this.storageService.storeFile(key, t.payload.content, t.payload.mimeType);
        t.payload.storageKey = key;
        t.payload.docEntity.storageUrl = url;
        logger.log(`[SAGA STEP 2] Uploaded object to storage at ${url}`);
        return { key, url };
      },
      async (_t, result) => {
        if (result?.key) {
          await this.storageService.removeFile(result.key);
          logger.warn(`[SAGA STEP 2 ROLLBACK] Deleted orphaned storage object ${result.key}`);
        }
      }
    );

    // STEP 3: Database Persistence
    coordinator.addStep(
      'DatabaseCommitStep',
      async (t) => {
        t.payload.docEntity.status = 'STORED';
        this.documentDb.set(t.id, t.payload.docEntity);
        logger.log(`[SAGA STEP 3] Document ${t.id} committed to database as STORED`);
        return t.payload.docEntity;
      },
      async (t) => {
        this.documentDb.delete(t.id);
        logger.warn(`[SAGA STEP 3 ROLLBACK] Removed document record ${t.id} from database`);
      }
    );

    await coordinator.execute(tx);
    return tx.payload.docEntity;
  }

  getDocument(id: string): DocumentEntity | null {
    return this.documentDb.get(id) || null;
  }

  getAllDocuments(): DocumentEntity[] {
    return Array.from(this.documentDb.values());
  }
}
