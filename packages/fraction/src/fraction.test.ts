import { Fraction } from './fraction';

describe('Fraction', () => {
  describe('parse', () => {
    it('should parse an integer correctly', () => {
      const fraction = Fraction.parse(5);
      expect(fraction.numerator).toBe(5n);
      expect(fraction.denominator).toBe(1n);
    });

    it('should parse a decimal correctly', () => {
      const fraction = Fraction.parse('1.25');
      expect(fraction.numerator).toBe(5n);
      expect(fraction.denominator).toBe(4n);
    });

    it('should parse a decimal with trailing zeros correctly', () => {
      const fraction = Fraction.parse('2.5000');
      expect(fraction.numerator).toBe(5n);
      expect(fraction.denominator).toBe(2n);
    });

    it('should throw when parsing an invalid number string', () => {
      expect(() => Fraction.parse('2.5000abc')).toThrow();
    });
  });

  describe('should apply gcd correctly to numerator and denominator', () => {
    it('should return the correct quotient', () => {
      const fraction1 = new Fraction(3n, 9n);
      expect(fraction1.numerator).toBe(1n);
      expect(fraction1.denominator).toBe(3n);

      const fraction2 = new Fraction(-3n, 9n);
      expect(fraction2.numerator).toBe(-1n);
      expect(fraction2.denominator).toBe(3n);

      const fraction3 = new Fraction(3n, -9n);
      expect(fraction3.numerator).toBe(1n);
      expect(fraction3.denominator).toBe(-3n);

      const fraction4 = new Fraction(123n * 10n ** 18n, 10n ** 18n);
      expect(fraction4.numerator).toBe(123n);
      expect(fraction4.denominator).toBe(1n);
    });
  });

  describe('quotient', () => {
    it('should return the correct quotient', () => {
      const fraction = new Fraction(5n, 2n);
      expect(fraction.quotient).toBe(2n);
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
  // Add more test cases for other methods
});
