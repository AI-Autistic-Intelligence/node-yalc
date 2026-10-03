import { TotpAuthService } from '../totp-auth.service';

describe('TotpAuthService', () => {
  let service: TotpAuthService;

  beforeEach(() => {
    service = new TotpAuthService();
  });

  it('should generate a secret of correct length', () => {
    const secret = service.generateSecret();
    expect(secret.length).toBe(32);
  });

  it('should generate an OTP Auth URI', () => {
    const secret = service.generateSecret();
    const uri = service.generateOtpAuthUri('test@test.com', secret, 'MyApp');
    expect(uri).toContain('otpauth://totp/MyApp:test%40test.com');
    expect(uri).toContain(`secret=${secret}`);
  });

  it('should generate a code and verify it successfully', () => {
    const secret = service.generateSecret();
    const currentStep = Math.floor(Date.now() / 1000 / 30);
    const validCode = (service as any).generateCodeForStep(secret, currentStep);
    
    expect(service.verifyTotpCode(secret, validCode)).toBe(true);
  });

  it('should reject an invalid code', () => {
    const secret = service.generateSecret();
    expect(service.verifyTotpCode(secret, '000000')).toBe(false);
  });
});
