/* eslint-disable max-lines */

import { addSeparators } from './addSeparators';
import { gcd } from './gcd';
import { toExponential } from './toExponential';
import { toFixed } from './toFixed';
import { toPrecision } from './toPrecision';
import type { NumberIsh } from './types';

export enum RoundingMode {
  /**
   * Rounds away zero
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
   * If equidistant, rounds away zero
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

export type ToFormatOptions = {
  decimalPlaces?: number;
  roundingMode?: RoundingMode;
  trailingZeros?: boolean;
  format?: {
    /**
     * grouping size of the integer part
     **/
    groupSize?: number;
    /**
     * grouping separator of the integer part
     */
    groupSeparator?: string;
    /**
     * decimal separator
     */
    decimalSeparator?: string;
  };
};

export type ToFixedOptions = {
  roundingMode?: RoundingMode;
  trailingZeros?: boolean;
};

export type ToExponentialOptions = {
  roundingMode?: RoundingMode;
  trailingZeros?: boolean;
};

export type ToPrecisionOptions = {
  roundingMode?: RoundingMode;
};

/**
 * Represents Fraction or NumberIsh. A `NumberIsh` can be converted to a Fraction by calling `new Fraction(numerator: NumberIsh)`
 */
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
   * @param value - The value to parse.
   * @returns [bigint, bigint] representing the successfully parsed Fraction numerator and denominator.
   * @throws If value is not a valid NumberIsh.
   */
  private static parse(value: FractionIsh): [bigint, bigint] {
    if (value instanceof Fraction) return [value.numerator, value.denominator];
    if (typeof value === 'bigint') return [value, 1n];
    if (typeof value === 'number' && Number.isInteger(value))
      return [BigInt(value), 1n];

    const v = Number(value);

    if (Number.isNaN(v))
      throw new Error(`Cannot convert ${value} to a Fraction`);
    if (
      Number.isInteger(v) &&
      v <= Number.MAX_SAFE_INTEGER &&
      v >= Number.MAX_SAFE_INTEGER
    )
      return [BigInt(v), 1n];

    const s = typeof value === 'string' ? value.trim() : value.toString();
    const sign = v > 0 ? 1n : -1n;
    const [base, exp] = s.split('e');
    const [integer, decimal = ''] = base.split('.');
    let d = 10n ** BigInt(decimal.length);
    let n = BigInt(integer);
    n = n >= 0n ? n : -n;
    n = sign * (n * d + BigInt(decimal));

    if (exp) {
      const e = BigInt(exp);

      if (e >= 0n) {
        n *= 10n ** e;
      } else {
        d *= 10n ** -e;
      }
    }

    return [n, d];
  }

  /**
   * Tries to parse the given value as a Fraction
   * @param value - The value to parse.
   * @returns The parsed Fraction value, or undefined if `value` is not a valid NumberIsh.
   *
   * ```ts
   * const a = new Fraction('1.23');
   * const b = Fraction.tryParse('1.23');
   * a.eq(b); // true
   *
   * const c = Fraction.tryParse('abc');
   * c === undefined // true
   *
   * new Fraction('abc'); // throws
   * ```
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
   *
   * ```ts
   * const a = new Fraction(1.23);
   * const b = new Fraction('1.23');
   * const c = new Fraction(123, 100);
   * const d = new Fraction(123n, 100n);
   * const e = new Fraction(123n, 100n);
   * const f = new Fraction(1230n, 1000n);
   * const g = new Fraction(a);
   *
   * a.eq(b); // true
   * a.eq(c); // true
   * a.eq(d); // true
   * a.eq(e); // true
   * a.eq(f); // true
   * a.eq(g); // true
   *
   * new Fraction('abc'); // throws
   * new Fraction('invalid NumberIsh'); // throws
   * ```
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
   *
   * ```ts
   * new Fraction('123.789').quotient // 123n
   * new Fraction('0.789').quotient // 0n
   * ```
   */
  public get quotient(): bigint {
    return this.numerator / this.denominator;
  }

  /**
   * Gets the remainder of the fraction as a new Fraction instance.
   * @returns A Fraction instance representing the remainder of the division.
   *
   * ```ts
   * const a = new Fraction(3, 2).remainder
   * const b = new Fraction(1, 2);
   * a.eq(b) // true
   *
   * const c = new Fraction('123.789').remainder;
   * const d = new Fraction(123789 % 1000, 1000);
   * ```
   */
  public get remainder(): Fraction {
    return new Fraction(this.numerator % this.denominator, this.denominator);
  }

  /**
   * Inverts the fraction by swapping the numerator and denominator.
   * @returns The inverted fraction.
   *
   * ```ts
   * const a = new Fraction(1, 2);
   * const b = new Fraction(2, 1);
   * a.invert(b); // true;
   *
   * const c = new Fraction(0);
   * c.invert().eq(0)
   * ```
   */
  public invert(): Fraction {
    if (this.isZero()) return this;

    return new Fraction(this.denominator, this.numerator);
  }

  /**
   * Negates the sign of the Fraction.
   * @returns The Fraction with the sign inverted.
   *
   * ```ts
   * new Fraction('123').negate().eq('-123'); // true
   *
   * const a = new Fraction('123.456');
   * const b = new Fraction('-123.456');
   * a.negate().eq(b); // true
   * ```
   */
  public negate(): Fraction {
    return this.mul(-1);
  }

  /**
   * Returns the absolute value of the fraction.
   * @returns A new Fraction instance representing the absolute value of the fraction.
   *
   * ```ts
   * new Fraction('-123').abs().eq('123');
   * ```
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
   *
   * ```ts
   * new Fraction(1).expandDecimals(18).eq(10n ** 18n); // true
   * new Fraction(1).expandDecimals(6).eq(10n ** 6n); // true
   * ```
   */
  public expandDecimals(decimals: number): Fraction {
    return this.mul(10n ** BigInt(decimals));
  }

  /**
   * Normalizes the fraction by dividing it by 10 raised to the specified decimal places.
   * @param decimals - The number of decimal places to normalize.
  @return A new Fraction instance representing the normalized fraction.

   * ```ts
   * new Fraction('1e20').normalizeDecimals(18).eq(100); // true
   * new Fraction('1.23e20').expandDecimals(6).eq('1.23e14'); // true
   * ```
   */
  public normalizeDecimals(decimals: number): Fraction {
    return this.div(10n ** BigInt(decimals));
  }

  /**
   * Checks if the fraction is zero.
   * @returns True if the fraction is zero, false otherwise.
   *
   * ```ts
   * new Fraction(0).isZero(); // true
   * new Fraction(100).isZero(); // false
   * ```
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
   *
   * ```ts
   * new Fraction('123.567').toFixed(); // '124'
   * new Fraction('123.567', { roundingMode: RoundingMode.ROUND_HALF_DOWN }).toFixed(); // '123'
   * new Fraction('123.567').toFixed(1); // '123.6'
   * new Fraction('123.567').toFixed(2); // '123.57'
   * new Fraction('123.567', { roundingMode: RoundingMode.ROUND_DOWN } ).toFixed(2); // '123.56'
   * new Fraction('123.567').toFixed(3); // '123.567'
   * new Fraction('123.567').toFixed(4); // '123.5670'
   * new Fraction('123.567').toFixed(5); // '123.56700'
   * new Fraction('123.567').toFixed(5, { trailingZeros: false }); // '123.567'
   * ```
   */
  public toFixed(decimalPlaces = 0, opts?: ToFixedOptions): string {
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
   * @param opts.roundingMode - The rounding mode to be applied.
   * @returns The string representation of the fraction with the specified number of significant digits.
   *
   * ```ts
   * new Fraction('1234.567').toPrecision(1); // '1000'
   * new Fraction('1234.567').toPrecision(2); // '1200'
   * new Fraction('1234.567').toPrecision(3); // '1230'
   * new Fraction('1234.567').toPrecision(4); // '1235'
   * new Fraction('1234.567').toPrecision(4, { roundingMode: RoundingMode.ROUND_DOWN }); // '1234'
   * new Fraction('1234.567').toPrecision(5); // '1234.6'
   * new Fraction('1234.567').toPrecision(6); // '1234.57'
   * new Fraction('1234.567').toPrecision(7); // '1234.567'
   * new Fraction('1234.567').toPrecision(8); // '1234.5670'
   * new Fraction('1234.567').toPrecision(9); // '1234.56700'
   * ```
   */
  public toPrecision(
    significantDigits: number,
    opts?: ToPrecisionOptions,
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
   * Converts a Fraction to a string of exponential representation.
   * @param decimalPlaces - The number of decimal places in the resulting string.
   * @param opts.roundingMode - The rounding mode to be applied.
   * @param opts.trailingZeros - Whether to keep the decimal part trailing zeros.
   * @returns The string of exponential representation of the fraction.
   *
   * ```ts
   * new Fraction(0).toExponential() // '0e+0'
   * new Fraction(0).toExponential(1) // '0.0e+0'
   * new Fraction('0.0000001234').toExponential(4) // '1.2340e-7'
   * new Fraction(1234.5678).toExponential(1) // '1.2e+3'
   * new Fraction(-1234.5678).toExponential(1) // '-1.2e+3'
   * new Fraction(1234.5678).toExponential(3) // '1.235e+3'
   * new Fraction(1234.5678).toExponential(5) // '1.23457e+3'
   * new Fraction(10n ** 100n).toExponential(2) // '1.00e+100'
   * ```
   */
  toExponential(decimalPlaces = 0, opts?: ToExponentialOptions): string {
    const roundingMode = opts?.roundingMode ?? CONFIG.roundingMode;
    const trailingZeros = opts?.trailingZeros ?? CONFIG.trailingZeros;

    return toExponential({
      numerator: this.numerator,
      denominator: this.denominator,
      decimalPlaces,
      roundingMode,
      trailingZeros,
    });
  }

  /**
   * Converts the fraction to a formatted string representation.
   * @param opts.decimalPlaces - The number of decimal places to include. (default: 0)
   * @param opts.roundingMode - The rounding mode to use. (optional)
   * @param opts.format - The format to apply. (optional)
   * @returns The formatted string representation of the fraction.
   *
   * ```ts
   * new Fraction('1234.567').toFormat(); // '123,5'
   * new Fraction('1234.567').toFormat({ decimalPlaces: 1, format: { groupSeparator: '-' } }); // '123-4.6'
   * new Fraction('1234.567', {}).toFormat({ decimalPlaces: 1 }); // '123,4.6'
   * new Fraction('1234.567', {}).toFormat({ decimalPlaces: 1, roundingMode: RoundingMode.ROUND_DOWN }); // '123,4.5'
   * ```
   */
  public toFormat(opts?: ToFormatOptions): string {
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
