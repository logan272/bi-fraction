/* eslint-disable max-lines */

import { addSeparators } from './addSeparators';
import { gcd } from './gcd';
import { toFixed } from './toFixed';
import { toPrecision } from './toPrecision';
import type { NumberIsh } from './types';

export enum RoundingMode {
  /**
   * Rounds away from zero
   */
  ROUND_UP = 0,
  /**
   * Rounds towards zero
   */
  ROUND_DOWN = 1,
  /**
   * Rounds towards Infinity
   */
  ROUND_CEIL = 2,
  /**
   * Rounds towards Infinity
   * Rounds towards -Infinity
   */
  ROUND_FLOOR = 3,
  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds away from zero
   */
  ROUND_HALF_UP = 4,
  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards zero
   */
  ROUND_HALF_DOWN = 5,
  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards even neighbour
   */
  ROUND_HALF_EVEN = 6,
  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards Infinity
   */
  ROUND_HALF_CEIL = 7,
  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards -Infinity
   */
  ROUND_HALF_FLOOR = 8,
}

type Config = {
  decimalPlaces?: number;
  roundingMode?: RoundingMode;
  trailingZeros?: boolean;
  format?: Format;
};

type Format = {
  // grouping size of the integer part
  groupSize?: number;
  // grouping separator of the integer part
  groupSeparator?: string;
  // decimal separator
  decimalSeparator?: string;
};

// The default config object
const CONFIG = {
  decimalPlaces: 0,
  trailingZeros: true,
  roundingMode: RoundingMode.ROUND_HALF_UP,
  format: {
    groupSize: 3,
    groupSeparator: ',',
    decimalSeparator: '.',
  },
} as const;

export type ToFormatOption = Config;
export type ToFixedOption = Pick<Config, 'roundingMode' | 'trailingZeros'>;
export type ToPrecisionOption = Pick<Config, 'roundingMode'>;
export type FractionIsh = Fraction | NumberIsh;

export class Fraction {
  // Fraction constants
  public static readonly ZERO = new Fraction(0);
  public static readonly ONE = new Fraction(1);

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
   * @param value - The value to parse.
   * @returns [bigint, bigint] representing the successfully parsed Fraction numerator and denominator.
   * @throws If value is not a valid NumberIsh.
   */
  private static parse(value: FractionIsh): [bigint, bigint] {
    if (value instanceof Fraction) return [value.numerator, value.denominator];
    if (typeof value === 'bigint') return [value, 1n];
    if (typeof value === 'number' && Number.isInteger(value))
      return [BigInt(value), 1n];

    const n = Number(value);

    if (Number.isNaN(n))
      throw new Error(`Cannot convert ${value} to a Fraction`);
    if (
      Number.isInteger(n) &&
      n <= Number.MAX_SAFE_INTEGER &&
      n >= Number.MAX_SAFE_INTEGER
    )
      return [BigInt(n), 1n];

    const s = typeof value === 'string' ? value.trim() : value.toString();

    // `s` may be an unsafe integer, e.g. s >= Number.MAX_SAFE_INTEGER or s <= Number.MIN_SAFE_INTEGER
    // '9007199254740992'
    // '-9007199254740992'
    // '1000000000000000000'
    // '-1000000000000000000'
    //
    // `s` may has scientific notation
    //
    // '1e25'                     => '1e25'
    // '-1e25'                    => '-1e25'
    // '1e+25'                    => '1e+25'
    // '1.01e25'                  => '1.01e25'
    // '1.01e-25'                 => '1.01e-25'
    // (0.0000001).toString()     => '1e-7'
    // (0.0000000001).toString()  => '1e-10'
    // (0.0000001001).toString()  => '1.001e-7'

    const sign = n > 0 ? 1n : -1n;
    const [base, power] = s.split('e');
    const [integer, decimal = ''] = base.split('.');
    let denominator = 10n ** BigInt(decimal.length);
    let numerator = BigInt(integer);
    numerator = numerator >= 0n ? numerator : -numerator;
    numerator = sign * (numerator * denominator + BigInt(decimal));

    if (power) {
      const p = BigInt(power);

      if (p >= 0n) {
        numerator *= 10n ** p;
      } else {
        denominator *= 10n ** -p;
      }
    }

    return [numerator, denominator];
  }

  /**
   * Tries to parse the given value as a Fraction
   *
   * @param value - The value to parse.
   * @returns The parsed Fraction value, or undefined if `value` is not a valid NumberIsh.
   */
  public static tryParse(value: FractionIsh): Fraction | undefined {
    try {
      return new Fraction(value);
    } catch (_) {
      return undefined;
    }
  }

  /**
   * Creates a new Fraction instance.
   * @param numerator - The numerator of the fraction.
   * @param denominator - The denominator of the fraction. (default: 1n)
   * @throws
   *  1. If the numerator or denominator is not a valid NumberIsh.
   *  2. If denominator is zero.
   */
  constructor(numerator: FractionIsh, denominator?: FractionIsh) {
    if (denominator === undefined || denominator === null) {
      if (numerator instanceof Fraction) {
        this.numerator = numerator.numerator;
        this.denominator = numerator.denominator;
        return;
      }
    }

    const [n1, d1] = Fraction.parse(numerator);
    const [n2, d2] = Fraction.parse(denominator ?? 1n);

    const n = n1 * d2;
    const d = d1 * n2;

    if (d === 0n) throw new Error('Division by zero');

    if (n === 0n) {
      this.numerator = 0n;
      this.denominator = 1n;
    } else {
      const divisor = gcd(n, d);
      this.numerator = n / divisor;
      this.denominator = d / divisor;
    }
  }

  /**
   * Gets the quotient of the fraction (the integer part of the division).
   * @returns The quotient of the fraction.
   */
  public get quotient(): bigint {
    return this.numerator / this.denominator;
  }

  /**
   * Gets the remainder of the fraction as a new Fraction instance.
   * @returns A Fraction instance representing the remainder of the division.
   */
  public get remainder(): Fraction {
    return new Fraction(this.numerator % this.denominator, this.denominator);
  }

  /**
   * Inverts the fraction by swapping the numerator and denominator.
   * @returns The inverted fraction.
   */
  public invert(): Fraction {
    if (this.isZero()) return this;

    return new Fraction(this.denominator, this.numerator);
  }

  /**
   * Negates the sign of the Fraction.
   * @returns The Fraction with the sign inverted.
   */
  public negate(): Fraction {
    return this.mul(-1);
  }

  /**
   * Returns the absolute value of the fraction.
   * @returns A new Fraction instance representing the absolute value of the fraction.
   */
  public abs(): Fraction {
    if (this.isZero()) return this;

    if (this.numerator * this.denominator < 0n) {
      if (this.numerator < 0n) {
        return new Fraction(-this.numerator, this.denominator);
      } else {
        return new Fraction(this.numerator, -this.denominator);
      }
    } else {
      return this;
    }
  }

  /**
   * Expands the fraction by multiplying it by 10 raised to the specified decimal places.
   * @param decimals - The number of decimal places to expand.
   * @returns A new Fraction instance representing the expanded fraction.
   */
  public expandDecimals(decimals: number): Fraction {
    return this.mul(10n ** BigInt(decimals));
  }

  /**
   * Normalizes the fraction by dividing it by 10 raised to the specified decimal places.
   * @param decimals - The number of decimal places to normalize.
  @return A new Fraction instance representing the normalized fraction.
   */
  public normalizeDecimals(decimals: number): Fraction {
    return this.div(10n ** BigInt(decimals));
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
   * @throws If other is not a valid NumberIsh
   */
  public eq(other: FractionIsh): boolean {
    other = new Fraction(other);

    return (
      this.numerator * other.denominator === other.numerator * this.denominator
    );
  }

  /**
   * Checks if the fraction is not equal to `other`.
   * @param other - The value to compare with.
   * @returns True if the fraction is not equal to `other`, false otherwise.
   * @throws If other is not a valid NumberIsh
   */
  public neq(other: FractionIsh): boolean {
    return !this.eq(other);
  }

  /**
   * Checks if the fraction is less than `other`.
   *
   * @param other - The value to compare with.
   * @returns True if the fraction is less than `other`, false otherwise.
   * @throws If other is not a valid NumberIsh
   */
  public lt(other: FractionIsh): boolean {
    other = new Fraction(other);

    return (
      this.numerator * other.denominator < other.numerator * this.denominator
    );
  }

  /**
   * Checks if the fraction is less than or equal to `other`.
   * @param other - The value to compare with.
   * @returns True if the fraction is less than or equal to `other`, false otherwise.
   * @throws If other is not a valid NumberIsh
   */
  public lte(other: FractionIsh): boolean {
    other = new Fraction(other);

    return (
      this.numerator * other.denominator <= other.numerator * this.denominator
    );
  }

  /**
   * Checks if the fraction is greater than `other`.
   * @param other - The value to compare with.
   * @returns True if the fraction is greater than `other`, false otherwise.
   * @throws If other is not a valid NumberIsh
   */
  public gt(other: FractionIsh): boolean {
    other = new Fraction(other);

    return (
      this.numerator * other.denominator > other.numerator * this.denominator
    );
  }

  /**
   * Checks if the fraction is greater than or equal to `other`.
   * @param other - The value to compare with.
   * @returns True if the fraction is greater than or equal to `other`, false otherwise.
   * @throws If other is not a valid NumberIsh
   */
  public gte(other: FractionIsh): boolean {
    other = new Fraction(other);

    return (
      this.numerator * other.denominator >= other.numerator * this.denominator
    );
  }

  /**
   * Adds `other` to the fraction.
   * @param other - The value to add.
   * @returns A new Fraction representing the sum.
   * @throws If other is not a valid NumberIsh
   */
  public add(other: FractionIsh): Fraction {
    other = new Fraction(other);

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
   * @throws If other is not a valid NumberIsh
   */
  public sub(other: FractionIsh): Fraction {
    other = new Fraction(other);

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
   * @throws If other is not a valid NumberIsh
   */
  public mul(other: FractionIsh): Fraction {
    other = new Fraction(other);

    return new Fraction(
      this.numerator * other.numerator,
      this.denominator * other.denominator,
    );
  }

  /**
   * Divides the fraction by `other`.
   * @param other - The value to divide by.
   * @returns A new Fraction representing the quotient.
   * @throws
   *  1. If other is not a valid NumberIsh.
   *  2. other is zero.
   */
  public div(other: FractionIsh): Fraction {
    other = new Fraction(other);

    return new Fraction(
      this.numerator * other.denominator,
      other.numerator * this.denominator,
    );
  }

  /**
   * Converts the fraction to a fixed-point decimal string representation.
   * @param decimalPlaces - The number of decimal places to include. (default: 0)
   * @param opts.roundingMode - The rounding mode to apply.
   * @param opts.trailingZeros - Whether to keep the decimal part trailing zeros.
   * @returns The fixed-point decimal string representation of the fraction.
   */
  public toFixed(decimalPlaces = 0, opts?: ToFixedOption): string {
    if (decimalPlaces < 0)
      throw new Error(`'decimalPlaces' must be a  >= 0 integer.`);

    const roundingMode = opts?.roundingMode ?? CONFIG.roundingMode;
    const trailingZeros = opts?.trailingZeros ?? CONFIG.trailingZeros;

    return toFixed({
      numerator: this.numerator,
      denominator: this.denominator,
      decimalPlaces,
      roundingMode,
      trailingZeros,
    });
  }

  /**
   * Converts the fraction to a string representation with the specified significant digits.
   * @param significantDigits - The number of significant digits in the resulting string representation.
   * @param opts
   * @param opts.roundingMode - The rounding mode to be applied.
   * @returns The string representation of the fraction with the specified number of significant digits.
   */
  public toPrecision(
    significantDigits: number,
    opts?: ToPrecisionOption,
  ): string {
    if (significantDigits < 1)
      throw new Error(`'significantDigits' must be a  >= 1 integer.`);

    const roundingMode = opts?.roundingMode ?? CONFIG.roundingMode;

    return toPrecision({
      numerator: this.numerator,
      denominator: this.denominator,
      significantDigits,
      roundingMode,
    });
  }

  /**
   * Converts the fraction to a formatted string representation.
   * @param opts.decimalPlaces - The number of decimal places to include. (default: 0)
   * @param opts.roundingMode - The rounding mode to use. (optional)
   * @param opts.format - The format to apply. (optional)
   * @returns The formatted string representation of the fraction.
   */
  public toFormat(opts?: ToFormatOption): string {
    const format = opts?.format ?? {};

    const str = this.toFixed(opts?.decimalPlaces, {
      trailingZeros: opts?.trailingZeros,
      roundingMode: opts?.roundingMode,
    });

    return addSeparators(
      str,
      format.groupSize ?? CONFIG.format.groupSize,
      format.groupSeparator ?? CONFIG.format.groupSeparator,
      format.decimalSeparator ?? CONFIG.format.decimalSeparator,
    );
  }

  /**
   * Helper method for converting any super class back to a fraction
   * @returns A Fraction instance representing the current fraction.
   */
  public get asFraction(): Fraction {
    return new Fraction(this.numerator, this.denominator);
  }

  /**
   * Converts the Fraction object to a JSON representation for avoiding serialization errors.
   */
  public toJSON() {
    return {
      numerator: this.numerator.toString(),
      denominator: this.denominator.toString(),
    };
  }
}
