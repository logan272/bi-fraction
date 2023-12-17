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
   * The decimal scale of the currency, used for conversions.
   */
  public readonly decimalScale: bigint;

  /**
   * Constructs a new CurrencyAmount instance.
   *
   * @param currency The currency associated with the amount.
   * @param numerator The numerator of the fraction representing the amount.
   * @param denominator The denominator of the fraction representing the amount.
   */
  public constructor(
    currency: T,
    numerator: BigIntIsh,
    denominator?: BigIntIsh,
  ) {
    const fraction = new Fraction(numerator, denominator);
    invariant(fraction.quotient <= MaxUint256, 'AMOUNT');
    this.fraction = fraction;
    this.currency = currency;
    this.decimalScale = 10n ** BigInt(currency.decimals);
  }

  /**
   * Adds another CurrencyAmount to the current instance.
   *
   * @param other The CurrencyAmount to add.
   * @returns A new CurrencyAmount instance representing the sum.
   * @throws 'CURRENCY' if the CurrencyAmounts have different currencies.
   */
  public add(other: CurrencyAmount<T>): CurrencyAmount<T> {
    // It only make sense to add the amounts of the same currency.
    invariant(this.currency.eq(other.currency), 'CURRENCY');
    const added = this.fraction.add(other.fraction);
    return new CurrencyAmount(
      this.currency,
      added.numerator,
      added.denominator,
    );
  }

  /**
   * Subtracts another CurrencyAmount from the current instance.
   *
   * @param other The CurrencyAmount to subtract.
   * @returns A new CurrencyAmount instance representing the difference.
   * @throws 'CURRENCY' if the CurrencyAmounts have different currencies.
   */
  public sub(other: CurrencyAmount<T>): CurrencyAmount<T> {
    // It only make sense to sub the amounts of the same currency.
    invariant(this.currency.eq(other.currency), 'CURRENCY');
    const subtracted = this.fraction.sub(other.fraction);
    return new CurrencyAmount(
      this.currency,
      subtracted.numerator,
      subtracted.denominator,
    );
  }

  /**
   * Multiplies the current instance by a Fraction or a BigIntIsh value.
   *
   * @param other The Fraction or BigIntIsh value to multiply by.
   * @returns A new CurrencyAmount instance representing the product.
   */
  public mul(other: Fraction | BigIntIsh): CurrencyAmount<T> {
    const multiplied = this.fraction.mul(other);
    return new CurrencyAmount(
      this.currency,
      multiplied.numerator,
      multiplied.denominator,
    );
  }

  /**
   * Divides the current instance by a Fraction or a BigIntIsh value.
   *
   * @param other The Fraction or BigIntIsh value to divide by.
   * @returns A new CurrencyAmount instance representing the quotient.
   */
  public div(other: Fraction | BigIntIsh): CurrencyAmount<T> {
    const divided = this.fraction.div(other);
    return new CurrencyAmount(
      this.currency,
      divided.numerator,
      divided.denominator,
    );
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
      .div(this.decimalScale)
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
      .div(this.decimalScale)
      .toFormat(
        decimalPlaces,
        roundingMode ?? BigNumberJs.ROUND_HALF_UP,
        format,
      );
  }
}
