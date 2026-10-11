import { FerroxHttpRequest, FerroxHttpResponse } from '@node-yalc/transports';
import { PasetoAuthService } from '@node-yalc/auth';
/**
 * Role-Based Access Control (RBAC) Guard for Ferrox Framework.
 * Verifies incoming PASETO (v4.local) authentication tokens and checks if the authenticated user
 * holds the necessary roles to access a specific route.
 */
export declare class RbacGuard {
    private pasetoService;
    private requiredRoles;
    /**
     * Initializes the RBAC Guard.
     *
     * @param pasetoService An instance of the PasetoAuthService for token decryption and verification.
     * @param requiredRoles A list of roles. The user must possess at least ONE of these roles. If empty, it only verifies authentication.
     */
    constructor(pasetoService: PasetoAuthService, requiredRoles?: string[]);
    /**
     * Evaluates the HTTP request to determine if execution should proceed.
     * Looks for the 'Authorization: Bearer <TOKEN>' header.
     *
     * @param {FerroxHttpRequest} req The incoming request object.
     * @param {FerroxHttpResponse} res The outgoing response object (used to immediately return 401/403).
     * @returns {boolean} True if the user is authenticated and authorized, false otherwise.
     */
    canActivate(req: FerroxHttpRequest, res: FerroxHttpResponse): boolean;
}
