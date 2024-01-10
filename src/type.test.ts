import { isValidBigIntIsh, isValidNumberIsh } from './types';

describe('types', () => {
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

  describe('isValidNumberIsh', () => {
    it('should return true for a valid NumberIsh string', () => {
      expect(isValidNumberIsh('1234567890')).toBe(true);
      expect(isValidNumberIsh('-9876543210')).toBe(true);
      expect(isValidNumberIsh('12.34')).toBe(true);
      expect(isValidNumberIsh('0.001')).toBe(true);
      expect(isValidNumberIsh('0')).toBe(true);
      expect(isValidNumberIsh('000000')).toBe(true);
      expect(isValidNumberIsh('000.000')).toBe(true);
      expect(isValidNumberIsh('')).toBe(true);
      expect(isValidNumberIsh('   ')).toBe(true);
    });

    it('should return true for a valid NumberIsh number', () => {
      expect(isValidNumberIsh(1234567890)).toBe(true);
      expect(isValidNumberIsh(-9876543210)).toBe(true);
      expect(isValidNumberIsh(12.34)).toBe(true);
      expect(isValidNumberIsh(0.001)).toBe(true);
      expect(isValidNumberIsh(0)).toBe(true);
    });

    it('should return true for a valid BigInt', () => {
      expect(isValidBigIntIsh(BigInt('1234567890'))).toBe(true);
      expect(isValidBigIntIsh(BigInt('-9876543210'))).toBe(true);
    });

    it('should return false for an invalid NumberIshIsh value', () => {
      expect(isValidNumberIsh('123abc')).toBe(false);
      expect(isValidNumberIsh('abc')).toBe(false);
      expect(isValidNumberIsh(NaN)).toBe(false);
    });
  });
});
