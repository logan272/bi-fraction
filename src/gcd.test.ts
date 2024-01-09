import { gcd } from './gcd';

describe('gcd', () => {
  it('should return the GCD of two positive integers', () => {
    expect(gcd(12n, 18n)).toBe(6n);
    expect(gcd(25n, 35n)).toBe(5n);
    expect(gcd(64n, 48n)).toBe(16n);
  });

  it('should return the GCD of a positive integer and zero', () => {
    expect(gcd(12n, 0n)).toBe(12n);
    expect(gcd(0n, 18n)).toBe(18n);
    expect(gcd(0n, 0n)).toBe(0n);
  });

  it('should return the GCD of two negative integers', () => {
    expect(gcd(-12n, -18n)).toBe(6n);
    expect(gcd(-25n, -35n)).toBe(5n);
    expect(gcd(-64n, -48n)).toBe(16n);
  });

  it('should return the GCD of a positive and negative integer', () => {
    expect(gcd(12n, -18n)).toBe(6n);
    expect(gcd(25n, -35n)).toBe(5n);
    expect(gcd(64n, -48n)).toBe(16n);
  });

  it('should return the GCD of two big integers', () => {
    expect(gcd(100000000000000000000000n, 200000000000000000000000n)).toBe(
      100000000000000000000000n,
    );
    expect(gcd(123456789n, 987654321n)).toBe(9n);
    expect(gcd(12345678901234567890n, 98765432109876543210n)).toBe(
      900000000090n,
    );
  });
});
