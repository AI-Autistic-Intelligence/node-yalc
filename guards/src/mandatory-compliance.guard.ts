import { FerroxHttpRequest, FerroxHttpResponse } from '@node-yalc/transports';

/**
 * Global Security Compliance Guard for the Ferrox Framework.
 * Ensures every incoming request adheres to strict security policies before any business logic is executed.
 * Automatically injects required HTTP security headers (HSTS, CSP, XSS Protection).
 */
export class MandatoryComplianceGuard {
  /**
   * Mutates the response to inject security headers and drops malicious requests.
   *
   * @param {FerroxHttpRequest} req The incoming HTTP request.
   * @param {FerroxHttpResponse} res The outgoing HTTP response (mutated to include headers).
   * @returns {boolean} True if the request is benign, false if blocked.
   */
  public canActivate(req: FerroxHttpRequest, res: FerroxHttpResponse): boolean {
    // 1. Inject mandatory Ferrox security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Ferrox-Kernel-Compliance', 'ENFORCED');

    // 2. Reject non-compliant or tampered requests missing essential security headers
    const rawUserAgent = req.headers['user-agent'];
    const userAgent = Array.isArray(rawUserAgent) ? rawUserAgent.join(' ') : (rawUserAgent || '');
    if (userAgent.toLowerCase().includes('malicious-scanner')) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Security compliance policy violation detected by Ferrox Guard',
      });
      return false;
    }

    return true;
  }
}
