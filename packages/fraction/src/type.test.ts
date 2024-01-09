import { isValidBigIntIsh, isValidIntString } from './types';

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

  describe('isValidIntString', () => {
    it('should return true for zero strings', () => {
      expect(isValidIntString('0')).toBe(true);
      expect(isValidIntString('00000')).toBe(true);
      expect(isValidIntString('0.0')).toBe(true);
      expect(isValidIntString('0.000000')).toBe(true);
      expect(isValidIntString('00000.000000')).toBe(true);
    });

    it('should return true for integer string', () => {
      expect(isValidIntString('123')).toBe(true);
      expect(isValidIntString('-1')).toBe(true);
      expect(isValidIntString('-123')).toBe(true);
    });

    it('should return false for decimal string', () => {
      expect(isValidIntString('1.23')).toBe(false);
      expect(isValidIntString('0.1')).toBe(false);
      expect(isValidIntString('-1.1')).toBe(false);
      expect(isValidIntString('-1.23')).toBe(false);
      expect(
        isValidIntString('0.00000000000000000000000000000000000000000001'),
      ).toBe(false);
    });
  });
});
