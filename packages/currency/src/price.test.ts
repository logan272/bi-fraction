import { Fraction } from '@currencybase/fraction';

import { CurrencyAmount } from './currencyAmount';
import { Price } from './price';
import { Token } from './token';

describe('Price', () => {
  const baseCurrency = new Token(1, '0x123', 18, 'TOKEN1');
  const quoteCurrency = new Token(1, '0x456', 18, 'TOKEN2');
  const anotherCurrency = new Token(1, '0x789', 18, 'TOKEN3');
  const baseAmount = new CurrencyAmount(baseCurrency, 100n);
  const quoteAmount = new CurrencyAmount(quoteCurrency, 200n);

  const price = new Price(baseCurrency, quoteCurrency, 2n, 1n);

  describe('constructor', () => {
    it('should create a new Price instance with base and quote currency amounts', () => {
      expect(price.baseCurrency).toBe(baseCurrency);
      expect(price.quoteCurrency).toBe(quoteCurrency);
      expect(price.numerator).toBe(1n);
      expect(price.denominator).toBe(2n);
    });

    it('should create a new Price instance with base and quote currency amounts from an object', () => {
      const price = new Price({ baseAmount, quoteAmount });
      expect(price.baseCurrency).toBe(baseCurrency);
      expect(price.quoteCurrency).toBe(quoteCurrency);
      expect(price.numerator).toBe(2n);
      expect(price.denominator).toBe(1n);
    });
  });

  describe('invert', () => {
    it('should return a new Price instance with flipped currencies', () => {
      const invertedPrice = price.invert();
      expect(invertedPrice.baseCurrency).toBe(quoteCurrency);
      expect(invertedPrice.quoteCurrency).toBe(baseCurrency);
      expect(invertedPrice.numerator).toBe(2n);
      expect(invertedPrice.denominator).toBe(1n);
    });
  });

  describe('mul', () => {
    it('should return a new Price instance with multiplied prices', () => {
      const otherPrice = new Price(quoteCurrency, anotherCurrency, 3n, 1n);
      const multipliedPrice = price.mul(otherPrice);
      expect(multipliedPrice.baseCurrency).toBe(baseCurrency);
      expect(multipliedPrice.quoteCurrency).toBe(otherPrice.quoteCurrency);
      expect(multipliedPrice.numerator).toBe(1n);
      expect(multipliedPrice.denominator).toBe(6n);
    });

    it('should throw an error if the other price has a different base currency', () => {
      const otherPrice = new Price(anotherCurrency, quoteCurrency, 3n, 1n);
      expect(() => price.mul(otherPrice)).toThrow('TOKEN');
    });

    it('should throw an error if the other price has a same quote currency as this.baseCurrency', () => {
      const otherPrice = new Price(quoteCurrency, baseCurrency, 3n, 1n);
      expect(() => price.mul(otherPrice)).toThrow('TOKEN');
    });
  });

  describe('quote', () => {
    it('should return the corresponding amount of quote currency for a given base currency amount', () => {
      const quotedAmount = price.quote(baseAmount);
      expect(quotedAmount.currency).toBe(quoteCurrency);
      expect(quotedAmount.fraction.eq(new Fraction(50n, 1))).toBe(true);
    });

    it('should throw an error if the currency amount has a different currency', () => {
      const otherCurrencyAmount = new CurrencyAmount(
        new Token(1, '0x789', 18, 'TOKEN3'),
        100n,
      );
      expect(() => price.quote(otherCurrencyAmount)).toThrow('TOKEN');
    });
  });

  describe('toFixed', () => {
    it('should return the price as a fixed-point decimal string with the specified decimal places', () => {
      const decimalString = price.toFixed(2);
      expect(decimalString).toBe('0.50');
    });

    it('should return the price as a fixed-point decimal string with the default decimal places', () => {
      const decimalString = price.toFixed();
      expect(decimalString).toBe('0.5000');
    });
  });
});
