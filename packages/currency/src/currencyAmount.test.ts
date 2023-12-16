import { Fraction } from '@web3-kit/fraction';

import { CurrencyAmount } from './currencyAmount';
import { Token } from './token';

describe('CurrencyAmount', () => {
  const token1 = new Token(1, '0x123', 18, 'TOKEN1');
  const token2 = new Token(1, '0x456', 18, 'TOKEN2');

  describe('constructor', () => {
    it('should create a CurrencyAmount instance with the provided values', () => {
      const numerator = 100n * 10n ** 18n;
      const denominator = 1n;
      const amount = new CurrencyAmount(token1, numerator, denominator);

      expect(amount.currency).toBe(token1);
      expect(amount.numerator).toBe(numerator);
      expect(amount.denominator).toBe(denominator);
      expect(amount.decimalScale).toBe(10n ** BigInt(token1.decimals));
    });

    it('should throw an error if the quotient exceeds MaxUint256', () => {
      const numerator = 2n ** 256n;
      const denominator = 1n;

      expect(() => {
        new CurrencyAmount(token1, numerator, denominator);
      }).toThrow('AMOUNT');
    });
  });

  describe('add', () => {
    it('should add another CurrencyAmount of the same currency', () => {
      const numerator1 = 100n * 10n ** 18n;
      const numerator2 = 50n * 10n ** 18n;
      const amount1 = new CurrencyAmount(token1, numerator1, 1n);
      const amount2 = new CurrencyAmount(token1, numerator2, 1n);
      const result = amount1.add(amount2);

      expect(result.currency).toBe(token1);
      expect(result.numerator).toBe(numerator1 + numerator2);
      expect(result.denominator).toBe(1n);
    });

    it('should throw an error if the CurrencyAmounts have different currencies', () => {
      const amount1 = new CurrencyAmount(token1, 100n, 1n);
      const amount2 = new CurrencyAmount(token2, 50n, 1n);

      expect(() => {
        amount1.add(amount2);
      }).toThrow('CURRENCY');
    });
  });

  describe('sub', () => {
    it('should subtract another CurrencyAmount of the same currency', () => {
      const amount1 = new CurrencyAmount(token1, 100n, 1n);
      const amount2 = new CurrencyAmount(token1, 50n, 1n);
      const result = amount1.sub(amount2);

      expect(result.currency).toBe(token1);
      expect(result.numerator).toBe(50n);
      expect(result.denominator).toBe(1n);
    });

    it('should throw an error if the CurrencyAmounts have different currencies', () => {
      const amount1 = new CurrencyAmount(token1, 100n, 1n);
      const amount2 = new CurrencyAmount(token2, 50n, 1n);

      expect(() => {
        amount1.sub(amount2);
      }).toThrow('CURRENCY');
    });
  });

  describe('mul', () => {
    it('should multiply the CurrencyAmount by a Fraction', () => {
      const amount = new CurrencyAmount(token1, 100n, 1n);
      const fraction = new Fraction(3n, 4n);
      const result = amount.mul(fraction);

      expect(result.currency).toBe(token1);
      expect(result.numerator).toBe(75n);
      expect(result.denominator).toBe(1n);
    });

    it('should multiply the CurrencyAmount by a BigIntIsh value', () => {
      const amount = new CurrencyAmount(token1, 100n, 1n);
      const value = 2n;
      const result = amount.mul(value);

      expect(result.currency).toBe(token1);
      expect(result.numerator).toBe(200n);
      expect(result.denominator).toBe(1n);
    });
  });

  describe('div', () => {
    it('should divide the CurrencyAmount by a Fraction', () => {
      const amount = new CurrencyAmount(token1, 100n, 1n);
      const fraction = new Fraction(1n, 2n);
      const result = amount.div(fraction);

      expect(result.currency).toBe(token1);
      expect(result.numerator).toBe(200n);
      expect(result.denominator).toBe(1n);
    });

    it('should divide the CurrencyAmount by a BigIntIsh value', () => {
      const amount = new CurrencyAmount(token1, 100n, 1n);
      const value = 2n;
      const result = amount.div(value);

      expect(result.currency).toBe(token1);
      expect(result.numerator).toBe(50n);
      expect(result.denominator).toBe(1n);
    });
  });

  describe('toFixed', () => {
    it('should convert the CurrencyAmount to a fixed-point decimal string representation', () => {
      const amount = new CurrencyAmount(token1, 100n * 10n ** 18n, 1n);

      expect(amount.toFixed(2)).toBe('100.00');
      expect(amount.mul(100).toFixed(3)).toBe('10000.000');
    });

    it('should throw an error if the specified decimal places exceed the currency decimals', () => {
      const amount = new CurrencyAmount(token1, 100n, 1n);

      expect(() => {
        amount.toFixed(20);
      }).toThrow('DECIMALS');
    });
  });

  describe('toFormat', () => {
    it('should convert the CurrencyAmount to a formatted string representation', () => {
      const amount = new CurrencyAmount(token1, 100n * 10n ** 18n, 1n);

      expect(amount.toFormat(2)).toBe('100.00');
      expect(amount.mul(100).toFormat(2)).toBe('10,000.00');
    });

    it('should throw an error if the specified decimal places exceed the currency decimals', () => {
      const amount = new CurrencyAmount(token1, 100n, 1n);

      expect(() => {
        amount.toFormat(20);
      }).toThrow('DECIMALS');
    });
  });
  // Add test cases for the remaining methods (sub, mul, div, toFixed, toFormat)
});
