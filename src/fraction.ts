/* eslint-disable max-lines */

import { addSeparators } from './addSeparators';
import { gcd } from './gcd';
import { toExponential } from './toExponential';
import { toFixed } from './toFixed';
import { toPrecision } from './toPrecision';
import type { NumberIsh } from './types';

/**
 * The available rounding modes.
 *
 * The default rounding mode is `ROUND_HALF_UP`
 */
export enum RoundingMode {
  /**
   * Rounds away zero
   *
   * Examples:
   *  1. 3.1 rounds to 4
   *  2. -3.1 rounds to -4.
   *  3. 3.8 rounds to 4
   *  4. -3.8 rounds to -4.
   */
  ROUND_UP = 0,

  /**
   * Rounds towards zero
   *
   * Examples:
   *  1. 3.1 rounds to 3
   *  2. -3.1 rounds to -3.
   *  3. 3.8 rounds to 3
   *  4. -3.8 rounds to -3.
   */
  ROUND_DOWN = 1,

  /**
   * Rounds towards Infinity
   *
   * Examples:
   *  1. 3.1 rounds to 4
   *  2. -3.1 rounds to -3.
   *  3. 3.8 rounds to 4
   *  4. -3.8 rounds to -3.
   */
  ROUND_CEIL = 2,

  /**
   * Rounds towards -Infinity
   *
   * Examples:
   *  1. 3.1 rounds to 3
   *  2. -3.1 rounds to -4.
   *  3. 3.8 rounds to 3
   *  4. -3.8 rounds to -4.
   */
  ROUND_FLOOR = 3,

  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds away zero
   *
   * Examples:
   *  1. 3.1 rounds to 3
   *  2. -3.1 rounds to -3.
   *  3. 3.5 rounds to 4.
   *  4. -3.5 rounds to -4.
   *  5. 3.8 rounds to 4
   *  6. -3.8 rounds to -4.
   */
  ROUND_HALF_UP = 4,

  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards zero
   *
   * Examples:
   *  1. 3.1 rounds to 3
   *  2. -3.1 rounds to -3.
   *  3. 3.5 rounds to 3.
   *  4. -3.5 rounds to -3.
   *  5. 3.8 rounds to 4
   *  6. -3.8 rounds to -4.
   */
  ROUND_HALF_DOWN = 5,

  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards even neighbour
   *
   * Examples:
   *  1. 3.1 rounds to 3
   *  2. -3.1 rounds to -3.
   *  3. 3.5 rounds to 4.
   *  4. -3.5 rounds to -4.
   *  5. 2.5 rounds to 2.
   *  6. -2.5 rounds to -2.
   *  7. 3.8 rounds to 4
   *  8. -3.8 rounds to -4.
   */
  ROUND_HALF_EVEN = 6,

  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards Infinity
   *
   * Examples:
   *  1. 3.1 rounds to 3
   *  2. -3.1 rounds to -3.
   *  3. 3.5 rounds to 4.
   *  4. -3.5 rounds to -3.
   *  5. 3.8 rounds to 4
   *  6. -3.8 rounds to -4.
   */
  ROUND_HALF_CEIL = 7,

  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards -Infinity
   *
   * Examples:
   *  1. 3.1 rounds to 3
   *  2. -3.1 rounds to -3.
   *  3. 3.5 rounds to 3.
   *  4. -3.5 rounds to -4.
   *  5. 3.8 rounds to 4
   *  6. -3.8 rounds to -4.
   */
  ROUND_HALF_FLOOR = 8,
}

/**
 * Configuration options for the {@link Fraction } class.
 */
export type Config = {
  /**
   * The rounding mode to use when rounding the Fraction.
   * It only apply to methods that may incur rounding(irrational methods),
   * or converting to a or number/string representation.
   */

  roundingMode: RoundingMode;
  /**
   * The number of decimal places to round to.
   * It only apply to methods that may incur rounding(irrational methods),
   * or converting to a or number/string representation.
   */
  decimalPlaces: number;

  /**
   * The maximum number of decimal places preserved in the Fraction, it only apply to methods that incur rounding(irrational method).
   */
  maxDecimalPlaces: number;

  /**
   * The number of significant digits to preserve when calling the {@link Fraction.toPrecision | Fraction..toPrecision} method.
   */
  significantDigits: number;

  /**
   * Determines whether trailing zeros are preserved when converting the Fraction to a string representation.
   */
  trailingZeros: boolean;

  /**
   * Optional configuration for the {@link Fraction.toFixed | Fraction.toFixed} method.
   */
  toFixed?: {
    /**
     * The number of decimal places to round to.
     */
    decimalPlaces?: number;

    /**
     * The {@link RoundingMode | rounding mode} to be applied.
     */
    roundingMode?: RoundingMode;

    /**
     * Determines whether trailing zeros are preserved.
     */
    trailingZeros?: boolean;
  };

  /**
   * Optional configuration for the {@link Fraction.toPrecision | Fraction.toPrecision} method.
   */
  toPrecision?: {
    /**
     * The number of significant digits to preserve when using the toPrecision() method.
     */
    significantDigits?: number;

    /**
     * The rounding mode.
     */
    roundingMode?: RoundingMode;
  };

  /**
   * Optional configuration for the toExponential() method.
   */
  toExponential?: {
    /**
     * The number of decimal places to round to when using the toExponential() method.
     */
    decimalPlaces?: number;

    /**
     * The {@link RoundingMode | rounding mode} to be applied.
     */
    roundingMode?: RoundingMode;

    /**
     * Determines whether trailing zeros are preserved when using the toExponential() method.
     */
    trailingZeros?: boolean;
  };

  /**
   * Optional configuration for the toFormat() method.
   */
  toFormat?: {
    /**
     * The number of decimal places to round to when using the toFormat() method.
     */
    decimalPlaces?: number;

    /**
     * The {@link RoundingMode | rounding mode} to be applied.
     */
    roundingMode?: RoundingMode;

    /**
     * Determines whether trailing zeros are preserved.
     */
    trailingZeros?: boolean;

    /**
     * Formatting options for the {@link Fraction.toFormat | Fraction.toFormat} method.
     */
    format?: {
      /**
       * The grouping size of the integer part, default to `3`.
       */
      groupSize?: number;

      /**
       * The grouping separator of the integer part, default to `,`.
       */
      groupSeparator?: string;

      /**
       * The decimal separator, default to `.`.
       */
      decimalSeparator?: string;
    };
  };
};

/**
 * Default configuration options for the Fraction class.
 *
 * @see {@link Config}
 */
export const DEFAULT_CONFIG = {
  roundingMode: RoundingMode.ROUND_HALF_UP,
  decimalPlaces: 0,
  maxDecimalPlaces: 20,
  significantDigits: 1,
  trailingZeros: true,
  toFormat: {
    format: {
      groupSize: 3,
      groupSeparator: ',',
      decimalSeparator: '.',
    },
  },
} as const;

/**
 * Merges a partial configuration object with the default configuration.
 * @param c - The partial configuration object to merge.
 * @returns A configuration object with default values merged with the provided partial configuration.
 */
export const mergeWithDefaultConfig = (c: Partial<Config>): Config => {
  return {
    ...DEFAULT_CONFIG,
    ...c,
    toFormat: {
      ...c.toFormat,
      format: {
        ...DEFAULT_CONFIG.toFormat.format,
        ...c.toFormat?.format,
      },
    },
  };
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

  public static get config(): Config {
    return DEFAULT_CONFIG;
  }

  protected get config(): Config {
    return Fraction.config;
  }

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

    const s = typeof value === 'string' ? value.trim() : `${value}`;
    const [base, exp] = s.split('e');
    const [integer, decimal = ''] = base.split('.');

    if (!exp && !decimal) return [BigInt(integer), 1n];

    let d = 10n ** BigInt(decimal.length);
    let n = BigInt(integer);
    n = v > 0 ? n * d + BigInt(decimal) : n * d - BigInt(decimal);

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
    const x = Fraction.parse(numerator);
    const y = Fraction.parse(denominator ?? 1n);

    const n = x[0] * y[1];
    const d = x[1] * y[0];

    if (d === 0n) throw new Error('Division by zero');

    if (n === 0n) {
      this.numerator = 0n;
      this.denominator = 1n;
    } else if (d === 1n) {
      this.numerator = n;
      this.denominator = d;
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
   * new Fraction('123.789').quotient; // 123n
   * new Fraction('0.789').quotient; // 0n
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
   * const a = new Fraction(3, 2).remainder;
   * const b = new Fraction(1, 2);
   * a.eq(b); // true
   *
   * const c = new Fraction('123.789').remainder;
   * const d = new Fraction(123789 % 1000, 1000);
   * c.eq(d); // true
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
   * new Fraction('0.5').invert().eq(2); // true
   * new Fraction('0.25').invert().eq(4); // true
   * new Fraction(1, 3).invert().eq(3); // true
   * new Fraction(0).invert().eq(0); // true
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
   * @deprecated Use {@link Fraction.shl | Fraction.shl} instead.
   *
   * Expands the fraction by multiplying it by 10 raised to the specified decimal places.
   * @param decimals - The number of decimal places to expand.
   * @returns A new Fraction instance representing the expanded fraction.
   * @throws If n is not a positive integer.
   *
   * ```ts
   * new Fraction(1).expandDecimals(3).eq(1000); // true
   * new Fraction(1).expandDecimals(4).eq(1000); // true
   * new Fraction('123').expandDecimals(18).eq(123n * 10n ** 18n); // true
   * ```
   */
  public expandDecimals(decimals: number): Fraction {
    if (!Number.isInteger(decimals) || decimals < 0)
      throw new Error('`decimals` must be a > 0 integer');

    return this.mul(10n ** BigInt(decimals));
  }

  /**
   * @deprecated Use {@link Fraction.shl | Fraction.shr} instead.
   *
   * Normalizes the fraction by dividing it by 10 raised to the specified decimal places.
   * @param decimals - The number of decimal places to normalize.
   * @return A new Fraction instance representing the normalized fraction.
   * @returns A new Fraction representing the result of the left shift operation.
   * @throws If n is not a positive integer.
   *
   * ```ts
   * new Fraction(1000).normalizeDecimals(3).eq(1); // true
   * new Fraction(1000).normalizeDecimals(4).eq(0.1); // true
   * new Fraction('123e18').normalizeDecimals(18).eq(123); // true
   * ```
   */
  public normalizeDecimals(decimals: number): Fraction {
    if (!Number.isInteger(decimals) || decimals < 0)
      throw new Error('`decimals` must be a > 0 integer');

    return this.div(10n ** BigInt(decimals));
  }

  /**
   * (Shift Left) Shift the fraction left by n places.
   * @param n - The number of places to shift the Fraction by.
   * @returns A new Fraction representing the result of the left shift operation.
   * @throws If n is not a positive integer.
   *
   * ```ts
   * new Fraction(1).shl(3).eq(1000); // true
   * new Fraction(1).shl(4).eq(1000); // true
   * new Fraction('123').expandDecimals(18).eq(123n * 10n ** 18n); // true
   * ```
   */
  public shl(n: number): Fraction {
    if (!Number.isInteger(n) || n < 0)
      throw new Error('`n` must be a > 0 integer');

    return this.mul(10n ** BigInt(n));
  }

  /**
   * (Shift Right) Shift the fraction right by n places.
   * @param n - The number of positions to shift the Fraction by.
   * @returns A new Fraction representing the result of the right shift operation.
   * @throws If n is not a positive integer.
   *
   * ```ts
   * new Fraction(1000).shr(3).eq(1); // true
   * new Fraction(1000).shr(4).eq(0.1); // true
   * new Fraction('123e18').normalizeDecimals(18).eq(123); // true
   * ```
   */
  public shr(n: number): Fraction {
    if (!Number.isInteger(n) || n < 0)
      throw new Error('`n` must be a > 0 integer');

    return this.div(10n ** BigInt(n));
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
   * Checks if the fraction is an integer.
   * @returns True if the fraction is an integer, false otherwise.
   *
   * ```ts
   * new Fraction(1).isInteger(); // true
   * new Fraction(1.1).isInteger(); // false
   * ```
   */
  public isInteger(): boolean {
    return this.remainder.isZero();
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
   * @throws If `decimalPlaces` is not a positive integer.
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
  public toFixed(decimalPlaces?: number, opts?: Config['toFormat']): string {
    decimalPlaces =
      decimalPlaces ??
      opts?.decimalPlaces ??
      this.config?.toFixed?.decimalPlaces ??
      this.config.decimalPlaces;

    if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0)
      throw new Error('`decimalPlaces` must be a >= 0 integer.');

    const roundingMode =
      opts?.roundingMode ??
      this.config.toFixed?.roundingMode ??
      this.config.roundingMode;
    const trailingZeros =
      opts?.trailingZeros ??
      this.config.toFixed?.trailingZeros ??
      this.config.trailingZeros;

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
   * @throws If `significantDigits` is not a >= 1 integer.
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
    significantDigits?: number,
    opts?: Config['toPrecision'],
  ): string {
    significantDigits =
      significantDigits ??
      opts?.significantDigits ??
      this.config.toPrecision?.significantDigits ??
      this.config.significantDigits;

    if (!Number.isInteger(significantDigits) || significantDigits < 1)
      throw new Error(`'significantDigits' must be a  >= 1 integer.`);

    const roundingMode =
      opts?.roundingMode ??
      this.config.toPrecision?.roundingMode ??
      this.config.roundingMode;

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
   * @throws If `decimalPlaces` is not a positive integer.
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
  toExponential(
    decimalPlaces?: number,
    opts?: Config['toExponential'],
  ): string {
    decimalPlaces =
      decimalPlaces ??
      opts?.decimalPlaces ??
      this.config.toExponential?.decimalPlaces ??
      this.config.decimalPlaces;

    if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0)
      throw new Error('`decimalPlaces` must be a >= 0 integer.');

    const roundingMode =
      opts?.roundingMode ??
      this.config.toExponential?.roundingMode ??
      this.config.roundingMode;

    const trailingZeros =
      opts?.trailingZeros ??
      this.config.toExponential?.trailingZeros ??
      this.config.trailingZeros;

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
  public toFormat(opts?: Config['toFormat']): string {
    const decimalPlaces =
      opts?.decimalPlaces ??
      this.config.toFormat?.decimalPlaces ??
      this.config.decimalPlaces;

    const roundingMode =
      opts?.roundingMode ??
      this.config.toFormat?.roundingMode ??
      this.config.roundingMode;

    const trailingZeros =
      opts?.trailingZeros ??
      this.config.toFormat?.trailingZeros ??
      this.config.trailingZeros;

    const groupSize =
      opts?.format?.groupSize ??
      this.config.toFormat?.format?.groupSize ??
      DEFAULT_CONFIG.toFormat.format.groupSize;

    const groupSeparator =
      opts?.format?.groupSeparator ??
      this.config.toFormat?.format?.groupSeparator ??
      DEFAULT_CONFIG.toFormat.format.groupSeparator;

    const decimalSeparator =
      opts?.format?.decimalSeparator ??
      this.config.toFormat?.format?.decimalSeparator ??
      DEFAULT_CONFIG.toFormat.format.decimalSeparator;

    const str = this.toFixed(decimalPlaces, {
      trailingZeros,
      roundingMode,
    });

    return addSeparators(str, {
      groupSize,
      groupSeparator,
      decimalSeparator,
    });
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
