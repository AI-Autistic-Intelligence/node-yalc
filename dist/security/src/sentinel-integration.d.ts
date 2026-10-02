export declare class AiPromptGuardrailEngine {
}
export declare class RagHallucinationGroundednessEngine {
}
export declare class ShannonEntropyEngine {
}
export declare class PolymorphicRouteEngine {
    secretKey?: string | undefined;
    constructor(secretKey?: string | undefined);
}
export declare class MarkovBehaviorEngine {
}
export declare class LsassCredentialGuardEngine {
}
export declare class SbomSupplyChainVerifierEngine {
}
export declare class FerroxSentinelSecurityEngine {
    aiGuardrails: typeof AiPromptGuardrailEngine;
    ragScorer: typeof RagHallucinationGroundednessEngine;
    shannonEvaluator: typeof ShannonEntropyEngine;
    routeEngine: PolymorphicRouteEngine;
    markovEngine: MarkovBehaviorEngine;
    lsassGuard: typeof LsassCredentialGuardEngine;
    sbomVerifier: typeof SbomSupplyChainVerifierEngine;
    constructor(secretKey?: string);
    generateSeccompBpfPolicy(): string;
    generateSysctlHardeningConfig(): string;
}
