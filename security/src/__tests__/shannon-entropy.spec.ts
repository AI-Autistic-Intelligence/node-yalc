import {
  ShannonEntropyEngine,
  calculateShannonEntropy,
} from '../sentinel-integration';

describe('ShannonEntropyEngine', () => {
  it('calculates zero entropy for empty strings', () => {
    expect(calculateShannonEntropy('')).toBe(0);
    expect(new ShannonEntropyEngine().calculate('')).toBe(0);
    expect(ShannonEntropyEngine.calculate('')).toBe(0);
  });

  it('calculates low entropy for repetitive text', () => {
    const repetitive = 'aaaaaaa';
    const entropy = calculateShannonEntropy(repetitive);
    expect(entropy).toBe(0);
  });

  it('calculates expected entropy for natural language and detects high entropy anomalies', () => {
    const normal = 'Monza Formula 1 Italian Grand Prix 2024';
    const engine = new ShannonEntropyEngine(4.8);
    const normalEntropy = engine.calculate(normal);
    expect(normalEntropy).toBeGreaterThan(3.0);
    expect(normalEntropy).toBeLessThan(4.8);
    expect(engine.isSuspicious(normal)).toBe(false);

    // Random/encrypted base64 or shellcode has high entropy
    const highEntropy = 'q9Z%kP!7*vLm#0z@1W$xR^8yB&2C*eE(4T)6U_';
    expect(engine.calculate(highEntropy)).toBeGreaterThan(4.8);
    expect(engine.isSuspicious(highEntropy)).toBe(true);
  });
});
