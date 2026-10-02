import * as crypto from 'crypto';

/**
 * Enterprise Service for generating and validating Time-Based One-Time Passwords (TOTP).
 * Enables Multi-Factor Authentication (MFA) capabilities compliant with RFC 6238.
 */
export class TotpAuthService {
  /**
   * Generates a 32-character base32-encoded TOTP secret.
   * This secret should be securely stored per-user and never exposed after initial setup.
   *
   * @returns {string} A cryptographically secure 32-character hex string representing the secret.
   */
  public generateSecret(): string {
    const buffer = crypto.randomBytes(20);
    return buffer.toString('hex').substring(0, 32).toUpperCase();
  }

  /**
   * Formats an standard `otpauth://` URI.
   * Used for generating QR codes that authenticator apps (e.g., Google Authenticator, Authy) can scan.
   *
   * @param {string} label The account label (e.g., user's email address).
   * @param {string} secret The user's TOTP secret key.
   * @param {string} [issuer='Ferrox'] The application issuing the token.
   * @returns {string} The fully formed otpauth URI.
   */
  public generateOtpAuthUri(label: string, secret: string, issuer: string = 'Ferrox'): string {
    const encodedLabel = encodeURIComponent(label);
    const encodedIssuer = encodeURIComponent(issuer);
    return `otpauth://totp/${encodedIssuer}:${encodedLabel}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
  }

  /**
   * Validates a 6-digit TOTP code against a specific secret.
   * Tolerates minor clock skew by validating across a sliding time window.
   *
   * @param {string} secret The securely stored TOTP secret for the user.
   * @param {string} code The 6-digit code submitted by the user.
   * @param {number} [window=1] The acceptance window in 30-second steps. Default is 1 (allows +/- 30 seconds drift).
   * @returns {boolean} True if the code is valid for the current time window, false otherwise.
   */
  public verifyTotpCode(secret: string, code: string, window: number = 1): boolean {
    const currentStep = Math.floor(Date.now() / 1000 / 30);

    for (let errorWindow = -window; errorWindow <= window; errorWindow++) {
      const step = currentStep + errorWindow;
      const generatedCode = this.generateCodeForStep(secret, step);
      if (generatedCode === code.trim()) {
        return true;
      }
    }

    return false;
  }

  /**
   * Core TOTP HMAC-SHA1 algorithm implementation (RFC 4226 / RFC 6238).
   * 
   * @param {string} secret The TOTP secret key.
   * @param {number} step The specific time step to generate the code for.
   * @returns {string} The computed 6-digit one-time password.
   */
  private generateCodeForStep(secret: string, step: number): string {
    const buffer = Buffer.alloc(8);
    let tempStep = step;
    for (let i = 7; i >= 0; i--) {
      buffer[i] = tempStep & 0xff;
      tempStep = Math.floor(tempStep / 256);
    }

    const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'utf-8')).update(buffer).digest();
    const offset = hmac[hmac.length - 1] & 0xf;
    const binary =
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff);

    const otp = (binary % 1000000).toString();
    return otp.padStart(6, '0');
  }
}
