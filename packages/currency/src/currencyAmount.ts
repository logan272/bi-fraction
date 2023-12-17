import type { BigIntIsh } from '@currencybase/fraction';
import { Fraction } from '@currencybase/fraction';
import BigNumberJs from 'bignumber.js';
import invariant from 'tiny-invariant';

import { MaxUint256 } from './constants';
import type { Currency } from './currency';

/**
 * Subclass of `Fraction`. Represents an amount of a specific currency.
 */
export class CurrencyAmount<T extends Currency> {
  /**
   * The currency associated with the amount.
   */
  public readonly currency: T;

  /**
   * The underlining fraction value.
   */
  public readonly fraction: Fraction;

  /**
   * Create a new CurrencyAmount
   *
   * @param currency The currency associated with the amount.
   * @param numerator The numerator of the fraction representing the amount.
   * @param denominator The denominator of the fraction representing the amount.
   */
  public static from<T extends Currency>(
    currency: T,
    numerator: BigIntIsh,
    denominator?: BigIntIsh,
  ): CurrencyAmount<T> {
    return new CurrencyAmount(currency, new Fraction(numerator, denominator));
  }

  /**
   * Constructs a new CurrencyAmount instance.
   *
   * @param currency The currency associated with the amount.
   * @param fraction The fraction value.
   */
  public constructor(currency: T, fraction: Fraction) {
    invariant(fraction.quotient <= MaxUint256, 'AMOUNT');
    this.fraction = fraction;
    this.currency = currency;
  }

  /**
   * Check if the current CurrencyAmount is equal to another CurrencyAmount.
   * @param other The CurrencyAmount to compare.
   * @returns True if the CurrencyAmounts are equal, false otherwise.
   * @throws 'CURRENCY' if the CurrencyAmounts have different currencies.
   */
  public eq(other: CurrencyAmount<T>): boolean {
    // It only make sense to compare and add/sub the amounts of the same currency.
    invariant(this.currency.eq(other.currency), 'CURRENCY');
    return this.fraction.eq(other.fraction);
  }

  /**
   * Check if the current CurrencyAmount is not equal to another CurrencyAmount.
   * @param other The CurrencyAmount to compare.
   * @returns True if the CurrencyAmounts are not equal, false otherwise.
   * @throws 'CURRENCY' if the CurrencyAmounts have different currencies.
   */
  public neq(other: CurrencyAmount<T>): boolean {
    return !this.currency.eq(other.currency);
  }

  /**
   * Check if the current CurrencyAmount is less than another CurrencyAmount.
   * @param other The CurrencyAmount to compare.
   * @returns True if the current CurrencyAmount is less than the other CurrencyAmount, false otherwise.
   * @throws 'CURRENCY' if the CurrencyAmounts have different currencies.
   */
  public lt(other: CurrencyAmount<T>): boolean {
    invariant(this.currency.eq(other.currency), 'CURRENCY');
    return this.fraction.lt(other.fraction);
  }

  /**
   * Check if the current CurrencyAmount is less than or equal to another CurrencyAmount.
   * @param other The CurrencyAmount to compare.
   * @returns True if the current CurrencyAmount is less than or equal to the other CurrencyAmount, false otherwise.
   * @throws 'CURRENCY' if the CurrencyAmounts have different currencies.
   */
  public lte(other: CurrencyAmount<T>): boolean {
    invariant(this.currency.eq(other.currency), 'CURRENCY');
    return this.fraction.lte(other.fraction);
  }

  /**
   * Check if the current CurrencyAmount is greater than another CurrencyAmount.
   * @param other The CurrencyAmount to compare.
   * @returns True if the current CurrencyAmount is greater than the other CurrencyAmount, false otherwise.
   * @throws 'CURRENCY' if the CurrencyAmounts have different currencies.
   */
  public gt(other: CurrencyAmount<T>): boolean {
    invariant(this.currency.eq(other.currency), 'CURRENCY');
    return this.fraction.gt(other.fraction);
  }

  /**
   * Check if the current CurrencyAmount is greater than or equal to another CurrencyAmount.
   * @param other The CurrencyAmount to compare.
   * @returns True if the current CurrencyAmount is greater than or equal to the other CurrencyAmount, false otherwise.
   * @throws 'CURRENCY' if the CurrencyAmounts have different currencies.
   */
  public gte(other: CurrencyAmount<T>): boolean {
    invariant(this.currency.eq(other.currency), 'CURRENCY');
    return this.fraction.gte(other.fraction);
  }

  /**
   * Adds another CurrencyAmount to the current instance.
   *
   * @param other The CurrencyAmount to add.
   * @returns A new CurrencyAmount instance representing the sum.
   * @throws 'CURRENCY' if the CurrencyAmounts have different currencies.
   */
  public add(other: CurrencyAmount<T>): CurrencyAmount<T> {
    invariant(this.currency.eq(other.currency), 'CURRENCY');
    const added = this.fraction.add(other.fraction);
    return new CurrencyAmount(this.currency, added);
  }

  /**
   * Subtracts another CurrencyAmount from the current instance.
   *
   * @param other The CurrencyAmount to subtract.
   * @returns A new CurrencyAmount instance representing the difference.
   * @throws 'CURRENCY' if the CurrencyAmounts have different currencies.
   */
  public sub(other: CurrencyAmount<T>): CurrencyAmount<T> {
    invariant(this.currency.eq(other.currency), 'CURRENCY');
    const subtracted = this.fraction.sub(other.fraction);
    return new CurrencyAmount(this.currency, subtracted);
  }

  /**
   * Multiplies the current instance by a Fraction or a BigIntIsh value.
   *
   * @param other The Fraction or BigIntIsh value to multiply by.
   * @returns A new CurrencyAmount instance representing the product.
   */
  public mul(other: Fraction | BigIntIsh): CurrencyAmount<T> {
    const multiplied = this.fraction.mul(other);
    return new CurrencyAmount(this.currency, multiplied);
  }

  /**
   * Divides the current instance by a Fraction or a BigIntIsh value.
   *
   * @param other The Fraction or BigIntIsh value to divide by.
   * @returns A new CurrencyAmount instance representing the quotient.
   */
  public div(other: Fraction | BigIntIsh): CurrencyAmount<T> {
    const divided = this.fraction.div(other);
    return new CurrencyAmount(this.currency, divided);
  }

  /**
   * Converts the CurrencyAmount to a fixed-point decimal string representation.
   *
   * @param decimalPlaces The number of decimal places to include in the string.
   * @param roundingMode The rounding mode to use.
   * @returns The fixed-point decimal string representation of the CurrencyAmount.
   * @throws 'DECIMALS' if the specified decimal places exceed the currency decimals.
   */
  public toFixed(
    decimalPlaces: number = this.currency.decimals,
    roundingMode?: BigNumberJs.RoundingMode,
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS');
    return this.fraction
      .div(this.currency.decimalScale)
      .toFixed(decimalPlaces, roundingMode);
  }

  /**
   * Converts the CurrencyAmount to a formatted string representation.
   *
   * @param decimalPlaces The number of decimal places to include in the string.
   * @param roundingMode The rounding mode to use.
   * @param format The formatting options to apply.
   * @returns The formatted string representation of the CurrencyAmount.
   * @throws 'DECIMALS' if the specified decimal places exceed the currency decimals.
   */
  public toFormat(
    decimalPlaces: number = this.currency.decimals,
    roundingMode?: BigNumberJs.RoundingMode,
    format?: BigNumberJs.Format,
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS');
    return this.fraction
      .div(this.currency.decimalScale)
      .toFormat(
        decimalPlaces,
        roundingMode ?? BigNumberJs.ROUND_HALF_UP,
        format,
      );
  }
}
