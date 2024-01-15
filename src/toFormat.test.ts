import { Fraction } from './fraction';

describe('Fraction.toFormat', () => {
  describe('basic', () => {
    it('should convert the fraction to a formatted string representation', () => {
      const f1 = new Fraction('123456789.12345');

      expect(f1.toFormat()).toBe('123,456,789');
      expect(f1.toFormat({ decimalPlaces: 1 })).toBe('123,456,789.1');
      expect(f1.toFormat({ decimalPlaces: 4 })).toBe('123,456,789.1235');
      expect(f1.toFormat({ decimalPlaces: 6 })).toBe('123,456,789.123450');
      expect(f1.toFormat({ decimalPlaces: 6, trailingZeros: false })).toBe(
        '123,456,789.12345',
      );

      expect(
        f1.toFormat({ decimalPlaces: 1, format: { decimalSeparator: '@' } }),
      ).toBe('123,456,789@1');

      expect(
        f1.toFormat({
          decimalPlaces: 1,
          format: { decimalSeparator: '@', groupSeparator: '-' },
        }),
      ).toBe('123-456-789@1');

      expect(
        f1.toFormat({
          decimalPlaces: 1,
          format: { groupSeparator: '_' },
        }),
      ).toBe('123_456_789.1');

      expect(
        f1.toFormat({
          decimalPlaces: 5,
          format: { groupSize: 4 },
        }),
      ).toBe('1,2345,6789.12345');
    });
  });
});
