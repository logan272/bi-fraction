import { Fraction, RoundingMode } from './fraction';

describe('Rounding mode examples', () => {
  describe('RoundingMode.ROUND_UP', () => {
    const roundingMode = RoundingMode.ROUND_UP;

    it('should pass', () => {
      expect(new Fraction('3.1').toFixed(0, { roundingMode })).toBe('4');
      expect(new Fraction('-3.1').toFixed(0, { roundingMode })).toBe('-4');
      expect(new Fraction('3.8').toFixed(0, { roundingMode })).toBe('4');
      expect(new Fraction('-3.8').toFixed(0, { roundingMode })).toBe('-4');
    });
  });

  describe('RoundingMode.ROUND_DOWN', () => {
    const roundingMode = RoundingMode.ROUND_DOWN;

    it('should pass', () => {
      expect(new Fraction('3.1').toFixed(0, { roundingMode })).toBe('3');
      expect(new Fraction('-3.1').toFixed(0, { roundingMode })).toBe('-3');
      expect(new Fraction('3.8').toFixed(0, { roundingMode })).toBe('3');
      expect(new Fraction('-3.8').toFixed(0, { roundingMode })).toBe('-3');
    });
  });

  describe('RoundingMode.ROUND_CEIL', () => {
    const roundingMode = RoundingMode.ROUND_CEIL;

    it('should pass', () => {
      expect(new Fraction('3.1').toFixed(0, { roundingMode })).toBe('4');
      expect(new Fraction('-3.1').toFixed(0, { roundingMode })).toBe('-3');
      expect(new Fraction('3.8').toFixed(0, { roundingMode })).toBe('4');
      expect(new Fraction('-3.8').toFixed(0, { roundingMode })).toBe('-3');
    });
  });

  describe('RoundingMode.ROUND_FLOOR', () => {
    const roundingMode = RoundingMode.ROUND_FLOOR;

    it('should pass', () => {
      expect(new Fraction('3.1').toFixed(0, { roundingMode })).toBe('3');
      expect(new Fraction('-3.1').toFixed(0, { roundingMode })).toBe('-4');
      expect(new Fraction('3.8').toFixed(0, { roundingMode })).toBe('3');
      expect(new Fraction('-3.8').toFixed(0, { roundingMode })).toBe('-4');
    });
  });

  describe('RoundingMode.ROUND_HALF_UP', () => {
    const roundingMode = RoundingMode.ROUND_HALF_UP;

    it('should pass', () => {
      expect(new Fraction('3.1').toFixed(0, { roundingMode })).toBe('3');
      expect(new Fraction('-3.1').toFixed(0, { roundingMode })).toBe('-3');
      expect(new Fraction('3.5').toFixed(0, { roundingMode })).toBe('4');
      expect(new Fraction('-3.5').toFixed(0, { roundingMode })).toBe('-4');
      expect(new Fraction('3.8').toFixed(0, { roundingMode })).toBe('4');
      expect(new Fraction('-3.8').toFixed(0, { roundingMode })).toBe('-4');
    });
  });

  describe('RoundingMode.ROUND_HALF_DOWN', () => {
    const roundingMode = RoundingMode.ROUND_HALF_DOWN;

    it('should pass', () => {
      expect(new Fraction('3.1').toFixed(0, { roundingMode })).toBe('3');
      expect(new Fraction('-3.1').toFixed(0, { roundingMode })).toBe('-3');
      expect(new Fraction('3.5').toFixed(0, { roundingMode })).toBe('3');
      expect(new Fraction('-3.5').toFixed(0, { roundingMode })).toBe('-3');
      expect(new Fraction('3.8').toFixed(0, { roundingMode })).toBe('4');
      expect(new Fraction('-3.8').toFixed(0, { roundingMode })).toBe('-4');
    });
  });

  describe('RoundingMode.ROUND_HALF_EVEN', () => {
    const roundingMode = RoundingMode.ROUND_HALF_EVEN;

    it('should pass', () => {
      expect(new Fraction('3.1').toFixed(0, { roundingMode })).toBe('3');
      expect(new Fraction('-3.1').toFixed(0, { roundingMode })).toBe('-3');
      expect(new Fraction('3.5').toFixed(0, { roundingMode })).toBe('4');
      expect(new Fraction('-3.5').toFixed(0, { roundingMode })).toBe('-4');
      expect(new Fraction('2.5').toFixed(0, { roundingMode })).toBe('2');
      expect(new Fraction('-2.5').toFixed(0, { roundingMode })).toBe('-2');
      expect(new Fraction('3.8').toFixed(0, { roundingMode })).toBe('4');
      expect(new Fraction('-3.8').toFixed(0, { roundingMode })).toBe('-4');
    });
  });

  describe('RoundingMode.ROUND_HALF_CEIL', () => {
    const roundingMode = RoundingMode.ROUND_HALF_CEIL;

    it('should pass', () => {
      expect(new Fraction('3.1').toFixed(0, { roundingMode })).toBe('3');
      expect(new Fraction('-3.1').toFixed(0, { roundingMode })).toBe('-3');
      expect(new Fraction('3.5').toFixed(0, { roundingMode })).toBe('4');
      expect(new Fraction('-3.5').toFixed(0, { roundingMode })).toBe('-3');
      expect(new Fraction('3.8').toFixed(0, { roundingMode })).toBe('4');
      expect(new Fraction('-3.8').toFixed(0, { roundingMode })).toBe('-4');
    });
  });

  describe('RoundingMode.ROUND_HALF_FLOOR', () => {
    const roundingMode = RoundingMode.ROUND_HALF_FLOOR;

    it('should pass', () => {
      expect(new Fraction('3.1').toFixed(0, { roundingMode })).toBe('3');
      expect(new Fraction('-3.1').toFixed(0, { roundingMode })).toBe('-3');
      expect(new Fraction('3.5').toFixed(0, { roundingMode })).toBe('3');
      expect(new Fraction('-3.5').toFixed(0, { roundingMode })).toBe('-4');
      expect(new Fraction('3.8').toFixed(0, { roundingMode })).toBe('4');
      expect(new Fraction('-3.8').toFixed(0, { roundingMode })).toBe('-4');
    });
  });
});
