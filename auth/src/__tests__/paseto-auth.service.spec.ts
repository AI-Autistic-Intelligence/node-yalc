import { PasetoAuthService } from '../paseto-auth.service';

describe('PasetoAuthService', () => {
  it('should generate and verify a valid token', () => {
    const service = new PasetoAuthService('my-secret-key');
    const token = service.generateV4LocalToken({ sub: 'user123', roles: ['admin'] });
    
    expect(token).toMatch(/^v4\.local\./);
    
    const payload = service.verifyV4LocalToken(token);
    expect(payload.sub).toBe('user123');
    expect(payload.roles).toEqual(['admin']);
    expect(payload.iss).toBe('ferrox-node-auth');
  });

  it('should throw error for invalid token prefix', () => {
    const service = new PasetoAuthService();
    expect(() => service.verifyV4LocalToken('v2.local.abcde')).toThrow('Invalid PASETO token format');
  });

  it('should throw error for corrupted token buffer', () => {
    const service = new PasetoAuthService();
    // 10 bytes in base64 is less than 40
    expect(() => service.verifyV4LocalToken('v4.local.YWJjZGVmZ2hpag==')).toThrow('Corrupted PASETO token buffer');
  });

  it('should throw error for expired token', () => {
    const service = new PasetoAuthService();
    const token = service.generateV4LocalToken({ sub: 'test' }, -100); // expired 100 seconds ago
    expect(() => service.verifyV4LocalToken(token)).toThrow('PASETO token has expired');
  });
});
