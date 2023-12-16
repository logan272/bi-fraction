import BigNumberJs from 'bignumber.js';

import { Bn } from './bn';
import type { BigIntIsh } from './constants';
import { gcd } from './gcd';

export class Fraction {
  /**
   * The numerator of the fraction.
   */
  public readonly numerator: bigint;
  /**
   * The denominator of the fraction.
   */
  public readonly denominator: bigint;

  /**
   * Creates a Fraction instance by parsing a decimal number.
   *
   * It would throws if value is not a valid decimal number.
   *
   * @param value - The decimal number to parse.
   * @returns A Fraction instance representing the parsed number.
   */
  public static parse(value: number | string): Fraction {
    const parts = Bn(value).toFixed().split('.');

    const [integerPart, decimalPart] = parts;

    if (decimalPart === undefined) {
      // `value` is an integer
      return new Fraction(value);
    } else {
      // `value` is a decimal
      const decimalPlaces = BigInt(decimalPart.length);
      const denominator = 10n ** decimalPlaces;
      const numerator = BigInt(integerPart) * denominator + BigInt(decimalPart);

      return new Fraction(numerator, denominator);
    }
  }

  /**
   * Creates a new Fraction instance with the give `numerator` and `denominator`.
   *
   * @param numerator - The numerator of the fraction.
   * @param denominator - The denominator of the fraction. (default: 1n)
   */
  constructor(numerator: BigIntIsh, denominator: BigIntIsh = 1n) {
    const divisor = gcd(numerator, denominator);

    this.numerator = BigInt(numerator) / divisor;
    this.denominator = BigInt(denominator) / divisor;
  }

  /**
   * Helper method to parse `other` as a Fraction instance.
   *
   * @param other - The value to be parsed.
   *
   * @returns A Fraction instance representing the parsed value.
   */
  parseOther(other: Fraction | BigIntIsh): Fraction {
    return other instanceof Fraction ? other : new Fraction(BigInt(other));
  }

  /**
   * The quotient of the fraction after performing floor division.
   */
  public get quotient(): bigint {
    return this.numerator / this.denominator;
  }

  /**
   * The remainder of the fraction after performing floor division.
   */
  public get remainder(): Fraction {
    return new Fraction(this.numerator % this.denominator, this.denominator);
  }

  /**
   * Inverts the fraction by swapping the numerator and denominator.
   *
   * @returns The inverted fraction.
   */
  public invert(): Fraction {
    return new Fraction(this.denominator, this.numerator);
  }

  /**
   * Checks if the fraction is zero.
   *
   * @returns True if the fraction is zero, false otherwise.
   */
  public isZero(): boolean {
    return this.numerator === 0n;
  }

  /**
   * Checks if the fraction is equal to `other`.
   *
   * @param other - The value to compare with.
   * @returns True if the fraction is equal to `other`, false otherwise.
   */
  public eq(other: Fraction | BigIntIsh): boolean {
    other = this.parseOther(other);

    return (
      this.numerator * other.denominator === other.numerator * this.denominator
    );
  }

  /**
   * Checks if the fraction is not equal to `other`.
   *
   * @param other - The value to compare with.
   * @returns True if the fraction is not equal to `other`, false otherwise.
   */
  public neq(other: Fraction | BigIntIsh): boolean {
    return !this.eq(other);
  }

  /**
   * Checks if the fraction is less than `other`.
   *
   * @param other - The value to compare with.
   * @returns True if the fraction is less than `other`, false otherwise.
   */
  public lt(other: Fraction | BigIntIsh): boolean {
    other = this.parseOther(other);

    return (
      this.numerator * other.denominator < other.numerator * this.denominator
    );
  }

  /**
   * Checks if the fraction is less than or equal to `other`.
   *
   * @param other - The value to compare with.
   * @returns True if the fraction is less than or equal to `other`, false otherwise.
   */
  public lte(other: Fraction | BigIntIsh): boolean {
    other = this.parseOther(other);

    return (
      this.numerator * other.denominator <= other.numerator * this.denominator
    );
  }

  /**
   * Checks if the fraction is greater than `other`.
   *
   * @param other - The value to compare with.
   * @returns True if the fraction is greater than `other`, false otherwise.
   */
  public gt(other: Fraction | BigIntIsh): boolean {
    other = this.parseOther(other);

    return (
      this.numerator * other.denominator > other.numerator * this.denominator
    );
  }

  /**
   * Checks if the fraction is greater than or equal to `other`.
   *
   * @param other - The value to compare with.
   * @returns True if the fraction is greater than or equal to `other`, false otherwise.
   */
  public gte(other: Fraction | BigIntIsh): boolean {
    other = this.parseOther(other);

    return (
      this.numerator * other.denominator >= other.numerator * this.denominator
    );
  }
  /**
   * Adds `other` to the fraction.
   *
   * @param other - The value to add.
   * @returns A new Fraction representing the sum.
   */
  public add(other: Fraction | BigIntIsh): Fraction {
    other = this.parseOther(other);

    if (this.denominator === other.denominator) {
      return new Fraction(this.numerator + other.numerator, this.denominator);
    }

    return new Fraction(
      this.numerator * other.denominator + other.numerator * this.denominator,
      this.denominator * other.denominator,
    );
  }
  /**
   * Subtracts `other` from the fraction.
   *
   * @param other - The value to subtract.
   * @returns A new Fraction representing the difference.
   */
  public sub(other: Fraction | BigIntIsh): Fraction {
    other = this.parseOther(other);

    if (this.denominator === other.denominator) {
      return new Fraction(this.numerator - other.numerator, this.denominator);
    }

    return new Fraction(
      this.numerator * other.denominator - other.numerator * this.denominator,
      this.denominator * other.denominator,
    );
  }

  /**
   * Multiplies the fraction by `other`.
   *
   * @param other - The value to multiply by.
   * @returns A new Fraction representing the product.
   */
  public mul(other: Fraction | BigIntIsh): Fraction {
    other = this.parseOther(other);

    return new Fraction(
      this.numerator * other.numerator,
      this.denominator * other.denominator,
    );
  }

  /**
   * Divides the fraction by `other`.
   *
   * @param other - The value to divide by.
   * @returns A new Fraction representing the quotient.
   */
  public div(other: Fraction | BigIntIsh): Fraction {
    other = this.parseOther(other);

    return new Fraction(
      this.numerator * other.denominator,
      other.numerator * this.denominator,
    );
  }

  /**
   * Converts the fraction to a fixed-point decimal string representation.
   *
   * @param decimalPlaces - The number of decimal places to include. (default: 0)
   * @param roundingMode - The rounding mode to use. (optional)
   * @returns The fixed-point decimal string representation of the fraction.
   */
  public toFixed(
    decimalPlaces = 0,
    roundingMode?: BigNumberJs.RoundingMode,
  ): string {
    return Bn(this.numerator.toString())
      .div(this.denominator.toString())
      .toFixed(decimalPlaces, roundingMode);
  }

  /**
   * Converts the fraction to a formatted string representation.
   *
   * @param decimalPlaces - The number of decimal places to include. (default: 0)
   * @param roundingMode - The rounding mode to use. (optional)
   * @param format - The format to apply. (optional)
   * @returns The formatted string representation of the fraction.
   */
  public toFormat(
    decimalPlaces = 0,
    roundingMode?: BigNumberJs.RoundingMode,
    format?: BigNumberJs.Format,
  ): string {
    return Bn(this.numerator.toString())
      .div(this.denominator.toString())
      .toFormat(
        decimalPlaces,
        roundingMode ?? BigNumberJs.ROUND_HALF_UP,
        format,
      );
  }

  /**
   * Helper method for converting any super class back to a fraction
   *
   * @returns A Fraction instance representing the current fraction.
   */
  public get asFraction(): Fraction {
    return new Fraction(this.numerator, this.denominator);
  }
}
