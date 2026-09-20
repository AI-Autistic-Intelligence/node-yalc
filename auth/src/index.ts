export * from './stub';

export class PasetoAuthService {
  async generateV4LocalToken(payload: any, secretKey: string): Promise<string> {
    return 'v4.local.token';
  }
}
export class TotpAuthService {
  generateSecret(): string { return 'secret'; }
  verify(token: string, secret: string): boolean { return true; }
}
