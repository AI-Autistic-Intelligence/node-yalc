import { PasetoAuthService, TotpAuthService } from '@node-yalc/auth';
import { BadRequestError, UnauthorizedError } from '@node-yalc/errors';

export class AuthHandler {
  private paseto: PasetoAuthService;
  private totp: TotpAuthService;

  constructor(secretKey: string, issuer: string) {
    this.paseto = new PasetoAuthService(secretKey, issuer);
    this.totp = new TotpAuthService();
  }

  login(body: { username?: string; password?: string }) {
    if (!body?.username || !body?.password) {
      throw new BadRequestError('Username and password are required.');
    }

    if (body.password !== 'yalc_master_secret') {
      throw new UnauthorizedError('Invalid credentials.');
    }

    const token = this.paseto.generateV4LocalToken({
      sub: body.username,
      roles: ['engineer', 'reader']
    }, 7200);

    return {
      success: true,
      tokenType: 'v4.local',
      token,
      expiresIn: 7200
    };
  }

  verifyAuthToken(authHeader?: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or malformed Authorization header.');
    }

    const token = authHeader.substring(7);
    try {
      return this.paseto.verifyV4LocalToken(token);
    } catch (err: any) {
      throw new UnauthorizedError(`Invalid PASETO token: ${err.message}`);
    }
  }

  setupMfa(username: string) {
    const secret = this.totp.generateSecret();
    const uri = this.totp.generateOtpAuthUri(`${username}@yalc.dev`, secret, 'NodeYalcStandalone');
    return { secret, uri };
  }

  verifyMfa(secret: string, code: string) {
    if (!secret || !code) {
      throw new BadRequestError('Both secret and code are required.');
    }

    const valid = this.totp.verifyTotpCode(secret, code);
    if (!valid) {
      throw new UnauthorizedError('Invalid or expired MFA code.');
    }

    return { success: true, message: 'MFA 2FA successfully verified.' };
  }
}
