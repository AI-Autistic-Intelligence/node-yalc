/**
 * The Kernel Sandbox Engine provides zero-trust security configuration generators
 * for hardening the underlying Linux OS or Docker container running the Ferrox Framework.
 * It prevents Remote Code Execution (RCE) from escalating into container breakouts.
 */
export class KernelSandboxEngine {
    /**
     * Generates a Linux Seccomp BPF (Berkeley Packet Filter) profile JSON.
     * This profile explicitly blocks dangerous syscalls like `execve` (shell execution) and `ptrace` (memory reading).
     *
     * @returns {string} The JSON stringified Seccomp profile (compatible with Docker/Kubernetes).
     */
    generateSeccompBpfPolicy() {
        const rules = [
            { name: 'read', action: 'SCMP_ACT_ALLOW' },
            { name: 'write', action: 'SCMP_ACT_ALLOW' },
            { name: 'epoll_wait', action: 'SCMP_ACT_ALLOW' },
            { name: 'accept4', action: 'SCMP_ACT_ALLOW' },
            { name: 'execve', action: 'SCMP_ACT_KILL', comment: 'Block zero-day command execution' },
            { name: 'ptrace', action: 'SCMP_ACT_KILL', comment: 'Block process memory inspection & injection' },
            { name: 'kexec_load', action: 'SCMP_ACT_KILL', comment: 'Block arbitrary kernel payload loading' },
            { name: 'init_module', action: 'SCMP_ACT_KILL', comment: 'Block unauthenticated kernel module loading' },
        ];
        return JSON.stringify({
            defaultAction: 'SCMP_ACT_ERRNO',
            architectures: ['SCMP_ARCH_X86_64', 'SCMP_ARCH_AARCH64'],
            syscalls: rules,
        }, null, 2);
    }
    /**
       * Generates a Linux Landlock LSM configuration.
       * Landlock allows unprivileged processes to create secure filesystem sandboxes dynamically.
       *
       * @param {LandlockPathRule[]} [paths=[]] Additional custom filesystem rules to append to the default strict sandbox.
       * @returns {string} The JSON stringified Landlock ruleset.
       */
    generateLandlockPolicy(paths = []) {
        const defaultPaths = [
            { path: '/app', allowedAccess: ['read', 'write'] },
            { path: '/tmp', allowedAccess: ['read', 'write'] },
            { path: '/etc', allowedAccess: ['read'] },
            { path: '/proc', allowedAccess: ['read'] },
            ...paths,
        ];
        return JSON.stringify({
            landlockAbiVersion: 3,
            handledAccessFs: ['READ_FILE', 'WRITE_FILE', 'EXECUTE'],
            rules: defaultPaths,
        }, null, 2);
    }
    /**
       * Generates a standard `/etc/sysctl.d/` configuration file.
       * Enables kernel-level protections against SYN floods, IP spoofing, symlink attacks, and restricts dmesg/ptrace access.
       *
       * @returns {string} The raw configuration file contents.
       */
    generateSysctlHardeningConfig() {
        return [
            '# ====================================================================',
            '# Ferrox Kernel Hardening Configuration v0.6.0',
            '# Academic Ref: Linux Kernel Security & Hardening Best Practices',
            '# ====================================================================',
            'net.ipv4.tcp_syncookies = 1',
            'net.ipv4.conf.all.rp_filter = 1',
            'net.ipv4.conf.default.rp_filter = 1',
            'net.ipv4.conf.all.accept_redirects = 0',
            'net.ipv6.conf.all.accept_redirects = 0',
            'kernel.kptr_restrict = 2',
            'kernel.dmesg_restrict = 1',
            'kernel.yama.ptrace_scope = 3',
            'fs.protected_hardlinks = 1',
            'fs.protected_symlinks = 1',
            'fs.protected_fifos = 2',
            'fs.protected_regular = 2',
        ].join('\n');
    }
}
//# sourceMappingURL=kernel-sandbox.js.map