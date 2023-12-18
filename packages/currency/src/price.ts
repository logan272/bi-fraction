import type { BigIntIsh, NumericString } from '@currencybase/fraction';
import { Fraction } from '@currencybase/fraction';
import type BignumberJs from 'bignumber.js';
import invariant from 'tiny-invariant';

import { Amount } from './amount';
import type { Currency } from './currency';

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
export class Price<
  TBase extends Currency = Currency,
  TQuote extends Currency = Currency,
> {
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
  public readonly value: Fraction;

  /**
   * The scalar value used for conversions.
   */
  public readonly scalar: Fraction;

  /**
   * Creates a Price instance by parsing a numeric string.
   * @param baseAmount The base currency amount.
   * @param quoteAmount The quote currency amount.
   * @param value - The decimal string to parse.
   * @returns A Price instance representing the parsed decimals string.
   * @throws If the string can not be parsed to a number
   */
  public static parse<TBase extends Currency, TQuote extends Currency>(
    baseCurrency: TBase,
    quoteCurrency: TQuote,
    value: NumericString,
  ): Price {
    const fraction = Fraction.parse(value);
    return Price.from(
      baseCurrency,
      quoteCurrency,
      fraction.denominator,
      fraction.numerator,
    );
  }

  public static from<TBase extends Currency, TQuote extends Currency>(
    baseCurrency: TBase,
    quoteCurrency: TQuote,
    denominator: BigIntIsh,
    numerator: BigIntIsh = 1,
  ): Price<TBase, TQuote> {
    return new Price(
      Amount.from(baseCurrency, denominator),
      Amount.from(quoteCurrency, numerator),
    );
  }

  /**
   * Constructs a new Price instance.
   *
   * @param baseAmount The base currency amount.
   * @param quoteAmount The quote currency amount.
   */
  public constructor(baseAmount: Amount<TBase>, quoteAmount: Amount<TQuote>) {
    const result = quoteAmount.value.div(baseAmount.value);
    this.value = new Fraction(result.numerator, result.denominator);
    this.baseCurrency = baseAmount.currency;
    this.quoteCurrency = quoteAmount.currency;
    this.scalar = new Fraction(
      this.baseCurrency.decimalScale,
      this.quoteCurrency.decimalScale,
    );
  }

  /**
   * Checks if the Price is zero.
   * @returns True if the fraction is zero, false otherwise.
   */
  public isZero(): boolean {
    return this.value.isZero();
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
    return this.value.eq(other.value);
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
      this.value.numerator,
      this.value.denominator,
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
    const fraction = this.value.mul(other.value);
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
   * @param amount The amount of base currency to quote against the price.
   * @returns A new amount instance representing the quoted amount of quote currency.
   * @throws 'TOKEN' if the currency amount's currency does not match this price's base currency.
   */
  public quote(amount: Amount<TBase>): Amount<TQuote> {
    invariant(amount.currency.eq(this.baseCurrency), 'TOKEN');
    const result = amount.value.mul(this.value);
    return new Amount(this.quoteCurrency, result);
  }

  /**
   * Gets the value scaled by decimals for formatting.
   *
   * @returns The adjusted Fraction value.
   */
  public adjustForDecimals(): Fraction {
    return this.value.mul(this.scalar);
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
    return this.adjustForDecimals().toFixed(decimalPlaces, rounding);
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
    return this.adjustForDecimals().toFormat(
      decimalPlaces,
      roundingMode,
      format,
    );
  }
}
