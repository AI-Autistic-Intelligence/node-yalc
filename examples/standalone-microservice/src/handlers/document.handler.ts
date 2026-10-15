import { DocumentIngestionSaga, DocumentUploadInput } from '../domain/document-saga';
import { StorageService } from '../infrastructure/storage.service';
import { ResilientClient } from '../infrastructure/resilient-client';
import { BadRequestError, NotFoundError } from '@node-yalc/errors';

export class DocumentHandler {
  private saga: DocumentIngestionSaga;
  private resilientClient: ResilientClient;

  constructor(private storageService: StorageService) {
    this.saga = new DocumentIngestionSaga(storageService);
    this.resilientClient = new ResilientClient();
  }

  async uploadDocument(body: Partial<DocumentUploadInput>, ownerId: string) {
    if (!body?.filename || !body?.content) {
      throw new BadRequestError('filename and content (base64 or text) are required.');
    }

    const input: DocumentUploadInput = {
      documentId: body.documentId || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      filename: body.filename,
      mimeType: body.mimeType || 'application/pdf',
      content: body.content,
      ownerId: ownerId || 'usr_anonymous',
      simulateScanFailure: body.simulateScanFailure || false
    };

    // Execute upload guarded by resilient client (CircuitBreaker + RateLimiting)
    const doc = await this.resilientClient.executeGuardedCall(
      `upload_${input.documentId}`,
      async () => await this.saga.processUpload(input)
    );

    return {
      success: true,
      data: doc
    };
  }

  getDocument(id: string) {
    const doc = this.saga.getDocument(id);
    if (!doc) {
      throw new NotFoundError(`Document ${id} does not exist.`);
    }

    return {
      success: true,
      data: doc
    };
  }

  listDocuments() {
    return {
      success: true,
      data: this.saga.getAllDocuments()
    };
  }

  async getDownloadLink(id: string) {
    const doc = this.saga.getDocument(id);
    if (!doc || !doc.storageUrl) {
      throw new NotFoundError(`Document ${id} has no storage object.`);
    }

    const downloadUrl = await this.storageService.getDownloadUrl(id);
    return {
      success: true,
      documentId: id,
      downloadUrl
    };
  }
}
