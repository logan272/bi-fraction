import type { BigIntIsh } from '@currencybase/fraction';
import { Fraction } from '@currencybase/fraction';
import type BignumberJs from 'bignumber.js';
import invariant from 'tiny-invariant';

import type { Currency } from './currency';
import { CurrencyAmount } from './currencyAmount';

/**
 * Subclass of Fraction. Represents a price between two currencies.
 *
 * A currency pair is considered a price quote between two different currencies, where one is quoted against the other.
 *
 * `Base_Currency/Quote_currency`
 *
 * In the `ETH/USD` pair, `ETH` is the base currency, USD is the quote currency.
 * In the `USD/ETH` pair, `USD` is the base currency, ETH is the quote currency.
 *
 * When buying a currency pair, buyers purchase the base currency and sell the quoted currency.
 * The bid price represents the amount of quote currency needed to receive one unit of the base currency.
 *
 * On the other hand, when the currency pair is sold, the seller sells the base currency and receives the quote currency.
 * Thus, the selling price of the currency pair is the amount one will receive in the quote currency for providing one unit of the base currency.
 *
 */
export class Price<TBase extends Currency, TQuote extends Currency> {
  /**
   * The base currency of the price.
   */
  public readonly baseCurrency: TBase;

  /**
   * The quote currency of the price.
   */
  public readonly quoteCurrency: TQuote;

  /**
   * The underlining fraction value.
   */
  public readonly fraction: Fraction;

  /**
   * The scalar value used for conversions.
   */
  public readonly scalar: Fraction;

  public static from<TBase extends Currency, TQuote extends Currency>(
    baseCurrency: TBase,
    quoteCurrency: TQuote,
    denominator: BigIntIsh,
    numerator: BigIntIsh = 1,
  ): Price<TBase, TQuote> {
    return new Price(
      CurrencyAmount.from(baseCurrency, denominator),
      CurrencyAmount.from(quoteCurrency, numerator),
    );
  }

  /**
   * Constructs a new Price instance.
   *
   * @param baseAmount The base currency amount.
   * @param quoteAmount The quote currency amount.
   */
  public constructor(
    baseAmount: CurrencyAmount<TBase>,
    quoteAmount: CurrencyAmount<TQuote>,
  ) {
    const result = quoteAmount.fraction.div(baseAmount.fraction);
    this.fraction = new Fraction(result.numerator, result.denominator);
    this.baseCurrency = baseAmount.currency;
    this.quoteCurrency = quoteAmount.currency;
    this.scalar = new Fraction(
      this.baseCurrency.decimalScale,
      this.quoteCurrency.decimalScale,
    );
  }

  /**
   * Check if the current Price is equal to another Price.
   * @param other The Price to compare.
   * @returns True if the Prices are equal, false otherwise.
   * @throws 'CURRENCY' if the Prices have different currencies.
   */
  public eq(other: Price<TBase, TQuote>): boolean {
    invariant(this.baseCurrency.eq(other.baseCurrency), 'CURRENCY');
    invariant(this.quoteCurrency.eq(other.quoteCurrency), 'CURRENCY');
    return this.fraction.eq(other.fraction);
  }

  /**
   * Flips the price, switching the base and quote currencies.
   *
   * @returns A new Price instance with the flipped currencies.
   */
  public invert(): Price<TQuote, TBase> {
    return Price.from(
      this.quoteCurrency,
      this.baseCurrency,
      this.fraction.numerator,
      this.fraction.denominator,
    );
  }

  /**
   * Multiplies the price by another price, returning a new price.
   *
   *  The other price must have the same base currency as this price's quote currency.
   *
   * @param other The other price to multiply by.
   * @returns A new Price instance representing the product.
   * @throws 'TOKEN' if the other price's base currency does not match this price's quote currency.
   */
  public mul<TOtherQuote extends Currency>(
    other: Price<TQuote, TOtherQuote>,
  ): Price<TBase, TOtherQuote> {
    invariant(this.quoteCurrency.eq(other.baseCurrency), 'TOKEN');
    invariant(this.baseCurrency.neq(other.quoteCurrency), 'TOKEN');
    const fraction = this.fraction.mul(other.fraction);
    return Price.from(
      this.baseCurrency,
      other.quoteCurrency,
      fraction.denominator,
      fraction.numerator,
    );
  }

  /**
   * Returns the amount of quote currency corresponding to a given amount of the base currency.
   *
   * The quote method can be used to convert an amount of the base currency (TBase) to an equivalent amount in the quote currency (TQuote). This is useful when you need to calculate the value of a specific currency amount in a different currency.
   *
   * @param currencyAmount The amount of base currency to quote against the price.
   * @returns A new CurrencyAmount instance representing the quoted amount of quote currency.
   * @throws 'TOKEN' if the currency amount's currency does not match this price's base currency.
   */
  public quote(currencyAmount: CurrencyAmount<TBase>): CurrencyAmount<TQuote> {
    invariant(currencyAmount.currency.eq(this.baseCurrency), 'TOKEN');
    const result = currencyAmount.fraction.mul(this.fraction);
    return new CurrencyAmount(this.quoteCurrency, result);
  }

  /**
   * Gets the value scaled by decimals for formatting.
   *
   * @private
   * @returns The adjusted Fraction value.
   */
  private get adjustedForDecimals(): Fraction {
    return this.fraction.mul(this.scalar);
  }

  /**
   * Converts the Price to a fixed-point decimal string representation.
   *
   * @param decimalPlaces The number of decimal places to include in the string.
   * @param rounding The rounding mode to use.
   * @returns The fixed-point decimal string representation of the Price.
   */
  public toFixed(
    decimalPlaces = 4,
    rounding?: BignumberJs.RoundingMode,
  ): string {
    return this.adjustedForDecimals.toFixed(decimalPlaces, rounding);
  }

  /**
   * Converts the price to a formatted string representation.
   *
   * @param decimalPlaces The number of decimal places to include in the string.
   * @param roundingMode The rounding mode to use.
   * @param format The formatting options to apply.
   * @returns The formatted string representation of the Price.
   */
  public toFormat(
    decimalPlaces = 4,
    roundingMode?: BignumberJs.RoundingMode,
    format?: BignumberJs.Format,
  ): string {
    return this.adjustedForDecimals.toFormat(
      decimalPlaces,
      roundingMode,
      format,
    );
  }
}
