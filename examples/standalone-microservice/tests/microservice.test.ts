import { AuthHandler } from '../src/handlers/auth.handler';
import { StorageService } from '../src/infrastructure/storage.service';
import { DocumentHandler } from '../src/handlers/document.handler';
import { ResilientClient } from '../src/infrastructure/resilient-client';
import { TracingEngine } from '@node-yalc/tracing';
import { BadRequestError, UnauthorizedError } from '@node-yalc/errors';

describe('@node-yalc Standalone Microservice Suite', () => {
  const secretKey = 'test-secret-key-32b-yalc-standalone';
  const issuer = 'test-yalc-issuer';

  describe('1. @node-yalc/auth Integration', () => {
    const auth = new AuthHandler(secretKey, issuer);

    it('should issue valid PASETO v4.local symmetric token upon login', () => {
      const loginRes = auth.login({ username: 'lead_dev', password: 'yalc_master_secret' });
      expect(loginRes.success).toBe(true);
      expect(loginRes.token).toMatch(/^v4\.local\./);

      const verified = auth.verifyAuthToken(`Bearer ${loginRes.token}`);
      expect(verified.sub).toBe('lead_dev');
      expect(verified.roles).toContain('engineer');
    });

    it('should reject invalid credentials with UnauthorizedError', () => {
      expect(() => {
        auth.login({ username: 'lead_dev', password: 'wrong_password' });
      }).toThrow(UnauthorizedError);
    });

    it('should setup and verify TOTP 2FA multi-factor authentication', () => {
      const { secret, uri } = auth.setupMfa('lead_dev');
      expect(secret).toHaveLength(32);
      expect(uri).toContain('otpauth://totp/');

      // Verification
      const totpAuth = new (require('@node-yalc/auth').TotpAuthService)();
      const currentStep = Math.floor(Date.now() / 1000 / 30);
      const code = (totpAuth as any).generateCodeForStep(secret, currentStep);

      const res = auth.verifyMfa(secret, code);
      expect(res.success).toBe(true);
    });
  });

  describe('2. @node-yalc/storage & @node-yalc/cqrs (Distributed Saga)', () => {
    let storage: StorageService;
    let docHandler: DocumentHandler;

    beforeEach(() => {
      storage = new StorageService();
      docHandler = new DocumentHandler(storage);
    });

    it('should successfully execute 3-step Saga for document upload', async () => {
      const result = await docHandler.uploadDocument({
        filename: 'architecture_spec.pdf',
        content: 'JVBERi0xLjQKJcTl8uXr...',
        mimeType: 'application/pdf'
      }, 'usr_dev_01');

      expect(result.success).toBe(true);
      expect(result.data.status).toBe('STORED');
      expect(result.data.storageUrl).toBeDefined();

      const retrieved = docHandler.getDocument(result.data.id);
      expect(retrieved?.data.filename).toBe('architecture_spec.pdf');
    });

    it('should rollback and delete storage artifact if Saga security scan fails', async () => {
      await expect(
        docHandler.uploadDocument({
          documentId: 'doc_malicious_01',
          filename: 'virus.exe',
          content: 'EICAR-STANDARD-ANTIVIRUS-TEST-FILE',
          simulateScanFailure: true
        }, 'usr_attacker')
      ).rejects.toThrow('Antivirus heuristic triggered');

      // Verify document was not committed to DB
      expect(() => docHandler.getDocument('doc_malicious_01')).toThrow();
    });
  });

  describe('3. @node-yalc/resilience', () => {
    it('should protect downstream execution with CircuitBreaker and Singleflight', async () => {
      const client = new ResilientClient();
      let executionCount = 0;

      // Singleflight call deduplication
      const call = () => client.executeGuardedCall('heavy_calc', async () => {
        executionCount++;
        await new Promise((r) => setTimeout(r, 20));
        return 42;
      });

      const [res1, res2, res3] = await Promise.all([call(), call(), call()]);
      expect(res1).toBe(42);
      expect(res2).toBe(42);
      expect(res3).toBe(42);
      expect(executionCount).toBe(1); // Executed exactly once thanks to Singleflight!
    });
  });

  describe('4. @node-yalc/tracing', () => {
    it('should parse and format W3C Trace Context (traceparent)', () => {
      const ctx = TracingEngine.createTraceContext();
      expect(ctx.traceId).toHaveLength(32);
      expect(ctx.spanId).toHaveLength(16);

      const header = TracingEngine.formatTraceparent(ctx);
      expect(header).toMatch(/^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/);

      const parsed = TracingEngine.parseTraceparent(header);
      expect(parsed.traceId).toBe(ctx.traceId);
      expect(parsed.spanId).toBe(ctx.spanId);
    });
  });
});
