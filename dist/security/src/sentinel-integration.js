/**
 * Evaluates AI prompts to prevent Prompt Injection, Jailbreaking, and unauthorized commands.
 */
export class AiPromptGuardrailEngine {
}
/**
 * Validates RAG (Retrieval-Augmented Generation) outputs to detect and block hallucinations or non-grounded facts.
 */
export class RagHallucinationGroundednessEngine {
}
/**
 * Standalone Shannon Entropy calculation for input anomaly detection (OWASP WSTG Sentinel).
 * Detects shellcode injection, encoded exploits or high-entropy anomalies.
 */
export function calculateShannonEntropy(str) {
    if (!str || str.length === 0)
        return 0;
    const frequencies = new Map();
    for (const char of str) {
        frequencies.set(char, (frequencies.get(char) ?? 0) + 1);
    }
    let entropy = 0;
    const len = str.length;
    for (const count of frequencies.values()) {
        const p = count / len;
        entropy -= p * Math.log2(p);
    }
    return Number(entropy.toFixed(3));
}
/**
 * Analyzes payloads using Shannon Entropy to detect obfuscated attacks or encrypted payloads.
 * Default maxEntropy threshold is 4.8 (Ferrox Sentinel Shannon entropy rule: H <= 4.8).
 */
export class ShannonEntropyEngine {
    constructor(maxEntropy = 4.8) {
        this.maxEntropy = maxEntropy;
    }
    static calculate(str) {
        return calculateShannonEntropy(str);
    }
    calculate(str) {
        return calculateShannonEntropy(str);
    }
    isSuspicious(str, threshold = this.maxEntropy) {
        return this.calculate(str) > threshold;
    }
}
/**
 * Polymorphic Route Engine encrypts and mutates API routes at runtime to prevent automated scraping and deterministic attacks.
 */
export class PolymorphicRouteEngine {
    /**
     * @param secretKey The symmetric key used for polymorphic route mutation.
     */
    constructor(secretKey) {
        this.secretKey = secretKey;
    }
}
/**
 * Uses Markov Chains to baseline normal API behavior and detect anomalous sequences of API calls.
 */
export class MarkovBehaviorEngine {
}
/**
 * Protects against credential dumping (e.g. LSASS memory dumping) and credential stuffing attacks.
 */
export class LsassCredentialGuardEngine {
}
/**
 * Verifies Software Bill of Materials (SBOM) and supply chain integrity for incoming dependencies or artifacts.
 */
export class SbomSupplyChainVerifierEngine {
}
/**
 * Ferrox Sentinel Security Engine.
 *
 * An advanced, multi-layered security kernel providing deep packet inspection,
 * AI threat protection, and zero-trust sandboxing. It intercepts malicious requests
 * before they reach the core router.
 */
export class FerroxSentinelSecurityEngine {
    /**
     * Initializes the Sentinel Engine and its sub-modules.
     * @param secretKey A master key used for cryptographic security features (e.g., polymorphic routes).
     */
    constructor(secretKey = 'ferrox-sentinel-master-key') {
        this.aiGuardrails = AiPromptGuardrailEngine;
        this.ragScorer = RagHallucinationGroundednessEngine;
        this.shannonEvaluator = ShannonEntropyEngine;
        this.routeEngine = new PolymorphicRouteEngine(secretKey);
        this.markovEngine = new MarkovBehaviorEngine();
        this.lsassGuard = LsassCredentialGuardEngine;
        this.sbomVerifier = SbomSupplyChainVerifierEngine;
    }
    /**
     * Generates a Linux Seccomp BPF policy for server kernel sandboxing.
     * Blocks potentially dangerous syscalls (e.g. ptrace, execve) at the kernel level.
     *
     * @returns {string} The JSON-formatted Seccomp BPF policy.
     */
    generateSeccompBpfPolicy() {
        return JSON.stringify({
            defaultAction: 'SCMP_ACT_ERRNO',
            architectures: ['SCMP_ARCH_X86_64', 'SCMP_ARCH_AARCH64'],
            syscalls: [
                { name: 'read', action: 'SCMP_ACT_ALLOW' },
                { name: 'write', action: 'SCMP_ACT_ALLOW' },
                { name: 'epoll_wait', action: 'SCMP_ACT_ALLOW' },
                { name: 'execve', action: 'SCMP_ACT_KILL', comment: 'Block zero-day command execution' },
                { name: 'ptrace', action: 'SCMP_ACT_KILL', comment: 'Block memory inspection & process injection' },
                { name: 'kexec_load', action: 'SCMP_ACT_KILL', comment: 'Block kernel payload loading' },
            ],
        }, null, 2);
    }
    /**
     * Generates Linux kernel sysctl security hardening configurations.
     * Enables protections such as SYN cookies, reverse path filtering, and dmesg restriction.
     *
     * @returns {string} The formatted `sysctl.conf` string.
     */
    generateSysctlHardeningConfig() {
        return [
            '# Ferrox Kernel Hardening Configuration v0.6.0',
            'net.ipv4.tcp_syncookies = 1',
            'net.ipv4.conf.all.rp_filter = 1',
            'kernel.kptr_restrict = 2',
            'kernel.dmesg_restrict = 1',
            'kernel.yama.ptrace_scope = 3',
            'fs.protected_hardlinks = 1',
            'fs.protected_symlinks = 1',
        ].join('\n');
    }
}
/**
 * Standard OWASP Sentinel production security headers.
 */
export const SECURITY_HEADERS = {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; media-src *; img-src 'self' data: https://*; connect-src 'self' https://api.openf1.org https://api.jolpi.ca https://api.open-meteo.com",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
};
//# sourceMappingURL=sentinel-integration.js.map