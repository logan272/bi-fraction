import type { BigIntIsh, NumericString } from '@fraction-asset/fraction';
import { Fraction } from '@fraction-asset/fraction';
import type BigNumberJs from 'bignumber.js';
import invariant from 'tiny-invariant';

import { Amount } from './amount';
import type { Asset } from './asset';

/**
 * Subclass of Fraction. Represents a price between two currencies.
 *
 * A asset pair is considered a price quote between two different currencies, where one is quoted against the other.
 *
 * `Base_asset/Quote_asset`
 *
 * In the `ETH/USD` pair, `ETH` is the base asset, USD is the quote asset.
 * In the `USD/ETH` pair, `USD` is the base asset, ETH is the quote asset.
 *
 * When buying a asset pair, buyers purchase the base asset and sell the quoted asset.
 * The bid price represents the amount of quote asset needed to receive one unit of the base asset.
 *
 * On the other hand, when the asset pair is sold, the seller sells the base asset and receives the quote asset.
 * Thus, the selling price of the asset pair is the amount one will receive in the quote asset for providing one unit of the base asset.
 *
 */
export class Price<TBase extends Asset = Asset, TQuote extends Asset = Asset> {
  /**
   * The base asset of the price.
   */
  public readonly baseAsset: TBase;

  /**
   * The quote asset of the price.
   */
  public readonly quoteAsset: TQuote;

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
   * @param baseAmount The base asset amount.
   * @param quoteAmount The quote asset amount.
   * @param value - The decimal string to parse.
   * @returns A Price instance representing the parsed decimals string.
   * @throws If the string can not be parsed to a number
   */
  public static parse<TBase extends Asset, TQuote extends Asset>(
    baseAsset: TBase,
    quoteAsset: TQuote,
    value: NumericString,
  ): Price {
    const fraction = Fraction.parse(value);
    return Price.from(
      baseAsset,
      quoteAsset,
      fraction.denominator,
      fraction.numerator,
    );
  }

  public static from<TBase extends Asset, TQuote extends Asset>(
    baseAsset: TBase,
    quoteAsset: TQuote,
    denominator: BigIntIsh,
    numerator: BigIntIsh = 1,
  ): Price<TBase, TQuote> {
    return new Price(
      Amount.from(baseAsset, denominator),
      Amount.from(quoteAsset, numerator),
    );
  }

  /**
   * Constructs a new Price instance.
   * @param baseAmount The base asset amount.
   * @param quoteAmount The quote asset amount.
   */
  public constructor(baseAmount: Amount<TBase>, quoteAmount: Amount<TQuote>) {
    const result = quoteAmount.value.div(baseAmount.value);
    this.value = new Fraction(result.numerator, result.denominator);
    this.baseAsset = baseAmount.asset;
    this.quoteAsset = quoteAmount.asset;
    this.scalar = new Fraction(
      this.baseAsset.decimalScale,
      this.quoteAsset.decimalScale,
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
   * Flips the price, switching the base and quote currencies.
   * @returns A new Price instance with the flipped currencies.
   */
  public invert(): Price<TQuote, TBase> {
    return Price.from(
      this.quoteAsset,
      this.baseAsset,
      this.value.numerator,
      this.value.denominator,
    );
  }

  /**
   * Multiplies the price by another price, returning a new price.
   *
   *  The other price must have the same base asset as this price's quote asset.
   *
   * @param other The other price to multiply by.
   * @returns A new Price instance representing the product.
   * @throws 'TOKEN' if the other price's base asset does not match this price's quote asset.
   */
  public mul<TOtherQuote extends Asset>(
    other: Price<TQuote, TOtherQuote>,
  ): Price<TBase, TOtherQuote> {
    invariant(this.quoteAsset.eq(other.baseAsset), 'TOKEN');
    invariant(this.baseAsset.neq(other.quoteAsset), 'TOKEN');
    const fraction = this.value.mul(other.value);
    return Price.from(
      this.baseAsset,
      other.quoteAsset,
      fraction.denominator,
      fraction.numerator,
    );
  }

  /**
   * Returns the amount of quote asset corresponding to a given amount of the base asset.
   *
   * The quote method can be used to convert an amount of the base asset (TBase) to an equivalent amount in the quote asset (TQuote). This is useful when you need to calculate the value of a specific asset amount in a different asset.
   *
   * @param amount The amount of base asset to quote against the price.
   * @returns A new amount instance representing the quoted amount of quote asset.
   * @throws 'TOKEN' if the asset amount's asset does not match this price's base asset.
   */
  public quote(amount: Amount<TBase>): Amount<TQuote> {
    invariant(amount.asset.eq(this.baseAsset), 'TOKEN');
    const result = amount.value.mul(this.value);
    return new Amount(this.quoteAsset, result);
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
   * Converts the Price to a number.
   *
   * @returns The number representation of the fraction.
   */
  public toNumber(): number {
    return this.adjustForDecimals().toNumber();
  }

  /**
   * Converts the Price to a number a string whose value is the value of this Price rounded to a precision of
   * `significantDigits` significant digits using rounding mode `roundingMode`.
   * @param significantDigits Significant digits, integer, 1 to 1e+9.
   * @param [roundingMode] `BigNumberJs.RoundingMode`.
   * @throws If `significantDigits` or `roundingMode` is invalid.
   */
  public toSignificant(
    significantDigits: number,
    roundingMode?: BigNumberJs.RoundingMode,
  ): string {
    return this.adjustForDecimals().toSignificant(
      significantDigits,
      roundingMode,
    );
  }

  /**
   * Converts the Price to a fixed-point decimal string representation.
   * @param decimalPlaces The number of decimal places to include in the string.
   * @param rounding The rounding mode to use.
   * @returns The fixed-point decimal string representation of the Price.
   */
  public toFixed(
    decimalPlaces = 4,
    rounding?: BigNumberJs.RoundingMode,
  ): string {
    return this.adjustForDecimals().toFixed(decimalPlaces, rounding);
  }

  /**
   * Converts the price to a formatted string representation.
   * @param decimalPlaces The number of decimal places to include in the string.
   * @param roundingMode The rounding mode to use.
   * @param format The formatting options to apply.
   * @returns The formatted string representation of the Price.
   */
  public toFormat(
    decimalPlaces = 4,
    roundingMode?: BigNumberJs.RoundingMode,
    format?: BigNumberJs.Format,
  ): string {
    return this.adjustForDecimals().toFormat(
      decimalPlaces,
      roundingMode,
      format,
    );
  }
}
