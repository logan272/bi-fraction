import { Fraction } from './fraction';
import { Percent } from './percent';

describe('Percent', () => {
  describe('from', () => {
    it('should create a Percent instance from a fraction', () => {
      const fraction = new Fraction(1n, 4n);
      const percent = Percent.from(fraction);

      expect(percent.numerator).toBe(1n);
      expect(percent.denominator).toBe(4n);
      expect(percent.isPercent).toBe(true);
    });
  });

  describe('toFixed', () => {
    it('should convert the Percent to a fixed-point decimal string representation', () => {
      const percent = new Percent(1n, 2n);
      const result = percent.toFixed(2);

      expect(result).toBe('50.00');
    });
  });

  describe('toFormat', () => {
    it('should convert the Percent to a formatted string representation', () => {
      const percent1 = new Percent(1n, 2n);
      const result1 = percent1.toFormat(2);
      expect(result1).toBe('50.00');

      const percent2 = new Percent(100n, 2n);
      const result2 = percent2.toFormat(2);

      expect(result2).toBe('5,000.00');
    });
  });
});
