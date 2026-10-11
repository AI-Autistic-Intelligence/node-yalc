import { FerroxHttpRequest, FerroxHttpResponse } from '@node-yalc/transports';
/**
 * Global Security Compliance Guard for the Ferrox Framework.
 * Ensures every incoming request adheres to strict security policies before any business logic is executed.
 * Automatically injects required HTTP security headers (HSTS, CSP, XSS Protection).
 */
export declare class MandatoryComplianceGuard {
    /**
     * Mutates the response to inject security headers and drops malicious requests.
     *
     * @param {FerroxHttpRequest} req The incoming HTTP request.
     * @param {FerroxHttpResponse} res The outgoing HTTP response (mutated to include headers).
     * @returns {boolean} True if the request is benign, false if blocked.
     */
    canActivate(req: FerroxHttpRequest, res: FerroxHttpResponse): boolean;
}
