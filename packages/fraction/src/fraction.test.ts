import { Fraction } from './fraction';

describe('Fraction', () => {
  describe('parse', () => {
    it('should parse a valid numeric string correctly', () => {
      const f1 = Fraction.parse('1.25');
      expect(f1.numerator).toBe(5n);
      expect(f1.denominator).toBe(4n);

      const f2 = Fraction.parse('1.33');
      expect(f2.numerator).toBe(133n);
      expect(f2.denominator).toBe(100n);
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
      expect(() => Fraction.parse('invalid numeric string')).toThrow();
      expect(() => Fraction.parse('2.5000 USD')).toThrow();
      expect(() => Fraction.parse('$2.5000')).toThrow();
      expect(() => Fraction.parse('25,000')).toThrow();
      expect(() => Fraction.parse('2.5,000')).toThrow();
      expect(() => Fraction.parse('2.5.000')).toThrow();
      expect(() => Fraction.parse('25_000')).toThrow();
      expect(() => Fraction.parse('1n')).toThrow();
      expect(() => Fraction.parse('123n')).toThrow();
    });
  });

  describe('constructor', () => {
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
      const fraction = new Fraction(5n, 2n);
      expect(fraction.remainder.numerator).toBe(1n);
      expect(fraction.remainder.denominator).toBe(2n);
    });
  });

  describe('invert', () => {
    it('should return the inverted fraction', () => {
      const fraction = new Fraction(5n, 2n);
      const inverted = fraction.invert();
      expect(inverted.numerator).toBe(2n);
      expect(inverted.denominator).toBe(5n);
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
      const fraction = new Fraction(5n, 2n);
      expect(fraction.isZero()).toBe(false);
    });
  });

  describe('eq', () => {
    it('should return true for equal fractions', () => {
      const fraction1 = new Fraction(5n, 2n);
      const fraction2 = new Fraction(10n, 4n);
      expect(fraction1.eq(fraction2)).toBe(true);
    });

    it('should return false for unequal fractions', () => {
      const fraction1 = new Fraction(5n, 2n);
      const fraction2 = new Fraction(3n, 2n);
      expect(fraction1.eq(fraction2)).toBe(false);
    });

    it('should return true for equal fractions with different signs', () => {
      const fraction1 = new Fraction(5n, 2n);
      const fraction2 = new Fraction(-5n, -2n);
      expect(fraction1.eq(fraction2)).toBe(true);
    });

    it('should return false for unequal fractions with different signs', () => {
      const fraction1 = new Fraction(5n, 2n);
      const fraction2 = new Fraction(-5n, 2n);
      expect(fraction1.eq(fraction2)).toBe(false);
    });
  });

  describe('neq', () => {
    it('should return true for equal fractions', () => {
      const fraction1 = new Fraction(5n, 2n);
      const fraction2 = new Fraction(10n, 4n);
      expect(fraction1.neq(fraction2)).toBe(false);
    });

    it('should return false for unequal fractions', () => {
      const fraction1 = new Fraction(5n, 2n);
      const fraction2 = new Fraction(3n, 2n);
      expect(fraction1.neq(fraction2)).toBe(true);
    });

    it('should return true for equal fractions with different signs', () => {
      const fraction1 = new Fraction(5n, 2n);
      const fraction2 = new Fraction(-5n, -2n);
      expect(fraction1.neq(fraction2)).toBe(false);
    });

    it('should return false for unequal fractions with different signs', () => {
      const fraction1 = new Fraction(5n, 2n);
      const fraction2 = new Fraction(-5n, 2n);
      expect(fraction1.neq(fraction2)).toBe(true);
    });
  });

  describe('add', () => {
    it('should add two fractions correctly', () => {
      const fraction1 = new Fraction(1n, 2n);
      const fraction2 = new Fraction(3n, 4n);
      const result = fraction1.add(fraction2);
      expect(result.numerator).toBe(5n);
      expect(result.denominator).toBe(4n);
    });

    it('should add a fraction and an integer correctly', () => {
      const fraction = new Fraction(1n, 2n);
      const result = fraction.add(3);
      expect(result.numerator).toBe(7n);
      expect(result.denominator).toBe(2n);
    });
  });

  describe('sub', () => {
    it('should subtract two fractions correctly', () => {
      const fraction1 = new Fraction(3n, 4n);
      const fraction2 = new Fraction(1n, 2n);
      const result = fraction1.sub(fraction2);
      expect(result.numerator).toBe(1n);
      expect(result.denominator).toBe(4n);
    });

    it('should subtract an integer from a fraction correctly', () => {
      const fraction = new Fraction(3n, 4n);
      const result = fraction.sub(1);
      expect(result.numerator).toBe(-1n);
      expect(result.denominator).toBe(4n);
    });
  });

  describe('mul', () => {
    it('should multiply two fractions correctly', () => {
      const fraction1 = new Fraction(2n, 3n);
      const fraction2 = new Fraction(3n, 4n);
      const result = fraction1.mul(fraction2);
      expect(result.numerator).toBe(1n);
      expect(result.denominator).toBe(2n);
    });

    it('should multiply a fraction and an integer correctly', () => {
      const fraction = new Fraction(2n, 3n);
      const result = fraction.mul(3);
      expect(result.numerator).toBe(2n);
      expect(result.denominator).toBe(1n);
    });
  });

  describe('div', () => {
    it('should divide two fractions correctly', () => {
      const fraction1 = new Fraction(3n, 4n);
      const fraction2 = new Fraction(2n, 3n);
      const result = fraction1.div(fraction2);
      expect(result.numerator).toBe(9n);
      expect(result.denominator).toBe(8n);
    });

    it('should divide a fraction by an integer correctly', () => {
      const fraction = new Fraction(3n, 4n);
      const result = fraction.div(2);
      expect(result.numerator).toBe(3n);
      expect(result.denominator).toBe(8n);
    });
  });
});
