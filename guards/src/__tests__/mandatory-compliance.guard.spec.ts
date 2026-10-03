import { MandatoryComplianceGuard } from '../mandatory-compliance.guard';

describe('MandatoryComplianceGuard', () => {
  it('should inject headers and return true for normal request', () => {
    const guard = new MandatoryComplianceGuard();
    const req = { headers: { 'user-agent': 'Mozilla' } };
    const res = { setHeader: jest.fn(), status: jest.fn(), json: jest.fn() };
    
    expect(guard.canActivate(req as any, res as any)).toBe(true);
    expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
  });

  it('should reject malicious user agent', () => {
    const guard = new MandatoryComplianceGuard();
    const req = { headers: { 'user-agent': ['malicious-scanner'] } }; // test array
    const res = { setHeader: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    expect(guard.canActivate(req as any, res as any)).toBe(false);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Forbidden',
      message: 'Security compliance policy violation detected by Ferrox Guard',
    });
  });

  it('should handle undefined user agent', () => {
    const guard = new MandatoryComplianceGuard();
    const req = { headers: {} };
    const res = { setHeader: jest.fn(), status: jest.fn(), json: jest.fn() };
    
    expect(guard.canActivate(req as any, res as any)).toBe(true);
  });
});
