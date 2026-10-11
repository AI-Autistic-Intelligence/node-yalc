/**
 * Standardized payload structure for PASETO (Platform-Agnostic Security Tokens).
 * Designed to be a highly secure, modern replacement for JWTs.
 */
export interface PasetoPayload {
    /** The subject (usually the User ID) the token belongs to. */
    sub: string;
    /** An array of role claims for Role-Based Access Control (RBAC). */
    roles?: string[];
    /** Expiration timestamp (in seconds since UNIX epoch). */
    exp?: number;
    /** Issued-At timestamp (in seconds since UNIX epoch). */
    iat?: number;
    /** The issuer of the token (e.g., 'ferrox-node-auth'). */
    iss?: string;
    /** Additional custom claims. */
    [key: string]: unknown;
}
/**
 * Enterprise PASETO Authentication Service.
 *
 * Provides symmetric encryption (v4.local) token generation and verification.
 * Unlike JWT, PASETO prevents algorithm confusion attacks by strictly enforcing
 * cryptographic algorithms internally without exposing them in the header.
 */
export declare class PasetoAuthService {
    private secretKey;
    private issuer;
    /**
     * Initializes the PASETO Service with a secure symmetric key.
     *
     * @param secretKeyString A 32-byte string used for generating the AES-256-GCM symmetric key.
     * @param issuer The issuer string injected into every generated token payload.
     */
    constructor(secretKeyString?: string, issuer?: string);
    /**
     * Generates an encrypted PASETO v4.local token.
     * Internally uses AES-256-GCM authenticated encryption.
     *
     * @param {PasetoPayload} payload The custom payload claims to encrypt.
     * @param {number} ttlSeconds Time-to-live in seconds (default: 3600 = 1 hour).
     * @returns {string} The URL-safe, base64url encoded PASETO token string.
     */
    generateV4LocalToken(payload: PasetoPayload, ttlSeconds?: number): string;
    /**
     * Verifies and decrypts a PASETO v4.local token.
     * Validates the structure, cryptographic integrity, and expiration claims.
     *
     * @param {string} token The PASETO string to verify.
     * @returns {PasetoPayload} The safely decrypted payload object.
     * @throws {Error} If the token format is invalid, corrupted, cryptographically tampered with, or expired.
     */
    verifyV4LocalToken(token: string): PasetoPayload;
}
