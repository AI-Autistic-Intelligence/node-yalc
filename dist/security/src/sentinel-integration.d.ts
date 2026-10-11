/**
 * Evaluates AI prompts to prevent Prompt Injection, Jailbreaking, and unauthorized commands.
 */
export declare class AiPromptGuardrailEngine {
}
/**
 * Validates RAG (Retrieval-Augmented Generation) outputs to detect and block hallucinations or non-grounded facts.
 */
export declare class RagHallucinationGroundednessEngine {
}
/**
 * Analyzes payloads using Shannon Entropy to detect obfuscated attacks or encrypted payloads.
 */
export declare class ShannonEntropyEngine {
}
/**
 * Polymorphic Route Engine encrypts and mutates API routes at runtime to prevent automated scraping and deterministic attacks.
 */
export declare class PolymorphicRouteEngine {
    secretKey?: string | undefined;
    /**
     * @param secretKey The symmetric key used for polymorphic route mutation.
     */
    constructor(secretKey?: string | undefined);
}
/**
 * Uses Markov Chains to baseline normal API behavior and detect anomalous sequences of API calls.
 */
export declare class MarkovBehaviorEngine {
}
/**
 * Protects against credential dumping (e.g. LSASS memory dumping) and credential stuffing attacks.
 */
export declare class LsassCredentialGuardEngine {
}
/**
 * Verifies Software Bill of Materials (SBOM) and supply chain integrity for incoming dependencies or artifacts.
 */
export declare class SbomSupplyChainVerifierEngine {
}
/**
 * Ferrox Sentinel Security Engine.
 *
 * An advanced, multi-layered security kernel providing deep packet inspection,
 * AI threat protection, and zero-trust sandboxing. It intercepts malicious requests
 * before they reach the core router.
 */
export declare class FerroxSentinelSecurityEngine {
    aiGuardrails: typeof AiPromptGuardrailEngine;
    ragScorer: typeof RagHallucinationGroundednessEngine;
    shannonEvaluator: typeof ShannonEntropyEngine;
    routeEngine: PolymorphicRouteEngine;
    markovEngine: MarkovBehaviorEngine;
    lsassGuard: typeof LsassCredentialGuardEngine;
    sbomVerifier: typeof SbomSupplyChainVerifierEngine;
    /**
     * Initializes the Sentinel Engine and its sub-modules.
     * @param secretKey A master key used for cryptographic security features (e.g., polymorphic routes).
     */
    constructor(secretKey?: string);
    /**
     * Generates a Linux Seccomp BPF policy for server kernel sandboxing.
     * Blocks potentially dangerous syscalls (e.g. ptrace, execve) at the kernel level.
     *
     * @returns {string} The JSON-formatted Seccomp BPF policy.
     */
    generateSeccompBpfPolicy(): string;
    /**
     * Generates Linux kernel sysctl security hardening configurations.
     * Enables protections such as SYN cookies, reverse path filtering, and dmesg restriction.
     *
     * @returns {string} The formatted `sysctl.conf` string.
     */
    generateSysctlHardeningConfig(): string;
}
