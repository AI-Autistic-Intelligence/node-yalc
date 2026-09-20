import { FerroxHttpRequest, FerroxHttpResponse } from '@node-yalc/transports';
import { PasetoAuthService } from '@node-yalc/auth';
export declare class RbacGuard {
    private pasetoService;
    private requiredRoles;
    constructor(pasetoService: PasetoAuthService, requiredRoles?: string[]);
    canActivate(req: FerroxHttpRequest, res: FerroxHttpResponse): boolean;
}
