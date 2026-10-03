import { KernelSandboxEngine } from '../kernel-sandbox';

describe('KernelSandboxEngine', () => {
  let engine: KernelSandboxEngine;

  beforeEach(() => {
    engine = new KernelSandboxEngine();
  });

  it('should generate Seccomp BPF policy', () => {
    const policy = engine.generateSeccompBpfPolicy();
    expect(policy).toContain('SCMP_ACT_ERRNO');
    expect(policy).toContain('execve');
  });

  it('should generate Landlock policy with default paths', () => {
    const policy = engine.generateLandlockPolicy();
    expect(policy).toContain('/app');
  });

  it('should generate Landlock policy with custom paths', () => {
    const policy = engine.generateLandlockPolicy([{ path: '/custom', allowedAccess: ['read'] }]);
    expect(policy).toContain('/custom');
  });

  it('should generate sysctl hardening config', () => {
    const config = engine.generateSysctlHardeningConfig();
    expect(config).toContain('net.ipv4.tcp_syncookies = 1');
  });
});
