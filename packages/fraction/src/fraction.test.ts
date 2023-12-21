/* eslint-disable max-lines */
import { Fraction } from './fraction';

describe('Fraction', () => {
  describe('parse', () => {
    it('should parse zero edge cases correctly', () => {
      const f1 = Fraction.parse('0');
      expect(f1.numerator).toBe(0n);
      expect(f1.denominator).toBe(1n);
      expect(f1.isZero()).toBe(true);

      const f2 = Fraction.parse('000');
      expect(f2.numerator).toBe(0n);
      expect(f2.denominator).toBe(1n);
      expect(f2.isZero()).toBe(true);

      const f3 = Fraction.parse('0.000');
      expect(f3.numerator).toBe(0n);
      expect(f3.denominator).toBe(1n);
      expect(f3.isZero()).toBe(true);

      const f4 = Fraction.parse('000.000');
      expect(f4.numerator).toBe(0n);
      expect(f4.denominator).toBe(1n);
      expect(f4.isZero()).toBe(true);
    });

    it('should parse a valid numeric string correctly', () => {
      const f1 = Fraction.parse('1.25');
      expect(f1.numerator).toBe(5n);
      expect(f1.denominator).toBe(4n);

      const f2 = Fraction.parse('1.33');
      expect(f2.numerator).toBe(133n);
      expect(f2.denominator).toBe(100n);

      const f3 = Fraction.parse('100.330');
      expect(f3.numerator).toBe(10033n);
      expect(f3.denominator).toBe(100n);
    });

    it('should parse a decimal with trailing zeros correctly', () => {
      const f1 = Fraction.parse('1.25000');
      expect(f1.numerator).toBe(5n);
      expect(f1.denominator).toBe(4n);

      const f2 = Fraction.parse('1.33000');
      expect(f2.numerator).toBe(133n);
      expect(f2.denominator).toBe(100n);

      const f3 = Fraction.parse('1.33000000000000000');
      expect(f3.numerator).toBe(133n);
      expect(f3.denominator).toBe(100n);
    });

    it('should throw when parsing an invalid numeric string', () => {
      expect(() => Fraction.parse('1n')).toThrow();
      expect(() => Fraction.parse('123n')).toThrow();
      expect(() => Fraction.parse('1e3')).toThrow();
      expect(() => Fraction.parse('1e6')).toThrow();
      expect(() => Fraction.parse('10e10')).toThrow();
      expect(() => Fraction.parse('3e+24')).toThrow();
      expect(() => Fraction.parse('25_000')).toThrow();
      expect(() => Fraction.parse('25,000')).toThrow();
      expect(() => Fraction.parse('2.5,000')).toThrow();
      expect(() => Fraction.parse('2.5.000')).toThrow();
      expect(() => Fraction.parse('$2.5000')).toThrow();
      expect(() => Fraction.parse('2.5000 USD')).toThrow();
      expect(() => Fraction.parse('3.0000000000000005e+21')).toThrow();
      expect(() => Fraction.parse('random invalid numeric string')).toThrow();
    });
  });

  describe('constructor', () => {
    it('should parse zero edge cases correctly', () => {
      const f1 = new Fraction(0, 100);
      expect(f1.numerator).toBe(0n);
      expect(f1.denominator).toBe(100n);
      expect(f1.isZero()).toBe(true);

      const f2 = new Fraction(1000, 0);
      expect(f2.numerator).toBe(0n);
      expect(f2.denominator).toBe(0n);
      expect(f2.isZero()).toBe(true);

      const f3 = new Fraction('0', 1);
      expect(f3.numerator).toBe(0n);
      expect(f3.denominator).toBe(1n);
      expect(f3.isZero()).toBe(true);
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

    it('should throw if passing invalid string `numerator` or `denominator` value', () => {
      expect(() => new Fraction('invalid numeric string')).toThrow();
      expect(() => new Fraction('1.1')).toThrow();
      expect(() => new Fraction('1.000000001')).toThrow();
      expect(() => new Fraction('2.5000')).toThrow();
      expect(() => new Fraction('2.5000 USD')).toThrow();
      expect(() => new Fraction('$2.5000')).toThrow();
      expect(() => new Fraction('25,000')).toThrow();
      expect(() => new Fraction('2.5,000')).toThrow();
      expect(() => new Fraction('2.5.000')).toThrow();
      expect(() => new Fraction('25_000')).toThrow();
      expect(() => new Fraction('1n')).toThrow();
      expect(() => new Fraction('123n')).toThrow();

      expect(() => new Fraction(0, 'invalid numeric string')).toThrow();
      expect(() => new Fraction(1, '1.1')).toThrow();
      expect(() => new Fraction(2, '1.000000001')).toThrow();
      expect(() => new Fraction(3, '2.5000')).toThrow();
      expect(() => new Fraction(4, '2.5000 USD')).toThrow();
      expect(() => new Fraction(5, '$2.5000')).toThrow();
      expect(() => new Fraction(6, '25,000')).toThrow();
      expect(() => new Fraction(7, '2.5,000')).toThrow();
      expect(() => new Fraction(8, '2.5.000')).toThrow();
      expect(() => new Fraction(9, '25_000')).toThrow();
      expect(() => new Fraction(10, '1n')).toThrow();
      expect(() => new Fraction(11, '123n')).toThrow();
    });

    it('should throw if passing decimal `numerator` or `denominator` value', () => {
      expect(() => new Fraction(1.1)).toThrow();
      expect(() => new Fraction(1.000000001)).toThrow();
      expect(() => new Fraction(2.5)).toThrow();
      expect(() => new Fraction(0.1 + 0.2)).toThrow();
      expect(() => new Fraction(100.1)).toThrow();

      expect(() => new Fraction(1, 1.1)).toThrow();
      expect(() => new Fraction(2, 1.000000001)).toThrow();
      expect(() => new Fraction(3, 2.5)).toThrow();
      expect(() => new Fraction(4, 0.1 + 0.2)).toThrow();
      expect(() => new Fraction(5, 100.1)).toThrow();
    });

    it('should throw if both `numerator` or `denominator` are invalid', () => {
      expect(() => new Fraction('1.1', 1.1)).toThrow();
      expect(() => new Fraction('21.12', 1.000000001)).toThrow();
      expect(() => new Fraction('321.123', 2.5)).toThrow();
      expect(() => new Fraction('4321.1234', 0.1 + 0.2)).toThrow();
      expect(() => new Fraction('54321.12345', 100.1)).toThrow();
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
      const f1 = new Fraction(10, 0);
      const f2 = new Fraction(0, 2);
      const f3 = new Fraction(10, 0);
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
  });

  describe('div', () => {
    it('should divide two fractions correctly', () => {
      const f1 = new Fraction(3n, 4n);
      const f2 = new Fraction(2n, 3n);
      const result = f1.div(f2);
      expect(result.numerator).toBe(9n);
      expect(result.denominator).toBe(8n);
    });

    it('should divide a fraction by an integer correctly', () => {
      const f1 = new Fraction(3n, 4n);
      const result = f1.div(2);
      expect(result.numerator).toBe(3n);
      expect(result.denominator).toBe(8n);
    });
  });
});
