import { RbacGuard } from '../rbac.guard';
import { PasetoAuthService } from '@node-yalc/auth';

describe('RbacGuard', () => {
  let pasetoService: PasetoAuthService;
  
  beforeEach(() => {
    pasetoService = new PasetoAuthService('my-secret');
  });

  it('should deny request if Authorization header is missing', () => {
    const guard = new RbacGuard(pasetoService);
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    expect(guard.canActivate(req as any, res as any)).toBe(false);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should deny request if token verification fails', () => {
    const guard = new RbacGuard(pasetoService);
    const req = { headers: { authorization: 'Bearer v2.local.invalid' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    expect(guard.canActivate(req as any, res as any)).toBe(false);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should allow request if token is valid and no roles are required', () => {
    const token = pasetoService.generateV4LocalToken({ sub: '123' });
    const guard = new RbacGuard(pasetoService);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    expect(guard.canActivate(req as any, res as any)).toBe(true);
    expect((req as any).user.sub).toBe('123');
  });

  it('should allow request if user has required role', () => {
    const token = pasetoService.generateV4LocalToken({ sub: '123', roles: ['admin', 'user'] });
    const guard = new RbacGuard(pasetoService, ['admin']);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    expect(guard.canActivate(req as any, res as any)).toBe(true);
  });

  it('should deny request if user lacks required role', () => {
    const token = pasetoService.generateV4LocalToken({ sub: '123', roles: ['user'] });
    const guard = new RbacGuard(pasetoService, ['admin']);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    expect(guard.canActivate(req as any, res as any)).toBe(false);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('should deny request if user has no roles and role is required', () => {
    const token = pasetoService.generateV4LocalToken({ sub: '123' });
    const guard = new RbacGuard(pasetoService, ['admin']);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    expect(guard.canActivate(req as any, res as any)).toBe(false);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
