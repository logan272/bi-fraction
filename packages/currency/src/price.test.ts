import { Fraction } from '@currencybase/fraction';

import { CurrencyAmount } from './currencyAmount';
import { btc, eth, usdc } from './mockTokens';
import { Price } from './price';

describe('Price', () => {
  // 2_000 ETH/USDC (2_000 USDC per ETH)
  const priceEth2Usdc = Price.from(eth, usdc, 1n, 2_000n);
  // 1/2_000 USDC/ETH (1/2_000 ETH per USDC)
  const priceUsdc2Eth = Price.from(usdc, eth, 2_000n);
  // 40_000 BTC/USDC (4_0000 USDC per BTC)
  const priceBtc2Usdc = Price.from(btc, usdc, 1n, 4_0000n);
  // 1/40_000 USDC/BTC (1/4_0000 BTC per USDC)
  const priceUsdc2Btc = Price.from(usdc, btc, 40_000n);
  // 1/20 ETH/BTC (1/20 ETH per BTC)
  const priceEth2Btc = Price.from(eth, btc, 20n);
  // 1/20 ETH/BTC (1/20 ETH per BTC)
  const priceBtc2Eth = Price.from(btc, eth, 1n, 20n);

  describe('constructor', () => {
    it('should create a new Price instance with base and quote currency amounts', () => {
      expect(priceEth2Usdc.baseCurrency).toBe(eth);
      expect(priceEth2Usdc.quoteCurrency).toBe(usdc);
      expect(priceEth2Usdc.fraction.eq(new Fraction(2_000n))).toBe(true);

      expect(priceBtc2Usdc.baseCurrency).toBe(btc);
      expect(priceBtc2Usdc.quoteCurrency).toBe(usdc);
      expect(priceBtc2Usdc.fraction.eq(new Fraction(40_000n))).toBe(true);
    });

    it('should create a new Price instance with base and quote currency amounts from an object', () => {
      const price = new Price(
        CurrencyAmount.from(eth, 1n),
        CurrencyAmount.from(usdc, 2_000n),
      );
      expect(price.baseCurrency).toBe(eth);
      expect(price.quoteCurrency).toBe(usdc);
      expect(price.fraction.eq(new Fraction(2_000n))).toBe(true);
    });
  });

  describe('invert', () => {
    it('should return a new Price instance with flipped currencies', () => {
      const invertedPrice = priceEth2Usdc.invert();
      expect(invertedPrice.baseCurrency).toBe(usdc);
      expect(invertedPrice.quoteCurrency).toBe(eth);
      expect(invertedPrice.eq(Price.from(usdc, eth, 2_000n))).toBe(true);
    });
  });

  describe('mul', () => {
    it('should not to throw for valid prices multiplications', () => {
      // priceEth2Usdc can only multiplied with USDC/xxx
      // priceEth2Usdc can not multiple with priceEth2Usdc.invert()
      expect(() => priceEth2Usdc.mul(priceUsdc2Btc)).not.toThrow('TOKEN');
    });

    it('should throw errors for invalid prices multiplications', () => {
      // priceEth2Usdc can only multiplied with USDC/OTHER
      // priceEth2Usdc can not multiple with priceEth2Usdc.invert()
      expect(() => priceEth2Usdc.mul(priceUsdc2Eth)).toThrow('TOKEN');
      expect(() => priceEth2Usdc.mul(priceEth2Usdc)).toThrow('TOKEN');
      expect(() => priceEth2Usdc.mul(priceEth2Usdc)).toThrow('TOKEN');
      expect(() => priceEth2Usdc.mul(priceBtc2Usdc)).toThrow('TOKEN');
      expect(() => priceEth2Usdc.mul(priceEth2Btc)).toThrow('TOKEN');
      expect(() => priceEth2Usdc.mul(priceBtc2Eth)).toThrow('TOKEN');
    });

    it('should return a new Price instance with multiplied prices', () => {
      const multipliedPrice = priceEth2Usdc.mul(priceUsdc2Btc);
      expect(multipliedPrice.baseCurrency).toBe(eth);
      expect(multipliedPrice.quoteCurrency).toBe(btc);
      expect(multipliedPrice.eq(priceEth2Btc)).toBe(true);
    });
  });

  describe('quote', () => {
    it('should return the corresponding amount of quote currency for a given base currency amount', () => {
      const ethAmount = CurrencyAmount.from(eth, 10n * eth.decimalScale);
      const quotedAmount = priceEth2Usdc.quote(ethAmount);
      expect(quotedAmount.currency).toBe(usdc);
      expect(
        quotedAmount.eq(
          CurrencyAmount.from(usdc, 10n * 2_000n * usdc.decimalScale),
        ),
      ).toBe(true);
    });

    it('should throw an if for invalid quote', () => {
      // can only quote currency amount of eth
      expect(() => priceEth2Usdc.quote(CurrencyAmount.from(usdc, 1n))).toThrow(
        'TOKEN',
      );
      expect(() => priceEth2Usdc.quote(CurrencyAmount.from(btc, 1n))).toThrow(
        'TOKEN',
      );
    });
  });

  describe('toFixed', () => {
    it('should return the price as a fixed-point decimal string with the specified decimal places', () => {
      const decimalString = priceEth2Usdc.toFixed(2);
      expect(decimalString).toBe('2000.00');
    });

    it('should return the price as a fixed-point decimal string with the default decimal places', () => {
      const decimalString = priceEth2Usdc.toFixed();
      expect(decimalString).toBe('2000.0000');
    });
  });
});
