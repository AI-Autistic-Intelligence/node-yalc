/**
 * Role-Based Access Control (RBAC) Guard for Ferrox Framework.
 * Verifies incoming PASETO (v4.local) authentication tokens and checks if the authenticated user
 * holds the necessary roles to access a specific route.
 */
export class RbacGuard {
    /**
     * Initializes the RBAC Guard.
     *
     * @param pasetoService An instance of the PasetoAuthService for token decryption and verification.
     * @param requiredRoles A list of roles. The user must possess at least ONE of these roles. If empty, it only verifies authentication.
     */
    constructor(pasetoService, requiredRoles = []) {
        this.pasetoService = pasetoService;
        this.requiredRoles = requiredRoles;
    }
    /**
     * Evaluates the HTTP request to determine if execution should proceed.
     * Looks for the 'Authorization: Bearer <TOKEN>' header.
     *
     * @param {FerroxHttpRequest} req The incoming request object.
     * @param {FerroxHttpResponse} res The outgoing response object (used to immediately return 401/403).
     * @returns {boolean} True if the user is authenticated and authorized, false otherwise.
     */
    canActivate(req, res) {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Missing or invalid Authorization header. Expected Bearer <PASETO-TOKEN>',
            });
            return false;
        }
        const token = authHeader.slice(7);
        try {
            const payload = this.pasetoService.verifyV4LocalToken(token);
            req.user = payload;
            if (this.requiredRoles.length > 0) {
                const userRoles = payload.roles || [];
                const hasRole = this.requiredRoles.some((role) => userRoles.includes(role));
                if (!hasRole) {
                    res.status(403).json({
                        error: 'Forbidden',
                        message: `Insufficient permissions. Required one of: ${this.requiredRoles.join(', ')}`,
                    });
                    return false;
                }
            }
            return true;
        }
        catch (err) {
            res.status(401).json({
                error: 'Unauthorized',
                message: `PASETO token verification failed: ${err.message}`,
            });
            return false;
        }
    }
}
//# sourceMappingURL=rbac.guard.js.map