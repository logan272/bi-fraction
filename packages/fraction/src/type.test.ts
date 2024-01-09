import { isValidBigIntIsh } from './types';

describe('isValidBigIntIsh', () => {
  it('should return true for a valid BigInt string', () => {
    expect(isValidBigIntIsh('1234567890')).toBe(true);
    expect(isValidBigIntIsh('-9876543210')).toBe(true);
  });

  it('should return true for a valid BigInt number', () => {
    expect(isValidBigIntIsh(1234567890)).toBe(true);
    expect(isValidBigIntIsh(-9876543210)).toBe(true);
  });

  it('should return true for a valid BigInt', () => {
    expect(isValidBigIntIsh(BigInt('1234567890'))).toBe(true);
    expect(isValidBigIntIsh(BigInt('-9876543210'))).toBe(true);
  });

  it('should return false for an invalid BigIntIsh value', () => {
    expect(isValidBigIntIsh('123abc')).toBe(false);
    expect(isValidBigIntIsh('12.34')).toBe(false);
    expect(isValidBigIntIsh('abc')).toBe(false);
    expect(isValidBigIntIsh(NaN)).toBe(false);
  });
});
