import { Fraction } from '@currencybase/fraction';

import { CurrencyAmount } from './currencyAmount';
import { Price } from './price';
import { Token } from './token';

describe('Price', () => {
  const eth = new Token(1, '0x123', 18, 'ETH');
  const usdc = new Token(1, '0x456', 18, 'USDC');
  const btc = new Token(1, '0x789', 18, 'BTC');
  const ethAmount = CurrencyAmount.from(eth, 100n * eth.decimalScale);
  const usdcAmount = CurrencyAmount.from(usdc, 200n * eth.decimalScale);

  const priceEth2Usdc = Price.from(eth, usdc, 2n);

  describe('constructor', () => {
    it('should create a new Price instance with base and quote currency amounts', () => {
      expect(priceEth2Usdc.baseCurrency).toBe(eth);
      expect(priceEth2Usdc.quoteCurrency).toBe(usdc);
      expect(priceEth2Usdc.fraction.eq(new Fraction(1n, 2n))).toBe(true);
    });

    it('should create a new Price instance with base and quote currency amounts from an object', () => {
      const price = new Price(ethAmount, usdcAmount);
      expect(price.baseCurrency).toBe(eth);
      expect(price.quoteCurrency).toBe(usdc);
      expect(price.fraction.eq(new Fraction(200n, 100n))).toBe(true);
    });
  });

  describe('invert', () => {
    it('should return a new Price instance with flipped currencies', () => {
      const invertedPrice = priceEth2Usdc.invert();
      expect(invertedPrice.baseCurrency).toBe(usdc);
      expect(invertedPrice.quoteCurrency).toBe(eth);
      expect(invertedPrice.fraction.eq(new Fraction(2n))).toBe(true);
    });
  });

  describe('mul', () => {
    it('should return a new Price instance with multiplied prices', () => {
      const otherPrice = Price.from(usdc, btc, 3n);
      const multipliedPrice = priceEth2Usdc.mul(otherPrice);
      expect(multipliedPrice.baseCurrency).toBe(eth);
      expect(multipliedPrice.quoteCurrency).toBe(otherPrice.quoteCurrency);
      expect(
        multipliedPrice.fraction.eq(
          priceEth2Usdc.fraction.mul(otherPrice.fraction),
        ),
      ).toBe(true);
    });

    it('should throw an error if the other price has a different base currency', () => {
      const otherPrice = Price.from(btc, usdc, 3n);
      expect(() => priceEth2Usdc.mul(otherPrice)).toThrow('TOKEN');
    });

    it('should throw an error if the other price has a same quote currency as this.baseCurrency', () => {
      const otherPrice = Price.from(usdc, eth, 3n);
      expect(() => priceEth2Usdc.mul(otherPrice)).toThrow('TOKEN');
    });
  });

  describe('quote', () => {
    it('should return the corresponding amount of quote currency for a given base currency amount', () => {
      const quotedAmount = priceEth2Usdc.quote(ethAmount);
      expect(quotedAmount.currency).toBe(usdc);
      expect(
        quotedAmount.fraction.eq(
          new Fraction(50n * quotedAmount.currency.decimalScale, 1),
        ),
      ).toBe(true);
    });

    it('should throw an error if the currency amount has a different currency', () => {
      const otherCurrencyAmount = CurrencyAmount.from(
        new Token(1, '0x789', 18, 'TOKEN3'),
        100n,
      );
      expect(() => priceEth2Usdc.quote(otherCurrencyAmount)).toThrow('TOKEN');
    });
  });

  describe('toFixed', () => {
    it('should return the price as a fixed-point decimal string with the specified decimal places', () => {
      const decimalString = priceEth2Usdc.toFixed(2);
      expect(decimalString).toBe('0.50');
    });

    it('should return the price as a fixed-point decimal string with the default decimal places', () => {
      const decimalString = priceEth2Usdc.toFixed();
      expect(decimalString).toBe('0.5000');
    });
  });
});
