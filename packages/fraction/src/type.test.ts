import { isValidBigIntIsh, isValidBigNumberIsh } from './types';

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

  describe('isValidBigNumberIsh', () => {
    it('should return true for a valid BigNumberIsh string', () => {
      expect(isValidBigNumberIsh('1234567890')).toBe(true);
      expect(isValidBigNumberIsh('-9876543210')).toBe(true);
      expect(isValidBigNumberIsh('12.34')).toBe(true);
      expect(isValidBigNumberIsh('0.001')).toBe(true);
      expect(isValidBigNumberIsh('0')).toBe(true);
      expect(isValidBigNumberIsh('000000')).toBe(true);
      expect(isValidBigNumberIsh('000.000')).toBe(true);
      expect(isValidBigNumberIsh('')).toBe(true);
      expect(isValidBigNumberIsh('   ')).toBe(true);
    });

    it('should return true for a valid BigNumberIsh number', () => {
      expect(isValidBigNumberIsh(1234567890)).toBe(true);
      expect(isValidBigNumberIsh(-9876543210)).toBe(true);
      expect(isValidBigNumberIsh(12.34)).toBe(true);
      expect(isValidBigNumberIsh(0.001)).toBe(true);
      expect(isValidBigNumberIsh(0)).toBe(true);
    });

    it('should return true for a valid BigInt', () => {
      expect(isValidBigIntIsh(BigInt('1234567890'))).toBe(true);
      expect(isValidBigIntIsh(BigInt('-9876543210'))).toBe(true);
    });

    it('should return false for an invalid BigNumberIshIsh value', () => {
      expect(isValidBigNumberIsh('123abc')).toBe(false);
      expect(isValidBigNumberIsh('abc')).toBe(false);
      expect(isValidBigNumberIsh(NaN)).toBe(false);
    });
  });
});
