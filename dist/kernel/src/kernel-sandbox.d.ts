/**
 * Represents a Linux Seccomp (Secure Computing) BPF rule.
 * Defines whether a specific system call should be allowed, killed, or return an error.
 */
export interface SeccompSyscallRule {
    /** The Linux syscall name (e.g., 'execve', 'ptrace'). */
    name: string;
    /** The action to take when the syscall is intercepted. */
    action: 'SCMP_ACT_ALLOW' | 'SCMP_ACT_KILL' | 'SCMP_ACT_ERRNO';
    /** Optional documentation for why the rule exists. */
    comment?: string;
}
/**
 * Represents a Linux Landlock LSM (Linux Security Module) filesystem rule.
 * Restricts access to specific paths within the container/VM.
 */
export interface LandlockPathRule {
    /** The absolute path on the filesystem (e.g., '/app', '/etc'). */
    path: string;
    /** Allowed access flags for the path. */
    allowedAccess: ('read' | 'write' | 'execute')[];
}
/**
 * The Kernel Sandbox Engine provides zero-trust security configuration generators
 * for hardening the underlying Linux OS or Docker container running the Ferrox Framework.
 * It prevents Remote Code Execution (RCE) from escalating into container breakouts.
 */
export declare class KernelSandboxEngine {
    /**
     * Generates a Linux Seccomp BPF (Berkeley Packet Filter) profile JSON.
     * This profile explicitly blocks dangerous syscalls like `execve` (shell execution) and `ptrace` (memory reading).
     *
     * @returns {string} The JSON stringified Seccomp profile (compatible with Docker/Kubernetes).
     */
    generateSeccompBpfPolicy(): string;
    /**
       * Generates a Linux Landlock LSM configuration.
       * Landlock allows unprivileged processes to create secure filesystem sandboxes dynamically.
       *
       * @param {LandlockPathRule[]} [paths=[]] Additional custom filesystem rules to append to the default strict sandbox.
       * @returns {string} The JSON stringified Landlock ruleset.
       */
    generateLandlockPolicy(paths?: LandlockPathRule[]): string;
    /**
       * Generates a standard `/etc/sysctl.d/` configuration file.
       * Enables kernel-level protections against SYN floods, IP spoofing, symlink attacks, and restricts dmesg/ptrace access.
       *
       * @returns {string} The raw configuration file contents.
       */
    generateSysctlHardeningConfig(): string;
}
