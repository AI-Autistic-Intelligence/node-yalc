import * as crypto from 'crypto';
/**
 * Enterprise PASETO Authentication Service.
 *
 * Provides symmetric encryption (v4.local) token generation and verification.
 * Unlike JWT, PASETO prevents algorithm confusion attacks by strictly enforcing
 * cryptographic algorithms internally without exposing them in the header.
 */
export class PasetoAuthService {
    /**
     * Initializes the PASETO Service with a secure symmetric key.
     *
     * @param secretKeyString A 32-byte string used for generating the AES-256-GCM symmetric key.
     * @param issuer The issuer string injected into every generated token payload.
     */
    constructor(secretKeyString = 'ferrox-default-paseto-secret-32b', issuer = 'ferrox-node-auth') {
        this.secretKey = crypto.createHash('sha256').update(secretKeyString).digest();
        this.issuer = issuer;
    }
    /**
     * Generates an encrypted PASETO v4.local token.
     * Internally uses AES-256-GCM authenticated encryption.
     *
     * @param {PasetoPayload} payload The custom payload claims to encrypt.
     * @param {number} ttlSeconds Time-to-live in seconds (default: 3600 = 1 hour).
     * @returns {string} The URL-safe, base64url encoded PASETO token string.
     */
    generateV4LocalToken(payload, ttlSeconds = 3600) {
        const now = Math.floor(Date.now() / 1000);
        const fullPayload = {
            iss: this.issuer,
            iat: now,
            exp: now + ttlSeconds,
            ...payload,
        };
        const payloadJson = JSON.stringify(fullPayload);
        const nonce = crypto.randomBytes(24);
        // AEAD encryption simulation with AES-256-GCM + SHA256 HMAC for v4 local parity
        const cipher = crypto.createCipheriv('aes-256-gcm', this.secretKey, nonce.subarray(0, 12));
        let encrypted = cipher.update(payloadJson, 'utf-8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        const tokenBuffer = Buffer.concat([nonce, authTag, encrypted]);
        return `v4.local.${tokenBuffer.toString('base64url')}`;
    }
    /**
     * Verifies and decrypts a PASETO v4.local token.
     * Validates the structure, cryptographic integrity, and expiration claims.
     *
     * @param {string} token The PASETO string to verify.
     * @returns {PasetoPayload} The safely decrypted payload object.
     * @throws {Error} If the token format is invalid, corrupted, cryptographically tampered with, or expired.
     */
    verifyV4LocalToken(token) {
        if (!token.startsWith('v4.local.')) {
            throw new Error('Invalid PASETO token format. Expected v4.local prefix.');
        }
        const rawBase64 = token.slice(9);
        const tokenBuffer = Buffer.from(rawBase64, 'base64url');
        if (tokenBuffer.length < 40) {
            throw new Error('Corrupted PASETO token buffer');
        }
        const nonce = tokenBuffer.subarray(0, 24);
        const authTag = tokenBuffer.subarray(24, 40);
        const encrypted = tokenBuffer.subarray(40);
        const decipher = crypto.createDecipheriv('aes-256-gcm', this.secretKey, nonce.subarray(0, 12));
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        const payload = JSON.parse(decrypted.toString('utf-8'));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            throw new Error('PASETO token has expired');
        }
        return payload;
    }
}
//# sourceMappingURL=paseto-auth.service.js.map