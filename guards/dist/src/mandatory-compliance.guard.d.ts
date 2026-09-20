import { FerroxHttpRequest, FerroxHttpResponse } from '@node-yalc/transports';
export declare class MandatoryComplianceGuard {
    canActivate(req: FerroxHttpRequest, res: FerroxHttpResponse): boolean;
}
