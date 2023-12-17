import type { BigIntIsh } from '@currencybase/fraction';
import { Fraction } from '@currencybase/fraction';
import BigNumberJs from 'bignumber.js';
import invariant from 'tiny-invariant';

import type { Currency } from './currency';

const MaxUint256 = BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
);

/**
 * Subclass of `Fraction`. Represents an amount of a specific currency.
 */
export class Amount<T extends Currency> {
  /**
   * The currency associated with the amount.
   */
  public readonly currency: T;

  /**
   * The underlining fraction value.
   */
  public readonly value: Fraction;

  /**
   * Create a new amount
   *
   * @param currency The currency associated with the amount.
   * @param numerator The numerator of the fraction representing the amount.
   * @param denominator The denominator of the fraction representing the amount.
   */
  public static from<T extends Currency>(
    currency: T,
    numerator: BigIntIsh,
    denominator?: BigIntIsh,
  ): Amount<T> {
    return new Amount(currency, new Fraction(numerator, denominator));
  }

  /**
   * Constructs a new amount instance.
   *
   * @param currency The currency associated with the amount.
   * @param fraction The fraction value.
   */
  public constructor(currency: T, fraction: Fraction) {
    invariant(fraction.quotient <= MaxUint256, 'AMOUNT');
    this.value = fraction;
    this.currency = currency;
  }

  /**
   * Check if the current amount is equal to another amount.
   * @param other The amount to compare.
   * @returns True if the amounts are equal, false otherwise.
   * @throws 'CURRENCY' if the amounts have different currencies.
   */
  public eq(other: Amount<T>): boolean {
    // It only make sense to compare and add/sub the amounts of the same currency.
    invariant(this.currency.eq(other.currency), 'CURRENCY');
    return this.value.eq(other.value);
  }

  /**
   * Check if the current amount is not equal to another amount.
   * @param other The amount to compare.
   * @returns True if the amounts are not equal, false otherwise.
   * @throws 'CURRENCY' if the amounts have different currencies.
   */
  public neq(other: Amount<T>): boolean {
    return !this.currency.eq(other.currency);
  }

  /**
   * Check if the current amount is less than another amount.
   * @param other The amount to compare.
   * @returns True if the current amount is less than the other amount, false otherwise.
   * @throws 'CURRENCY' if the amounts have different currencies.
   */
  public lt(other: Amount<T>): boolean {
    invariant(this.currency.eq(other.currency), 'CURRENCY');
    return this.value.lt(other.value);
  }

  /**
   * Check if the current amount is less than or equal to another amount.
   * @param other The amount to compare.
   * @returns True if the current amount is less than or equal to the other amount, false otherwise.
   * @throws 'CURRENCY' if the amounts have different currencies.
   */
  public lte(other: Amount<T>): boolean {
    invariant(this.currency.eq(other.currency), 'CURRENCY');
    return this.value.lte(other.value);
  }

  /**
   * Check if the current amount is greater than another amount.
   * @param other The amount to compare.
   * @returns True if the current amount is greater than the other amount, false otherwise.
   * @throws 'CURRENCY' if the amounts have different currencies.
   */
  public gt(other: Amount<T>): boolean {
    invariant(this.currency.eq(other.currency), 'CURRENCY');
    return this.value.gt(other.value);
  }

  /**
   * Check if the current amount is greater than or equal to another amount.
   * @param other The amount to compare.
   * @returns True if the current amount is greater than or equal to the other amount, false otherwise.
   * @throws 'CURRENCY' if the amounts have different currencies.
   */
  public gte(other: Amount<T>): boolean {
    invariant(this.currency.eq(other.currency), 'CURRENCY');
    return this.value.gte(other.value);
  }

  /**
   * Adds another amount to the current instance.
   *
   * @param other The amount to add.
   * @returns A new amount instance representing the sum.
   * @throws 'CURRENCY' if the amounts have different currencies.
   */
  public add(other: Amount<T>): Amount<T> {
    invariant(this.currency.eq(other.currency), 'CURRENCY');
    const added = this.value.add(other.value);
    return new Amount(this.currency, added);
  }

  /**
   * Subtracts another amount from the current instance.
   *
   * @param other The amount to subtract.
   * @returns A new amount instance representing the difference.
   * @throws 'CURRENCY' if the amounts have different currencies.
   */
  public sub(other: Amount<T>): Amount<T> {
    invariant(this.currency.eq(other.currency), 'CURRENCY');
    const subtracted = this.value.sub(other.value);
    return new Amount(this.currency, subtracted);
  }

  /**
   * Multiplies the current instance by a Fraction or a BigIntIsh value.
   *
   * @param other The Fraction or BigIntIsh value to multiply by.
   * @returns A new amount instance representing the product.
   */
  public mul(other: Fraction | BigIntIsh): Amount<T> {
    const multiplied = this.value.mul(other);
    return new Amount(this.currency, multiplied);
  }

  /**
   * Divides the current instance by a Fraction or a BigIntIsh value.
   *
   * @param other The Fraction or BigIntIsh value to divide by.
   * @returns A new amount instance representing the quotient.
   */
  public div(other: Fraction | BigIntIsh): Amount<T> {
    const divided = this.value.div(other);
    return new Amount(this.currency, divided);
  }

  /**
   * Converts the amount to a fixed-point decimal string representation.
   *
   * @param decimalPlaces The number of decimal places to include in the string.
   * @param roundingMode The rounding mode to use.
   * @returns The fixed-point decimal string representation of the amount.
   * @throws 'DECIMALS' if the specified decimal places exceed the currency decimals.
   */
  public toFixed(
    decimalPlaces: number = this.currency.decimals,
    roundingMode?: BigNumberJs.RoundingMode,
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS');
    return this.value
      .div(this.currency.decimalScale)
      .toFixed(decimalPlaces, roundingMode);
  }

  /**
   * Converts the amount to a formatted string representation.
   *
   * @param decimalPlaces The number of decimal places to include in the string.
   * @param roundingMode The rounding mode to use.
   * @param format The formatting options to apply.
   * @returns The formatted string representation of the amount.
   * @throws 'DECIMALS' if the specified decimal places exceed the currency decimals.
   */
  public toFormat(
    decimalPlaces: number = this.currency.decimals,
    roundingMode?: BigNumberJs.RoundingMode,
    format?: BigNumberJs.Format,
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS');
    return this.value
      .div(this.currency.decimalScale)
      .toFormat(
        decimalPlaces,
        roundingMode ?? BigNumberJs.ROUND_HALF_UP,
        format,
      );
  }
}
