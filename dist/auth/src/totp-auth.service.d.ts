/**
 * Enterprise Service for generating and validating Time-Based One-Time Passwords (TOTP).
 * Enables Multi-Factor Authentication (MFA) capabilities compliant with RFC 6238.
 */
export declare class TotpAuthService {
    /**
     * Generates a 32-character base32-encoded TOTP secret.
     * This secret should be securely stored per-user and never exposed after initial setup.
     *
     * @returns {string} A cryptographically secure 32-character hex string representing the secret.
     */
    generateSecret(): string;
    /**
     * Formats an standard `otpauth://` URI.
     * Used for generating QR codes that authenticator apps (e.g., Google Authenticator, Authy) can scan.
     *
     * @param {string} label The account label (e.g., user's email address).
     * @param {string} secret The user's TOTP secret key.
     * @param {string} [issuer='Ferrox'] The application issuing the token.
     * @returns {string} The fully formed otpauth URI.
     */
    generateOtpAuthUri(label: string, secret: string, issuer?: string): string;
    /**
     * Validates a 6-digit TOTP code against a specific secret.
     * Tolerates minor clock skew by validating across a sliding time window.
     *
     * @param {string} secret The securely stored TOTP secret for the user.
     * @param {string} code The 6-digit code submitted by the user.
     * @param {number} [window=1] The acceptance window in 30-second steps. Default is 1 (allows +/- 30 seconds drift).
     * @returns {boolean} True if the code is valid for the current time window, false otherwise.
     */
    verifyTotpCode(secret: string, code: string, window?: number): boolean;
    /**
     * Core TOTP HMAC-SHA1 algorithm implementation (RFC 4226 / RFC 6238).
     *
     * @param {string} secret The TOTP secret key.
     * @param {number} step The specific time step to generate the code for.
     * @returns {string} The computed 6-digit one-time password.
     */
    private generateCodeForStep;
}
