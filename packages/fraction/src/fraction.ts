import BigNumberJs from 'bignumber.js';

import { Bn } from './bn';
import type { BigIntIsh, NumericString } from './constants';
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
   * Creates a Fraction instance by parsing a numeric string.
   *
   * `Fraction.parse(str)` is less efficient compare to `new Fraction(...args)`.
   * You should use `new Fraction(...args)` instead most of the time.
   * @param value - The decimal string to parse.
   * @returns A Fraction instance representing the parsed decimals string.
   * @throws If the string can not be parsed to a number
   */
  public static parse(value: NumericString): Fraction {
    const bn = Bn(value);

    if (bn.isZero()) return new Fraction(0);
    if (bn.isInteger()) return new Fraction(value);

    const parts = bn.toFixed().split('.');
    const [integerPart, decimalPart] = parts;
    const decimalPlaces = BigInt(decimalPart.length);
    const denominator = 10n ** decimalPlaces;
    const numerator = BigInt(integerPart) * denominator + BigInt(decimalPart);

    return new Fraction(numerator, denominator);
  }

  /**
   * Creates a new Fraction instance with the give `numerator` and `denominator`.
   * @param numerator - The numerator of the fraction.
   * @param denominator - The denominator of the fraction. (default: 1n)
   * @throws If numerator or denominator is not a valid BigIntIsh
   */
  constructor(numerator: BigIntIsh, denominator: BigIntIsh = 1n) {
    const n = BigInt(numerator);
    const d = BigInt(denominator);

    if (n === 0n || d === 0n) {
      this.numerator = 0n;
      this.denominator = d;
    } else {
      const divisor = gcd(n, d);
      this.numerator = n / divisor;
      this.denominator = d / divisor;
    }
  }

  /**
   * Helper method to convert `value` as a Fraction instance.
   * @param value - The value to be parsed.
   * @returns A Fraction instance representing the parsed value.
   * @throws If other is not a valid BigIntIsh
   */
  private toFraction(value: Fraction | BigIntIsh): Fraction {
    return value instanceof Fraction ? value : new Fraction(BigInt(value));
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
   * @returns The inverted fraction.
   */
  public invert(): Fraction {
    return new Fraction(this.denominator, this.numerator);
  }

  /**
   * Checks if the fraction is zero.
   * @returns True if the fraction is zero, false otherwise.
   */
  public isZero(): boolean {
    return this.numerator === 0n;
  }

  /**
   * Checks if the fraction is equal to `other`.
   * @param other - The value to compare with.
   * @returns True if the fraction is equal to `other`, false otherwise.
   * @throws If other is not a valid BigIntIsh
   */
  public eq(other: Fraction | BigIntIsh): boolean {
    other = this.toFraction(other);

    return (
      this.numerator * other.denominator === other.numerator * this.denominator
    );
  }

  /**
   * Checks if the fraction is not equal to `other`.
   * @param other - The value to compare with.
   * @returns True if the fraction is not equal to `other`, false otherwise.
   * @throws If other is not a valid BigIntIsh
   */
  public neq(other: Fraction | BigIntIsh): boolean {
    return !this.eq(other);
  }

  /**
   * Checks if the fraction is less than `other`.
   *
   * @param other - The value to compare with.
   * @returns True if the fraction is less than `other`, false otherwise.
   * @throws If other is not a valid BigIntIsh
   */
  public lt(other: Fraction | BigIntIsh): boolean {
    other = this.toFraction(other);

    return (
      this.numerator * other.denominator < other.numerator * this.denominator
    );
  }

  /**
   * Checks if the fraction is less than or equal to `other`.
   * @param other - The value to compare with.
   * @returns True if the fraction is less than or equal to `other`, false otherwise.
   * @throws If other is not a valid BigIntIsh
   */
  public lte(other: Fraction | BigIntIsh): boolean {
    other = this.toFraction(other);

    return (
      this.numerator * other.denominator <= other.numerator * this.denominator
    );
  }

  /**
   * Checks if the fraction is greater than `other`.
   * @param other - The value to compare with.
   * @returns True if the fraction is greater than `other`, false otherwise.
   * @throws If other is not a valid BigIntIsh
   */
  public gt(other: Fraction | BigIntIsh): boolean {
    other = this.toFraction(other);

    return (
      this.numerator * other.denominator > other.numerator * this.denominator
    );
  }

  /**
   * Checks if the fraction is greater than or equal to `other`.
   * @param other - The value to compare with.
   * @returns True if the fraction is greater than or equal to `other`, false otherwise.
   * @throws If other is not a valid BigIntIsh
   */
  public gte(other: Fraction | BigIntIsh): boolean {
    other = this.toFraction(other);

    return (
      this.numerator * other.denominator >= other.numerator * this.denominator
    );
  }

  /**
   * Adds `other` to the fraction.
   * @param other - The value to add.
   * @returns A new Fraction representing the sum.
   * @throws If other is not a valid BigIntIsh
   */
  public add(other: Fraction | BigIntIsh): Fraction {
    other = this.toFraction(other);

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
   * @param other - The value to subtract.
   * @returns A new Fraction representing the difference.
   * @throws If other is not a valid BigIntIsh
   */
  public sub(other: Fraction | BigIntIsh): Fraction {
    other = this.toFraction(other);

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
   * @param other - The value to multiply by.
   * @returns A new Fraction representing the product.
   * @throws If other is not a valid BigIntIsh
   */
  public mul(other: Fraction | BigIntIsh): Fraction {
    other = this.toFraction(other);

    return new Fraction(
      this.numerator * other.numerator,
      this.denominator * other.denominator,
    );
  }

  /**
   * Divides the fraction by `other`.
   * @param other - The value to divide by.
   * @returns A new Fraction representing the quotient.
   * @throws If other is not a valid BigIntIsh
   */
  public div(other: Fraction | BigIntIsh): Fraction {
    other = this.toFraction(other);

    return new Fraction(
      this.numerator * other.denominator,
      other.numerator * this.denominator,
    );
  }

  /**
   * Converts the fraction to a Javascript number.
   *
   * ```ts
   * x = new Fraction('45987349857634085409857349856430985')
   * x.toNumber()                    // 4.598734985763409e+34
   *
   * y = new Fraction(456.789)
   * y.toNumber()                    // 456.789
   * ```
   * @returns The number representation of the fraction.
   */
  public toNumber(): number {
    return Bn(this.numerator.toString())
      .div(this.denominator.toString())
      .toNumber();
  }

  /**
   * Returns a string whose value is the value of this Fraction rounded to a precision of
   * `significantDigits` significant digits using rounding mode `roundingMode`.
   *
   * If `roundingMode` is omitted or is `null` or `undefined`, `ROUNDING_MODE` will be used.
   *
   *
   * ```ts
   * x = new Fraction.parse('9876.54321')
   * x.precision(6)                         // '9876.54'
   * x.precision(6, BigNumber.ROUND_UP)     // '9876.55'
   * x.precision(2)                         // '9900'
   * x.precision(2, 1)                      // '9800'
   * x                                      // '9876.54321'
   * ```
   *
   * @param significantDigits Significant digits, integer, 1 to 1e+9.
   * @param [roundingMode] `BigNumberJs.RoundingMode`.
   * @throws If `significantDigits` or `roundingMode` is invalid.
   */
  public toSignificant(
    significantDigits: number,
    roundingMode?: BigNumberJs.RoundingMode,
  ): string {
    return Bn(this.numerator.toString())
      .div(this.denominator.toString())
      .precision(significantDigits, roundingMode)
      .toString();
  }

  /**
   * Converts the fraction to a fixed-point decimal string representation.
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
   * @returns A Fraction instance representing the current fraction.
   */
  public get asFraction(): Fraction {
    return new Fraction(this.numerator, this.denominator);
  }
}
