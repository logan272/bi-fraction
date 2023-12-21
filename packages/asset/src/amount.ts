import type { BigIntIsh, NumericString } from '@fraction-asset/fraction';
import { Fraction } from '@fraction-asset/fraction';
import BignumberJs from 'bignumber.js';
import invariant from 'tiny-invariant';

import type { Asset } from './asset';

/**
 * Subclass of `Fraction`. Represents an amount of a specific asset.
 */
export class Amount<T extends Asset = Asset> {
  /**
   * The asset associated with the amount.
   */
  public readonly asset: T;

  /**
   * The underlining fraction value.
   */
  public readonly value: Fraction;

  /**
   * Creates a Amount instance by parsing a numeric string.
   * @param asset The asset associated with the amount.
   * @param value - The decimal string to parse.
   * @returns A Amount instance representing the parsed decimals string.
   * @throws If the string can not be parsed to a number
   */
  public static parse<T extends Asset>(asset: T, value: NumericString): Amount {
    const fraction = Fraction.parse(value);
    return new Amount(asset, fraction);
  }

  /**
   * Create a new amount
   * @param asset The asset associated with the amount.
   * @param numerator The numerator of the fraction representing the amount.
   * @param denominator The denominator of the fraction representing the amount.
   */
  public static from<T extends Asset>(
    asset: T,
    numerator: BigIntIsh,
    denominator?: BigIntIsh,
  ): Amount<T> {
    return new Amount(asset, new Fraction(numerator, denominator));
  }

  /**
   * Create a new amount with the value of one asset.decimalScale
   *
   * @param asset The asset associated with the amount.
   */
  public static one<T extends Asset>(asset: T): Amount<T> {
    return new Amount(asset, new Fraction(asset.decimalScale));
  }

  /**
   * Constructs a new amount instance.
   * @param asset The asset associated with the amount.
   * @param fraction The fraction value.
   */
  public constructor(asset: T, fraction: Fraction) {
    this.value = fraction;
    this.asset = asset;
  }

  /**
   * The quotient of the fraction after performing floor division.
   */
  public get quotient(): bigint {
    return this.value.quotient;
  }

  /**
   * Checks if the Amount is zero.
   * @returns True if the Amount is zero, false otherwise.
   */
  public isZero(): boolean {
    return this.value.isZero();
  }

  /**
   * Check if the current amount is equal to another amount.
   * @param other The amount to compare.
   * @returns True if the amounts are equal, false otherwise.
   * @throws 'asset' if the amounts have different currencies.
   */
  public eq(other: Amount<T>): boolean {
    // It only make sense to compare and add/sub the amounts of the same asset.
    invariant(this.asset.eq(other.asset), 'asset');
    return this.value.eq(other.value);
  }

  /**
   * Check if the current amount is not equal to another amount.
   * @param other The amount to compare.
   * @returns True if the amounts are not equal, false otherwise.
   * @throws 'asset' if the amounts have different currencies.
   */
  public neq(other: Amount<T>): boolean {
    return !this.asset.eq(other.asset);
  }

  /**
   * Check if the current amount is less than another amount.
   * @param other The amount to compare.
   * @returns True if the current amount is less than the other amount, false otherwise.
   * @throws 'asset' if the amounts have different currencies.
   */
  public lt(other: Amount<T>): boolean {
    invariant(this.asset.eq(other.asset), 'asset');
    return this.value.lt(other.value);
  }

  /**
   * Check if the current amount is less than or equal to another amount.
   * @param other The amount to compare.
   * @returns True if the current amount is less than or equal to the other amount, false otherwise.
   * @throws 'asset' if the amounts have different currencies.
   */
  public lte(other: Amount<T>): boolean {
    invariant(this.asset.eq(other.asset), 'asset');
    return this.value.lte(other.value);
  }

  /**
   * Check if the current amount is greater than another amount.
   * @param other The amount to compare.
   * @returns True if the current amount is greater than the other amount, false otherwise.
   * @throws 'asset' if the amounts have different currencies.
   */
  public gt(other: Amount<T>): boolean {
    invariant(this.asset.eq(other.asset), 'asset');
    return this.value.gt(other.value);
  }

  /**
   * Check if the current amount is greater than or equal to another amount.
   * @param other The amount to compare.
   * @returns True if the current amount is greater than or equal to the other amount, false otherwise.
   * @throws 'asset' if the amounts have different currencies.
   */
  public gte(other: Amount<T>): boolean {
    invariant(this.asset.eq(other.asset), 'asset');
    return this.value.gte(other.value);
  }

  /**
   * Adds another amount to the current instance.
   * @param other The amount to add.
   * @returns A new amount instance representing the sum.
   * @throws 'asset' if the amounts have different currencies.
   */
  public add(other: Amount<T>): Amount<T> {
    invariant(this.asset.eq(other.asset), 'asset');
    const added = this.value.add(other.value);
    return new Amount(this.asset, added);
  }

  /**
   * Subtracts another amount from the current instance.
   * @param other The amount to subtract.
   * @returns A new amount instance representing the difference.
   * @throws 'asset' if the amounts have different currencies.
   */
  public sub(other: Amount<T>): Amount<T> {
    invariant(this.asset.eq(other.asset), 'asset');
    const subtracted = this.value.sub(other.value);
    return new Amount(this.asset, subtracted);
  }

  /**
   * Multiplies the current instance by a Fraction or a BigIntIsh value.
   * @param other The Fraction or BigIntIsh value to multiply by.
   * @returns A new amount instance representing the product.
   */
  public mul(other: Fraction | BigIntIsh): Amount<T> {
    const multiplied = this.value.mul(other);
    return new Amount(this.asset, multiplied);
  }

  /**
   * Divides the current instance by a Fraction or a BigIntIsh value.
   * @param other The Fraction or BigIntIsh value to divide by.
   * @returns A new amount instance representing the quotient.
   */
  public div(other: Fraction | BigIntIsh): Amount<T> {
    const divided = this.value.div(other);
    return new Amount(this.asset, divided);
  }

  /**
   * Gets the value scaled by decimals for formatting.
   * @returns The adjusted Fraction value.
   */
  public adjustForDecimals(): Fraction {
    return this.value.div(this.asset.decimalScale);
  }

  /**
   * Converts the Amount to a number.
   * @returns The number representation of the fraction.
   */
  public toNumber(): number {
    return this.adjustForDecimals().toNumber();
  }

  /**
   * Converts the Price to a number a string whose value is the value of this Price rounded to a precision of
   * `significantDigits` significant digits using rounding mode `roundingMode`.
   *
   * @param significantDigits Significant digits, integer, 1 to 1e+9.
   * @param [roundingMode] `BigNumberJs.RoundingMode`.
   * @throws If `significantDigits` or `roundingMode` is invalid.
   */
  public toSignificant(
    significantDigits: number,
    roundingMode?: BignumberJs.RoundingMode,
  ): string {
    return this.adjustForDecimals().toSignificant(
      significantDigits,
      roundingMode,
    );
  }

  /**
   * Converts the amount to a fixed-point decimal string representation.
   * @param decimalPlaces The number of decimal places to include in the string.
   * @param roundingMode The rounding mode to use.
   * @returns The fixed-point decimal string representation of the amount.
   * @throws 'DECIMALS' if the specified decimal places exceed the asset decimals.
   */
  public toFixed(
    decimalPlaces: number = this.asset.decimals,
    roundingMode?: BignumberJs.RoundingMode,
  ): string {
    invariant(decimalPlaces <= this.asset.decimals, 'DECIMALS');
    return this.adjustForDecimals().toFixed(decimalPlaces, roundingMode);
  }

  /**
   * Converts the amount to a formatted string representation.
   * @param decimalPlaces The number of decimal places to include in the string.
   * @param roundingMode The rounding mode to use.
   * @param format The formatting options to apply.
   * @returns The formatted string representation of the amount.
   * @throws 'DECIMALS' if the specified decimal places exceed the asset decimals.
   */
  public toFormat(
    decimalPlaces: number = this.asset.decimals,
    roundingMode?: BignumberJs.RoundingMode,
    format?: BignumberJs.Format,
  ): string {
    invariant(decimalPlaces <= this.asset.decimals, 'DECIMALS');
    return this.adjustForDecimals().toFormat(
      decimalPlaces,
      roundingMode ?? BignumberJs.ROUND_HALF_UP,
      format,
    );
  }
}
