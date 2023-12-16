import type { BigIntIsh } from '@web3-kit/fraction';
import { Fraction } from '@web3-kit/fraction';
import type BignumberJs from 'bignumber.js';
import invariant from 'tiny-invariant';

import type { Currency } from './currency';
import { CurrencyAmount } from './currencyAmount';

export class Price<
  TBase extends Currency,
  TQuote extends Currency,
> extends Fraction {
  public readonly baseCurrency: TBase;
  public readonly quoteCurrency: TQuote;
  public readonly scalar: Fraction;

  /**
   * Construct a price, either with the base and quote currency amount, or the
   * @param args
   */
  public constructor(
    ...args:
      | [TBase, TQuote, BigIntIsh, BigIntIsh]
      | [
          {
            baseAmount: CurrencyAmount<TBase>;
            quoteAmount: CurrencyAmount<TQuote>;
          },
        ]
  ) {
    let baseCurrency: TBase;
    let quoteCurrency: TQuote;
    let denominator: BigIntIsh;
    let numerator: BigIntIsh;

    if (args.length === 4) {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      [baseCurrency, quoteCurrency, denominator, numerator] = args;
    } else {
      const result = args[0].quoteAmount.div(args[0].baseAmount);
      [baseCurrency, quoteCurrency, denominator, numerator] = [
        args[0].baseAmount.currency,
        args[0].quoteAmount.currency,
        result.denominator,
        result.numerator,
      ];
    }
    super(numerator, denominator);

    this.baseCurrency = baseCurrency;
    this.quoteCurrency = quoteCurrency;
    this.scalar = new Fraction(
      10n ** BigInt(baseCurrency.decimals),
      10n ** BigInt(quoteCurrency.decimals),
    );
  }

  /**
   * Flip the price, switching the base and quote currency
   */
  public override invert(): Price<TQuote, TBase> {
    return new Price(
      this.quoteCurrency,
      this.baseCurrency,
      this.numerator,
      this.denominator,
    );
  }

  /**
   * Multiply the price by another price, returning a new price. The other price must have the same base currency as this price's quote currency
   * @param other the other price
   */
  public override mul<TOtherQuote extends Currency>(
    other: Price<TQuote, TOtherQuote>,
  ): Price<TBase, TOtherQuote> {
    invariant(this.quoteCurrency.eq(other.baseCurrency), 'TOKEN');
    const fraction = super.mul(other);
    return new Price(
      this.baseCurrency,
      other.quoteCurrency,
      fraction.denominator,
      fraction.numerator,
    );
  }

  /**
   * Return the amount of quote currency corresponding to a given amount of the base currency
   * @param currencyAmount the amount of base currency to quote against the price
   */
  public quote(currencyAmount: CurrencyAmount<TBase>): CurrencyAmount<TQuote> {
    invariant(currencyAmount.currency.eq(this.baseCurrency), 'TOKEN');

    const result = super.mul(currencyAmount);
    return new CurrencyAmount(
      this.quoteCurrency,
      result.numerator,
      result.denominator,
    );
  }

  /**
   * Get the value scaled by decimals for formatting
   * @private
   */
  private get adjustedForDecimals(): Fraction {
    return super.mul(this.scalar);
  }

  public override toFixed(
    decimalPlaces = 4,
    rounding?: BignumberJs.RoundingMode,
  ): string {
    return this.adjustedForDecimals.toFixed(decimalPlaces, rounding);
  }
}
