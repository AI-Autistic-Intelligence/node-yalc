import * as http from 'http';
import { TracingEngine, TraceContext } from '@node-yalc/tracing';
import { AppLoggerFactory } from '@node-yalc/logger';
import { MicroserviceConfig } from './config';
import { AuthHandler } from './handlers/auth.handler';
import { DocumentHandler } from './handlers/document.handler';
import { HealthHandler } from './handlers/health.handler';
import { StorageService } from './infrastructure/storage.service';

const logger = AppLoggerFactory('StandaloneMicroservice');

export class StandaloneMicroservice {
  private server: http.Server;
  private authHandler: AuthHandler;
  private documentHandler: DocumentHandler;
  private healthHandler: HealthHandler;
  private storageService: StorageService;

  constructor(private config: MicroserviceConfig) {
    this.storageService = new StorageService();
    this.authHandler = new AuthHandler(config.pasetoSecret, config.pasetoIssuer);
    this.documentHandler = new DocumentHandler(this.storageService);
    this.healthHandler = new HealthHandler();

    this.server = http.createServer((req, res) => this.handleRequest(req, res));
  }

  private async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    const startTime = Date.now();
    const method = req.method || 'GET';
    const parsedUrl = new URL(req.url || '/', `http://${this.config.host}:${this.config.port}`);
    const pathname = parsedUrl.pathname;

    // 1. W3C Distributed Tracing propagation via @node-yalc/tracing
    const traceparentHeader = req.headers['traceparent'] as string | undefined;
    const traceCtx: TraceContext = TracingEngine.parseTraceparent(traceparentHeader);
    const traceparent = TracingEngine.formatTraceparent(traceCtx);

    res.setHeader('traceparent', traceparent);
    res.setHeader('Content-Type', 'application/json');

    logger.log(`[HTTP IN] ${method} ${pathname} | traceId: ${traceCtx.traceId}`);

    // Read body for POST/PUT
    let body: any = {};
    if (method === 'POST' || method === 'PUT') {
      try {
        const raw = await this.readRequestBody(req);
        if (raw) body = JSON.parse(raw);
      } catch (err: any) {
        this.sendError(res, 400, 'Invalid JSON payload in request body.', pathname);
        return;
      }
    }

    try {
      // 2. Health Probes
      if (method === 'GET' && pathname === '/health/live') {
        return this.sendJson(res, 200, this.healthHandler.checkLive());
      }
      if (method === 'GET' && pathname === '/health/ready') {
        return this.sendJson(res, 200, this.healthHandler.checkReady());
      }

      // 3. Auth Routes
      if (method === 'POST' && pathname === '/api/v1/auth/login') {
        const result = this.authHandler.login(body);
        return this.sendJson(res, 200, result);
      }
      if (method === 'POST' && pathname === '/api/v1/auth/totp/setup') {
        const username = body?.username || 'engineer@yalc.dev';
        const result = this.authHandler.setupMfa(username);
        return this.sendJson(res, 200, result);
      }
      if (method === 'POST' && pathname === '/api/v1/auth/totp/verify') {
        const result = this.authHandler.verifyMfa(body?.secret, body?.code);
        return this.sendJson(res, 200, result);
      }

      // 4. Guarded Document Routes
      if (pathname.startsWith('/api/v1/documents')) {
        // Enforce PASETO v4 token for document operations
        const authHeader = req.headers['authorization'];
        const user = this.authHandler.verifyAuthToken(authHeader);

        if (method === 'POST' && pathname === '/api/v1/documents') {
          const result = await this.documentHandler.uploadDocument(body, user.sub);
          return this.sendJson(res, 201, result);
        }

        if (method === 'GET' && pathname === '/api/v1/documents') {
          const result = this.documentHandler.listDocuments();
          return this.sendJson(res, 200, result);
        }

        const matchId = pathname.match(/^\/api\/v1\/documents\/([a-zA-Z0-9_-]+)$/);
        if (method === 'GET' && matchId) {
          const result = this.documentHandler.getDocument(matchId[1]);
          return this.sendJson(res, 200, result);
        }

        const matchDownload = pathname.match(/^\/api\/v1\/documents\/([a-zA-Z0-9_-]+)\/download$/);
        if (method === 'GET' && matchDownload) {
          const result = await this.documentHandler.getDownloadLink(matchDownload[1]);
          return this.sendJson(res, 200, result);
        }
      }

      // 404 Route Not Found
      this.sendError(res, 404, `Endpoint '${method} ${pathname}' not found.`, pathname);
    } catch (err: any) {
      const status = err.statusCode || (err.name === 'UnauthorizedError' ? 401 : err.name === 'BadRequestError' ? 400 : err.name === 'NotFoundError' ? 404 : 500);
      logger.error(`[HTTP ERR] ${method} ${pathname} -> ${status}: ${err.message}`, err.stack);
      this.sendError(res, status, err.message, pathname);
    } finally {
      logger.log(`[HTTP OUT] ${method} ${pathname} (${Date.now() - startTime}ms)`);
    }
  }

  private readRequestBody(req: http.IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
      let data = '';
      req.on('data', (chunk) => { data += chunk; });
      req.on('end', () => resolve(data));
      req.on('error', reject);
    });
  }

  private sendJson(res: http.ServerResponse, status: number, data: any): void {
    res.statusCode = status;
    res.end(JSON.stringify(data, null, 2));
  }

  private sendError(res: http.ServerResponse, status: number, message: string, path: string): void {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/problem+json');
    res.end(JSON.stringify({
      type: `https://yalc.dev/errors/${status}`,
      title: status === 401 ? 'Unauthorized' : status === 404 ? 'Not Found' : status === 400 ? 'Bad Request' : 'Internal Error',
      status,
      detail: message,
      instance: path,
      timestamp: new Date().toISOString()
    }, null, 2));
  }

  public async start(): Promise<http.Server> {
    return new Promise((resolve) => {
      this.server.listen(this.config.port, this.config.host, () => {
        logger.log(`================================================================`);
        logger.log(`📦 @node-yalc Standalone Pure Microservice (Zero NestJS)`);
        logger.log(`🌐 Server running at http://${this.config.host}:${this.config.port}`);
        logger.log(`================================================================`);
        resolve(this.server);
      });
    });
  }

  public async stop(): Promise<void> {
    return new Promise((resolve) => {
      this.server.close(() => {
        logger.log(`[StandaloneMicroservice] Server successfully closed.`);
        resolve();
      });
    });
  }

  public getAuthHandler() { return this.authHandler; }
  public getDocumentHandler() { return this.documentHandler; }
  public getStorageService() { return this.storageService; }
}
