export * from './stub';

export class MandatoryComplianceGuard {
  static check(req: any): boolean { return true; }
}
export class RbacGuard {
  static check(userRole: string, allowedRoles: string[]): boolean {
    return allowedRoles.includes(userRole);
  }
}
