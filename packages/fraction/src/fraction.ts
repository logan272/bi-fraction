import BigNumberJs from 'bignumber.js';

import { Bn } from './bn';
import type { BigIntIsh } from './constants';
import { gcd } from './gcd';

export class Fraction {
  public readonly numerator: bigint;
  public readonly denominator: bigint;

  // Create a Fraction instance by parsing decimal number
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

  constructor(numerator: BigIntIsh, denominator: BigIntIsh = 1n) {
    const divisor = gcd(numerator, denominator);

    this.numerator = BigInt(numerator) / divisor;
    this.denominator = BigInt(denominator) / divisor;
  }

  parseOther(other: Fraction | BigIntIsh): Fraction {
    return other instanceof Fraction ? other : new Fraction(BigInt(other));
  }

  // performs floor division
  public get quotient(): bigint {
    return this.numerator / this.denominator;
  }

  // remainder after floor division
  public get remainder(): Fraction {
    return new Fraction(this.numerator % this.denominator, this.denominator);
  }

  public invert(): Fraction {
    return new Fraction(this.denominator, this.numerator);
  }

  public isZero(): boolean {
    return this.numerator === 0n;
  }

  public eq(other: Fraction | BigIntIsh): boolean {
    other = this.parseOther(other);

    return (
      this.numerator * other.denominator === other.numerator * this.denominator
    );
  }

  public lt(other: Fraction | BigIntIsh): boolean {
    other = this.parseOther(other);

    return (
      this.numerator * other.denominator < other.numerator * this.denominator
    );
  }

  public lte(other: Fraction | BigIntIsh): boolean {
    other = this.parseOther(other);

    return (
      this.numerator * other.denominator <= other.numerator * this.denominator
    );
  }

  public gt(other: Fraction | BigIntIsh): boolean {
    other = this.parseOther(other);

    return (
      this.numerator * other.denominator > other.numerator * this.denominator
    );
  }

  public gte(other: Fraction | BigIntIsh): boolean {
    other = this.parseOther(other);

    return (
      this.numerator * other.denominator >= other.numerator * this.denominator
    );
  }

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

  public mul(other: Fraction | BigIntIsh): Fraction {
    other = this.parseOther(other);

    return new Fraction(
      this.numerator * other.numerator,
      this.denominator * other.denominator,
    );
  }

  public div(other: Fraction | BigIntIsh): Fraction {
    other = this.parseOther(other);

    return new Fraction(
      this.numerator * other.denominator,
      other.numerator * this.denominator,
    );
  }

  public toFixed(
    decimalPlaces = 0,
    roundingMode?: BigNumberJs.RoundingMode,
  ): string {
    return Bn(this.numerator.toString())
      .div(this.denominator.toString())
      .toFixed(decimalPlaces, roundingMode);
  }

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
   */
  public get asFraction(): Fraction {
    return new Fraction(this.numerator, this.denominator);
  }
}
