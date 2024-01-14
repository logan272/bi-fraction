/* eslint-disable max-lines */
import { Fraction, RoundingMode } from './fraction';

describe('Fraction', () => {
  describe('Getting Started', () => {
    it('should pass', () => {
      expect(0.1 + 0.2 === 0.3).toBe(false);
      expect(new Fraction(0.1).add(0.2).eq(0.3)).toBe(true);

      const a = new Fraction('0.1');
      const b = new Fraction('0.3');
      const c = a.div(b);
      const d = new Fraction(1, 3);

      expect(c.eq(d)).toBe(true);
      expect(c.numerator === d.numerator).toBe(true);
      expect(c.denominator === d.denominator).toBe(true);

      const x = new Fraction('1234.5');
      const y = new Fraction(1234.5);

      expect(x.eq(y)).toBe(true);
      expect(x.toFixed(0)).toBe('1235');
      expect(x.toFixed(0, { roundingMode: RoundingMode.ROUND_DOWN })).toBe(
        '1234',
      );
      expect(x.toFixed(2)).toBe('1234.50');
      expect(y.toFixed(2)).toBe('1234.50');
      expect(y.toFixed(3)).toBe('1234.500');

      const z = x.mul(y); // 1523990.25

      expect(z.toFixed(0)).toBe('1523990');
      expect(z.toFixed(1)).toBe('1523990.3');
      expect(z.toFixed(2)).toBe('1523990.25');
      expect(z.toFixed(3)).toBe('1523990.250');

      expect(z.toSignificant(4)).toBe('1524000');
      expect(z.toSignificant(4, RoundingMode.ROUND_DOWN)).toBe('1523000');
      expect(z.toSignificant(9)).toBe('1523990.25');
      expect(z.toSignificant(18)).toBe('1523990.25');
      expect(z.toSignificant(100)).toBe('1523990.25');

      expect(z.toFormat({ decimalPlaces: 0 })).toBe('1,523,990');
      expect(z.toFormat({ decimalPlaces: 0, format: { groupSize: 4 } })).toBe(
        '152,3990',
      );
      expect(
        z.toFormat({ decimalPlaces: 0, format: { groupSeparator: '_' } }),
      ).toBe('1_523_990');
      const bigNumber = new Fraction(
        '10000000000000000000000000000000001.0000000001',
      );
      const bigInteger = new Fraction(1_000_000_000n);
      bigNumber
        .mul(bigInteger)
        .eq(new Fraction(100000000000000000000000000000000010000000001n)); // true
    });
  });

  describe('parse', () => {
    it('should parse empty string correctly', () => {
      const f = new Fraction('');
      expect(f.isZero()).toBe(true);
    });

    it('should parse string that only contains empty spaces', () => {
      expect(new Fraction(' ').isZero()).toBe(true);
      expect(new Fraction('  ').isZero()).toBe(true);
      expect(new Fraction('        ').isZero()).toBe(true);
    });

    it('should parse zero edge cases correctly', () => {
      const f1 = new Fraction('0');
      expect(f1.numerator).toBe(0n);
      expect(f1.denominator).toBe(1n);
      expect(f1.isZero()).toBe(true);

      const f2 = new Fraction('000');
      expect(f2.numerator).toBe(0n);
      expect(f2.denominator).toBe(1n);
      expect(f2.isZero()).toBe(true);

      const f3 = new Fraction('0.000');
      expect(f3.numerator).toBe(0n);
      expect(f3.denominator).toBe(1n);
      expect(f3.isZero()).toBe(true);

      const f4 = new Fraction('000.000');
      expect(f4.numerator).toBe(0n);
      expect(f4.denominator).toBe(1n);
      expect(f4.isZero()).toBe(true);

      const f5 = new Fraction('-0.123');
      expect(f5.numerator).toBe(-123n);
      expect(f5.denominator).toBe(1000n);
      expect(f5.isZero()).toBe(false);
      expect(f5.lt(0n)).toBe(true);
    });

    it('should parse a valid numeric string correctly', () => {
      const f1 = new Fraction('1.25');
      expect(f1.numerator).toBe(5n);
      expect(f1.denominator).toBe(4n);

      const f2 = new Fraction('1.33');
      expect(f2.numerator).toBe(133n);
      expect(f2.denominator).toBe(100n);

      const f3 = new Fraction('100.330');
      expect(f3.numerator).toBe(10033n);
      expect(f3.denominator).toBe(100n);

      const f4 = new Fraction('100.0');
      expect(f4.numerator).toBe(100n);
      expect(f4.denominator).toBe(1n);

      const f5 = new Fraction('100.0000');
      expect(f5.numerator).toBe(100n);
      expect(f5.denominator).toBe(1n);
    });

    it('should parse a decimal with trailing zeros correctly', () => {
      const f1 = new Fraction('1.25000');
      expect(f1.numerator).toBe(5n);
      expect(f1.denominator).toBe(4n);

      const f2 = new Fraction('1.33000');
      expect(f2.numerator).toBe(133n);
      expect(f2.denominator).toBe(100n);

      const f3 = new Fraction('1.33000000000000000');
      expect(f3.numerator).toBe(133n);
      expect(f3.denominator).toBe(100n);
    });

    it('should be able to parse scientific notation of integers as expected', () => {
      expect(new Fraction('1e3').eq(1e3)).toBe(true);
      expect(new Fraction('-1e3').eq(-1e3)).toBe(true);
      expect(new Fraction('1e6').eq(1e6)).toBe(true);
      expect(new Fraction('1e10').eq(1e10)).toBe(true);

      // Number.MAX_SAFE_INTEGER: 9007199254740991
      // 1e15 < Number.MAX_SAFE_INTEGER < 1e16

      // not eq cause 3e24 loses precision at runtime
      expect(new Fraction('3e+24').eq(3e24)).toBe(false);
      expect(new Fraction('3e+24').eq(new Fraction('3e+24'))).toBe(true);
      expect(
        // not eq cause 3.0000000000000005e21 loses precision at runtime
        new Fraction('3.0000000000000005e+21').eq(3.0000000000000005e21),
      ).toBe(false);

      // it will lose precision at runtime
      // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
      expect(9007199254740992 === 9007199254740993).toBe(true);

      expect(
        // it won't cause precision loss with strings
        new Fraction('9007199254740992').eq(new Fraction('9007199254740993')),
      ).toBe(false);

      expect(
        // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
        new Fraction(9007199254740992).eq(new Fraction(9007199254740993)),
      ).toBe(true);
    });

    it('should be able to parse scientific notation of decimals as expected', () => {
      expect(new Fraction(0.0000001).toFixed(7)).toBe('0.0000001');
      expect(new Fraction('0.0000001').eq(new Fraction(0.0000001))).toBe(true);
      expect(new Fraction('0.0000001').eq(new Fraction('1e-7'))).toBe(true);
      expect(new Fraction('0.000000101').eq(new Fraction('1.01e-7'))).toBe(
        true,
      );

      expect(
        new Fraction('1.000_000_101'.replace(/_/g, '')).eq(1.000_000_101),
      ).toBe(true);

      expect(
        new Fraction('1_000_000.000_000_101'.replace(/_/g, '')).eq(
          1_000_000.000_000_101,
        ),
      ).toBe(true);

      // not equal cause precision loss at runtime
      expect(
        new Fraction('100_000_000.000_000_101'.replace(/_/g, '')).eq(
          // This number literal will lose precision at runtime
          // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
          100_000_000.000_000_101,
        ),
      ).toBe(false);

      // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
      expect(100_000_000.000_000_101 === 100_000_000.000_000_102).toBe(true);

      // equal cause precision loss at runtime
      expect(
        // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
        new Fraction(100_000_000.000_000_101).eq(100_000_000.000_000_102),
      ).toBe(true);

      // it won't cause precision loss with strings
      expect(
        new Fraction('100_000_000.000_000_101'.replace(/_/g, '')).eq(
          '100_000_000.000_000_102'.replace(/_/g, ''),
        ),
      ).toBe(false);
    });

    it('should throw when parsing an invalid numeric string', () => {
      expect(() => new Fraction('1n')).toThrow();
      expect(() => new Fraction('123n')).toThrow();
      expect(() => new Fraction('25_000')).toThrow();
      expect(() => new Fraction('25,000')).toThrow();
      expect(() => new Fraction('2.5,000')).toThrow();
      expect(() => new Fraction('2.5.000')).toThrow();
      expect(() => new Fraction('$2.5000')).toThrow();
      expect(() => new Fraction('2.5000 USD')).toThrow();
      expect(() => new Fraction('random invalid numeric string')).toThrow();
    });
  });

  describe('constructor', () => {
    it('should parse zero edge cases correctly', () => {
      const f1 = new Fraction(0, 100);
      expect(f1.numerator).toBe(0n);
      expect(f1.denominator).toBe(1n);
      expect(f1.isZero()).toBe(true);

      const f3 = new Fraction('0', 1);
      expect(f3.numerator).toBe(0n);
      expect(f3.denominator).toBe(1n);
      expect(f3.isZero()).toBe(true);
    });

    it(`should throw 'Division by zero' error if denominator is zero`, () => {
      expect(() => new Fraction(1, 0)).toThrow();
      expect(() => new Fraction(1, 0.0)).toThrow();
      expect(() => new Fraction(1, 0n)).toThrow();
      expect(() => new Fraction(1, '0')).toThrow();
      expect(() => new Fraction(1, '000')).toThrow();
      expect(() => new Fraction(1, '0.0')).toThrow();
      expect(() => new Fraction(1, '000.000')).toThrow();
    });

    it('should create a Fraction correctly with integers', () => {
      const f1 = new Fraction(1, 1);
      expect(f1.numerator).toBe(1n);
      expect(f1.denominator).toBe(1n);

      const f2 = new Fraction(3, 2);
      expect(f2.numerator).toBe(3n);
      expect(f2.denominator).toBe(2n);

      const f3 = new Fraction(133, 100);
      expect(f3.numerator).toBe(133n);
      expect(f3.denominator).toBe(100n);
    });

    it('should create a Fraction correctly with a valid integer-ish strings', () => {
      const f1 = new Fraction('2', '1');
      expect(f1.numerator).toBe(2n);
      expect(f1.denominator).toBe(1n);

      const f2 = new Fraction('3', '2');
      expect(f2.numerator).toBe(3n);
      expect(f2.denominator).toBe(2n);

      const f3 = new Fraction('133', '100');
      expect(f3.numerator).toBe(133n);
      expect(f3.denominator).toBe(100n);
    });

    it('should create a Fraction correctly with BigInt', () => {
      const f1 = new Fraction(2n, 1n);
      expect(f1.numerator).toBe(2n);
      expect(f1.denominator).toBe(1n);

      const f2 = new Fraction(3n, 2n);
      expect(f2.numerator).toBe(3n);
      expect(f2.denominator).toBe(2n);

      const f3 = new Fraction(133n, 100n);
      expect(f3.numerator).toBe(133n);
      expect(f3.denominator).toBe(100n);
    });

    it('should create a Fraction without passing the `denominator`', () => {
      const f1 = new Fraction(2n);
      expect(f1.numerator).toBe(2n);
      expect(f1.denominator).toBe(1n);

      const f2 = new Fraction(3n);
      expect(f2.numerator).toBe(3n);
      expect(f2.denominator).toBe(1n);

      const f3 = new Fraction(133n);
      expect(f3.numerator).toBe(133n);
      expect(f3.denominator).toBe(1n);

      const f5 = new Fraction(123);
      expect(f5.numerator).toBe(123n);
      expect(f5.denominator).toBe(1n);

      const f4 = new Fraction('123');
      expect(f4.numerator).toBe(123n);
      expect(f4.denominator).toBe(1n);
    });

    it('should be able create new Fraction from valid decimal string correctly', () => {
      expect(new Fraction('1.1').eq(new Fraction(11, 10))).toBe(true);
      expect(
        new Fraction('1.000000001').eq(new Fraction(1000000001, 1000000000)),
      ).toBe(true);
      expect(new Fraction('2.5000').eq(new Fraction(25, 10))).toBe(true);
      expect(new Fraction('100.1').eq(new Fraction(1001, 10))).toBe(true);
      expect(new Fraction(1, '1.1').eq(new Fraction(10, 11))).toBe(true);
      expect(
        new Fraction(2, '1.000000001').eq(new Fraction(2000000000, 1000000001)),
      ).toBe(true);
      expect(new Fraction(3, '2.5').eq(new Fraction(30, 25))).toBe(true);
      expect(new Fraction(5, '100.1').eq(new Fraction(50, 1001))).toBe(true);

      expect(new Fraction('1.1', 1.1).eq(new Fraction(1))).toBe(true);
      expect(
        new Fraction('21.12', '1.000000001').eq(
          new Fraction(21120000000, 1000000001),
        ),
      ).toBe(true);
      expect(new Fraction('321.123', 2.5).eq(new Fraction(321123, 2500))).toBe(
        true,
      );
      expect(
        new Fraction('54321.12345', 100.1).eq(
          new Fraction(5432112345, 10010000),
        ),
      ).toBe(true);
    });

    it('should be able create new Fraction from valid decimal number correctly', () => {
      expect(new Fraction(1.1).eq(new Fraction(11, 10))).toBe(true);
      expect(
        new Fraction(1.000000001).eq(new Fraction(1000000001, 1000000000)),
      ).toBe(true);
      expect(new Fraction(2.5).eq(new Fraction(25, 10))).toBe(true);
      expect(new Fraction(100.1).eq(new Fraction(1001, 10))).toBe(true);
      expect(new Fraction(1, 1.1).eq(new Fraction(10, 11))).toBe(true);
      expect(
        new Fraction(2, 1.000000001).eq(new Fraction(2000000000, 1000000001)),
      ).toBe(true);
      expect(new Fraction(3, 2.5).eq(new Fraction(30, 25))).toBe(true);
      expect(new Fraction(5, 100.1).eq(new Fraction(50, 1001))).toBe(true);
    });

    it('should throw if passing invalid string `numerator` or `denominator` value', () => {
      expect(() => new Fraction('invalid numeric string')).toThrow();
      expect(() => new Fraction('2.5000 USD')).toThrow();
      expect(() => new Fraction('$2.5000')).toThrow();
      expect(() => new Fraction('25,000')).toThrow();
      expect(() => new Fraction('2.5,000')).toThrow();
      expect(() => new Fraction('2.5.000')).toThrow();
      expect(() => new Fraction('25_000')).toThrow();
      expect(() => new Fraction('1n')).toThrow();
      expect(() => new Fraction('123n')).toThrow();
      expect(() => new Fraction(10, '1n')).toThrow();
      expect(() => new Fraction(11, '123n')).toThrow();
    });
  });

  describe('should apply gcd to numerator and denominator correctly', () => {
    it('should return the correct quotient', () => {
      const f1 = new Fraction(2, 2);
      expect(f1.numerator).toBe(1n);
      expect(f1.denominator).toBe(1n);

      const f2 = new Fraction(3, 9);
      expect(f2.numerator).toBe(1n);
      expect(f2.denominator).toBe(3n);

      const f3 = new Fraction(9, 3);
      expect(f3.numerator).toBe(3n);
      expect(f3.denominator).toBe(1n);

      const f4 = new Fraction(-3, 9);
      expect(f4.numerator).toBe(-1n);
      expect(f4.denominator).toBe(3n);

      const f5 = new Fraction(3, -9);
      expect(f5.numerator).toBe(1n);
      expect(f5.denominator).toBe(-3n);

      const f6 = new Fraction(123n * 10n ** 18n, 10n ** 18n);
      expect(f6.numerator).toBe(123n);
      expect(f6.denominator).toBe(1n);
    });
  });

  describe('quotient', () => {
    it('should return the correct quotient', () => {
      const f1 = new Fraction(5n, 2n);
      expect(f1.quotient).toBe(2n);

      const f2 = new Fraction(5n, 3n);
      expect(f2.quotient).toBe(1n);

      const f3 = new Fraction(6n, 3n);
      expect(f3.quotient).toBe(2n);

      const f4 = new Fraction(2n, 3n);
      expect(f4.quotient).toBe(0n);

      const f5 = new Fraction(123n, 123n);
      expect(f5.quotient).toBe(1n);

      const f6 = new Fraction(123n, 124n);
      expect(f6.quotient).toBe(0n);
    });
  });

  describe('remainder', () => {
    it('should return the correct remainder', () => {
      const f1 = new Fraction(5n, 2n);
      expect(f1.remainder.numerator).toBe(1n);
      expect(f1.remainder.denominator).toBe(2n);

      const f2 = new Fraction(5n, 3n);
      expect(f2.remainder.numerator).toBe(2n);
      expect(f2.remainder.denominator).toBe(3n);

      const f3 = new Fraction(3, 6);
      expect(f3.remainder.numerator).toBe(1n);
      expect(f3.remainder.denominator).toBe(2n);

      const f4 = new Fraction(123n, 124n);
      expect(f4.remainder.numerator).toBe(123n);
      expect(f4.remainder.denominator).toBe(124n);

      const f5 = new Fraction('3.14');
      expect(f5.remainder.toFixed(2)).toBe('0.14');
      expect(f5.remainder.toFixed(4)).toBe('0.1400');
      expect(f5.remainder.toSignificant(2)).toBe('0.14');
      expect(f5.remainder.toSignificant(4)).toBe('0.14');
    });
  });

  describe('invert', () => {
    it('should return the inverted fraction', () => {
      const f1 = new Fraction(5, 2);
      const inverted1 = f1.invert();
      expect(inverted1.numerator).toBe(2n);
      expect(inverted1.denominator).toBe(5n);

      const f2 = new Fraction(5);
      const inverted2 = f2.invert();
      expect(inverted2.numerator).toBe(1n);
      expect(inverted2.denominator).toBe(5n);

      const f3 = new Fraction(3, 10);
      const inverted3 = f3.invert();
      expect(inverted3.numerator).toBe(10n);
      expect(inverted3.denominator).toBe(3n);
    });
  });

  describe('negate', () => {
    it('should negate the sign of Fractions', () => {
      const f1 = new Fraction(5, -2);
      expect(f1.negate().eq(new Fraction(5, 2))).toBe(true);

      const f2 = new Fraction(-5, -2);
      expect(f2.negate().eq(new Fraction(5, -2))).toBe(true);
      expect(f2.negate().eq(new Fraction(-5, 2))).toBe(true);

      const f3 = new Fraction(0);
      expect(f3.negate().isZero()).toBe(true);
    });
  });

  describe('abs', () => {
    it('should return absolute Fractions', () => {
      const f1 = new Fraction(5, -2);
      expect(f1.abs().eq(new Fraction(5, 2))).toBe(true);

      const f2 = new Fraction(-5, -2);
      expect(f2.abs().eq(new Fraction(5, 2))).toBe(true);
      expect(f2.abs().eq(new Fraction(-5, -2))).toBe(true);

      const f3 = new Fraction(0);
      expect(f3.abs().isZero()).toBe(true);
    });
  });

  describe('isZero', () => {
    it('should return true for a zero fraction', () => {
      const fraction1 = new Fraction(0n);
      expect(fraction1.isZero()).toBe(true);

      const fraction2 = new Fraction(0);
      expect(fraction2.isZero()).toBe(true);

      const fraction3 = new Fraction('0');
      expect(fraction3.isZero()).toBe(true);
    });

    it('should return false for a non-zero fraction', () => {
      const f1 = new Fraction(5, 2);
      expect(f1.isZero()).toBe(false);

      const f2 = new Fraction(5);
      expect(f2.isZero()).toBe(false);

      const f3 = new Fraction(3, 5);
      expect(f3.isZero()).toBe(false);
    });
  });

  describe('eq', () => {
    it('should handle zero edge cases correctly', () => {
      const f1 = new Fraction(0, 1);
      const f2 = new Fraction(0, 3);
      const f3 = new Fraction(0, 5);
      expect(f1.eq(f2)).toBe(true);
      expect(f1.eq(f3)).toBe(true);
      expect(f3.isZero()).toBe(true);
    });

    it('should return true for equal fractions', () => {
      const f1 = new Fraction(5n, 2n);
      const f2 = new Fraction(10n, 4n);
      expect(f1.eq(f2)).toBe(true);
    });

    it('should return false for unequal fractions', () => {
      const f1 = new Fraction(5n, 2n);
      const f2 = new Fraction(3n, 2n);
      expect(f1.eq(f2)).toBe(false);
    });

    it('should return true for equal fractions with different signs', () => {
      const f1 = new Fraction(5n, 2n);
      const f2 = new Fraction(-5n, -2n);
      expect(f1.eq(f2)).toBe(true);
    });

    it('should return false for unequal fractions with different signs', () => {
      const f1 = new Fraction(5n, 2n);
      const f2 = new Fraction(-5n, 2n);
      expect(f1.eq(f2)).toBe(false);
    });
  });

  describe('neq', () => {
    it('should return true for equal fractions', () => {
      const f1 = new Fraction(5n, 2n);
      const f2 = new Fraction(10n, 4n);
      expect(f1.neq(f2)).toBe(false);
    });

    it('should return false for unequal fractions', () => {
      const f1 = new Fraction(5n, 2n);
      const f2 = new Fraction(3n, 2n);
      expect(f1.neq(f2)).toBe(true);
    });

    it('should return true for equal fractions with different signs', () => {
      const f1 = new Fraction(5n, 2n);
      const f2 = new Fraction(-5n, -2n);
      expect(f1.neq(f2)).toBe(false);
    });

    it('should return false for unequal fractions with different signs', () => {
      const f1 = new Fraction(5n, 2n);
      const f2 = new Fraction(-5n, 2n);
      expect(f1.neq(f2)).toBe(true);
    });
  });

  describe('lt', () => {
    it('zero edge cases', () => {
      expect(new Fraction(0n).lt(new Fraction(0n))).toBe(false);
      expect(new Fraction(0n).lt(new Fraction(1n))).toBe(true);
      expect(new Fraction(1n).lt(new Fraction(0n))).toBe(false);
    });

    it('should return true if the fraction is less than the other fraction', () => {
      const f1 = new Fraction(1n, 2n);
      const f2 = new Fraction(3n, 4n);
      expect(f1.lt(f2)).toBe(true);
    });

    it('should return false if the fraction is equal to the other fraction', () => {
      const f1 = new Fraction(1n, 2n);
      const f2 = new Fraction(1n, 2n);
      expect(f1.lt(f2)).toBe(false);
    });

    it('should return false if the fraction is greater than the other fraction', () => {
      const f1 = new Fraction(1n, 2n);
      const f2 = new Fraction(1n, 4n);
      expect(f1.lt(f2)).toBe(false);
    });
  });

  describe('lte', () => {
    it('zero edge cases', () => {
      expect(new Fraction(0n).lte(new Fraction(0n))).toBe(true);
      expect(new Fraction(0n).lte(new Fraction(1n))).toBe(true);
      expect(new Fraction(1n).lte(new Fraction(0n))).toBe(false);
    });

    it('should return true if the fraction is less than or equal to the other fraction', () => {
      const f1 = new Fraction(1n, 2n);
      const f2 = new Fraction(3n, 4n);
      expect(f1.lte(f2)).toBe(true);
    });

    it('should return true if the fraction is equal to the other fraction', () => {
      const f1 = new Fraction(1n, 2n);
      const f2 = new Fraction(1n, 2n);
      expect(f1.lte(f2)).toBe(true);
    });

    it('should return false if the fraction is greater than the other fraction', () => {
      const f1 = new Fraction(1n, 2n);
      const f2 = new Fraction(1n, 4n);
      expect(f1.lte(f2)).toBe(false);
    });
  });

  describe('gt', () => {
    it('zero edge cases', () => {
      expect(new Fraction(0n).gt(new Fraction(0n))).toBe(false);
      expect(new Fraction(1n).gt(new Fraction(0n))).toBe(true);
      expect(new Fraction(0n).gt(new Fraction(1n))).toBe(false);
    });

    it('should return true if the fraction is greater than the other fraction', () => {
      const f1 = new Fraction(1n, 2n);
      const f2 = new Fraction(1n, 4n);
      expect(f1.gt(f2)).toBe(true);
    });

    it('should return false if the fraction is equal to the other fraction', () => {
      const f1 = new Fraction(1n, 2n);
      const f2 = new Fraction(1n, 2n);
      expect(f1.gt(f2)).toBe(false);
    });

    it('should return false if the fraction is less than the other fraction', () => {
      const f1 = new Fraction(1n, 2n);
      const f2 = new Fraction(3n, 4n);
      expect(f1.gt(f2)).toBe(false);
    });
  });

  describe('gte', () => {
    it('zero edge cases', () => {
      expect(new Fraction(0n).gte(new Fraction(0n))).toBe(true);
      expect(new Fraction(1n).gte(new Fraction(0n))).toBe(true);
      expect(new Fraction(0n).gte(new Fraction(1n))).toBe(false);
    });

    it('should return true if the fraction is greater than or equal to the other fraction', () => {
      const f1 = new Fraction(1n, 2n);
      const f2 = new Fraction(1n, 4n);
      expect(f1.gte(f2)).toBe(true);
    });

    it('should return true if the fraction is equal to the other fraction', () => {
      const fraction1 = new Fraction(1n, 2n);
      const fraction2 = new Fraction(1n, 2n);
      expect(fraction1.gte(fraction2)).toBe(true);
    });

    it('should return false if the fraction is less than the other fraction', () => {
      const f1 = new Fraction(1n, 2n);
      const f2 = new Fraction(3n, 4n);
      expect(f1.gte(f2)).toBe(false);
    });
  });

  describe('add', () => {
    it('should add two fractions correctly', () => {
      const f1 = new Fraction(1n, 2n);
      const fraction2 = new Fraction(3n, 4n);
      const result = f1.add(fraction2);
      expect(result.numerator).toBe(5n);
      expect(result.denominator).toBe(4n);
    });

    it('should add a fraction and an integer correctly', () => {
      const f1 = new Fraction(1n, 2n);
      const result = f1.add(3);
      expect(result.numerator).toBe(7n);
      expect(result.denominator).toBe(2n);
    });
  });

  describe('sub', () => {
    it('should add two fractions correctly', () => {
      const f1 = new Fraction(2n);
      const result = f1.sub(f1);
      expect(result.numerator).toBe(0n);
      expect(result.denominator).toBe(1n);
    });

    it('should subtract two fractions correctly', () => {
      const f1 = new Fraction(3n, 4n);
      const f2 = new Fraction(1n, 2n);
      const result = f1.sub(f2);
      expect(result.numerator).toBe(1n);
      expect(result.denominator).toBe(4n);
    });

    it('should subtract an integer from a fraction correctly', () => {
      const f1 = new Fraction(3n, 4n);
      const result = f1.sub(1);
      expect(result.numerator).toBe(-1n);
      expect(result.denominator).toBe(4n);
    });
  });

  describe('mul', () => {
    it('should multiply two fractions correctly', () => {
      const f1 = new Fraction(2n, 3n);
      const f2 = new Fraction(3n, 4n);
      const result = f1.mul(f2);
      expect(result.numerator).toBe(1n);
      expect(result.denominator).toBe(2n);
    });

    it('should multiply a fraction and an integer correctly', () => {
      const f1 = new Fraction(2n, 3n);
      const result = f1.mul(3);
      expect(result.numerator).toBe(2n);
      expect(result.denominator).toBe(1n);
    });

    it('should return 0 when multiply zero', () => {
      const f1 = new Fraction(0).mul(0);
      expect(f1.isZero()).toBe(true);
      expect(f1.numerator).toBe(0n);
      expect(f1.denominator).toBe(1n);

      const f2 = new Fraction(100).mul(0);
      expect(f2.isZero()).toBe(true);
      expect(f2.numerator).toBe(0n);
      expect(f2.denominator).toBe(1n);

      const f3 = new Fraction(0).mul('123.4');
      expect(f3.isZero()).toBe(true);
      expect(f3.numerator).toBe(0n);
      expect(f3.denominator).toBe(1n);
    });
  });

  describe('div', () => {
    it('should divide two fractions correctly', () => {
      const f1 = new Fraction(3n, 4n);
      const f2 = new Fraction(2n, 3n);
      const result = f1.div(f2);
      expect(result.numerator).toBe(9n);
      expect(result.denominator).toBe(8n);
      expect(Fraction.ZERO.div(f1).isZero()).toBe(true);
      expect(Fraction.ZERO.div(f2).isZero()).toBe(true);
    });

    it('should divide a fraction by an integer correctly', () => {
      const f1 = new Fraction(3n, 4n);
      const result = f1.div(2);
      expect(result.numerator).toBe(3n);
      expect(result.denominator).toBe(8n);
    });

    it(`should throw 'Division by zero' error`, () => {
      expect(() => new Fraction(1).div(Fraction.ZERO)).toThrow();
      expect(() => new Fraction(1).div(0)).toThrow();
      expect(() => new Fraction(1).div(0n)).toThrow();
      expect(() => new Fraction(1).div('0')).toThrow();
      expect(() => new Fraction(1).div('000')).toThrow();
      expect(() => new Fraction(1).div('0.0')).toThrow();
      expect(() => new Fraction(1).div('0.000')).toThrow();
      expect(() => new Fraction(1).div('000.000')).toThrow();
    });
  });

  describe('toSignificant', () => {
    it('should convert to an string with the specified significant digits', () => {
      const f1 = new Fraction('12345.67890');
      expect(f1.toSignificant(12)).toBe('12345.6789');
      expect(f1.toSignificant(12)).toBe('12345.6789');
      expect(f1.toSignificant(9)).toBe('12345.6789');
      expect(f1.toSignificant(8, RoundingMode.ROUND_HALF_UP)).toBe('12345.679');
      expect(f1.toSignificant(8, RoundingMode.ROUND_FLOOR)).toBe('12345.678');
      expect(f1.toSignificant(5, RoundingMode.ROUND_FLOOR)).toBe('12345');
      expect(f1.toSignificant(2, RoundingMode.ROUND_FLOOR)).toBe('12000');
    });

    it('should throw if significantDigits <= 0', () => {
      const f1 = new Fraction(123);
      expect(() => f1.toSignificant(0)).toThrow();
      expect(() => f1.toSignificant(-100)).toThrow();
    });

    it('should convert to an string with the specified significant digits for very large/small number', () => {
      const large = '12345678901234567890';
      const f1 = new Fraction(large);
      expect(f1.toSignificant(12)).toBe(
        '123456789012'.padEnd(large.length, '0'),
      );
      expect(f1.toSignificant(10)).toBe('123456789'.padEnd(large.length, '0'));
      expect(f1.toSignificant(2)).toBe('12'.padEnd(large.length, '0'));

      const huge = '12345678901234567890123';
      const f2 = new Fraction(huge);
      expect(f2.toSignificant(12)).toBe('1.23456789012e+22');
      expect(f2.toSignificant(2)).toBe('1.2e+22');

      const small = '1.2345678901234567890';
      const f3 = new Fraction(small);
      expect(f3.toSignificant(20)).toBe('1.234567890123456789');
      expect(f3.toSignificant(12)).toBe('1.23456789012');
      expect(f3.toSignificant(12)).toBe('1.23456789012');
      expect(f3.toSignificant(2)).toBe('1.2');

      const withMoreThan21DecimalPlaces = '1.23456789012345678901234567890';
      const f4 = new Fraction(withMoreThan21DecimalPlaces);
      expect(f4.toSignificant(100)).toBe('1.23456789012345678901');
    });
  });

  describe('asFraction', () => {
    it('should pass', () => {
      const pi = new Fraction('3.14159');
      expect(pi.asFraction.numerator).toBe(pi.numerator);
      expect(pi.asFraction.denominator).toBe(pi.denominator);

      const e = new Fraction('2.71');
      expect(e.asFraction.numerator).toBe(e.numerator);
      expect(e.asFraction.denominator).toBe(e.denominator);
    });
  });
});
