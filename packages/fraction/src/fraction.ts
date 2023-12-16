import BigNumberJs from 'bignumber.js';

import type { BigIntIsh } from './constants';

export class Fraction {
  public readonly numerator: bigint;
  public readonly denominator: bigint;

  // Create a Fraction instance by parsing decimal number
  public static parse(value: number | string): Fraction {
    const parts = Bn(value).toFixed().split('.');

    const [_, fraction] = parts;

    if (parts[1] === undefined) {
      // `value` is an integer
      return new Fraction(value);
    } else {
      // `value` is a decimal
      return new Fraction(parts.join(), 10n ** BigInt(fraction.length));
    }
  }

  constructor(numerator: BigIntIsh, denominator: BigIntIsh = 1n) {
    this.numerator = BigInt(numerator);
    this.denominator = BigInt(denominator);
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

// https://mikemcl.github.io/bignumber.js/#bignumber
// Make an clone of the BigNumberJs constructor
const Bn = BigNumberJs.clone({
  // https://mikemcl.github.io/bignumber.js/#config
  // Following config are the default settings. the defaults good enough
  // we don't need to change the default settings.
  // ================================
  //
  // DECIMAL_PLACES: 20,
  // ROUNDING_MODE: BigNumberJs.ROUND_HALF_UP,
  // EXPONENTIAL_AT: [-7, 20],
  // RANGE: [-1e9, 1e9],
  // CRYPTO: false,
  // MODULO_MODE: BigNumberJs.ROUND_DOWN,
  // POW_PRECISION: 0,
  // ALPHABET: '0123456789abcdefghijklmnopqrstuvwxyz',
  FORMAT: {
    // string to prepend
    prefix: '',
    // decimal separator
    decimalSeparator: '.',
    // grouping separator of the integer part
    groupSeparator: ',',
    // primary grouping size of the integer part
    groupSize: 3,
    // secondary grouping size of the integer part
    secondaryGroupSize: 0,
    // grouping separator of the fraction part
    fractionGroupSeparator: '\xA0', // non-breaking space
    // grouping size of the fraction part
    fractionGroupSize: 0,
    // string to append
    suffix: '',
  },
});
