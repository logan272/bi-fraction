/* eslint-disable max-lines */
import type BigNumberJs from 'bignumber.js';

import type { Format } from './bn';
import { Bn, DEFAULT_ROUNDING_MODE, RoundingMode } from './bn';
import { gcd } from './gcd';
import type { NumberIsh } from './types';

export type ToFormatOptions = {
  decimalPlaces?: number;
  roundingMode?: RoundingMode;
  trailingZeros?: boolean;
  format?: Format;
};

export type ToFixedOption = {
  roundingMode?: RoundingMode;
  trailingZeros?: boolean;
};

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
    roundingMode: RoundingMode = DEFAULT_ROUNDING_MODE,
  ): string {
    return Bn(this.numerator.toString())
      .div(this.denominator.toString())
      .precision(significantDigits, roundingMode as BigNumberJs.RoundingMode)
      .toString();
  }

  // /**
  //  * Converts the fraction to a fixed-point decimal string representation.
  //  * @param decimalPlaces - The number of decimal places to include. (default: 0)
  //  * @param roundingMode - The rounding mode to use. (optional)
  //  * @returns The fixed-point decimal string representation of the fraction.
  //  */
  // public toFixed(
  //   decimalPlaces = 0,
  //   roundingMode: RoundingMode = DEFAULT_ROUNDING_MODE,
  // ): string {
  //   return Bn(this.numerator.toString())
  //     .div(this.denominator.toString())
  //     .toFixed(decimalPlaces, roundingMode as BigNumberJs.RoundingMode);
  // }

  /**
   * Converts the fraction to a fixed-point decimal string representation.
   * @param dp - The number of decimal places to include. (default: 0)
   * @param opts - The optional config object.
   * @returns The fixed-point decimal string representation of the fraction.
   */
  public toFixed(decimalPlaces = 0, opts?: ToFixedOption): string {
    if (decimalPlaces < 0) throw new Error('invalid decimalPlaces');
    const roundingMode = opts?.roundingMode ?? DEFAULT_ROUNDING_MODE;
    const trailingZeros = opts?.trailingZeros ?? true;

    const abs = this.abs();
    const d = abs.denominator;
    const isPositive = this.gte(0);

    let r = abs.numerator % d;

    let i = 0;
    let decimalPartStr = '';

    while (r > 0n && i < decimalPlaces) {
      const v = r * 10n;
      decimalPartStr += v / d;
      r = v % d;
      i += 1;
    }

    let carry = 0n;

    if (decimalPartStr.length < decimalPlaces) {
      if (trailingZeros) {
        decimalPartStr = decimalPartStr.padEnd(decimalPlaces, '0');
      }
    } else {
      const nextDigit = (r * 10n) / d;

      if (nextDigit > 0n) {
        const decimalPart = BigInt(decimalPartStr);

        const x = this.handleRounding({
          integerPart: abs.quotient,
          decimalPart,
          decimalPlaces: decimalPlaces,
          nextDigit,
          roundingMode,
          isPositive,
        });

        const y = 10n ** BigInt(decimalPlaces);
        carry = x / y;

        decimalPartStr =
          decimalPlaces === 0 ? '' : `${x % y}`.padStart(decimalPlaces, '0');
      }
    }

    const integerPart = abs.quotient + carry;

    decimalPartStr = decimalPartStr
      ? `${integerPart}.${decimalPartStr}`
      : `${integerPart}`;

    return isPositive ? decimalPartStr : `-${decimalPartStr}`;
  }

  private handleRounding(opts: {
    integerPart: bigint;
    decimalPart: bigint;
    decimalPlaces: number;
    nextDigit: bigint;
    roundingMode: RoundingMode;
    isPositive: boolean;
  }): bigint {
    const {
      integerPart,
      decimalPart,
      decimalPlaces,
      nextDigit,
      roundingMode,
      isPositive,
    } = opts;

    // (0) ROUND_UP
    // Rounds away from zero
    if (roundingMode === RoundingMode.ROUND_UP) {
      return decimalPart + 1n;
    }

    // (1) ROUND_DOWN
    // Rounds towards from zero
    if (roundingMode === RoundingMode.ROUND_DOWN) {
      return decimalPart;
    }

    // (2) ROUND_CEIL
    // Rounds towards Infinity
    if (roundingMode === RoundingMode.ROUND_CEIL) {
      return isPositive ? decimalPart + 1n : decimalPart;
    }

    // (3) ROUND_FLOOR
    // Rounds towards -Infinity
    if (roundingMode === RoundingMode.ROUND_FLOOR) {
      return isPositive ? decimalPart : decimalPart + 1n;
    }

    // (4) ROUND_HALF_UP
    // Rounds towards nearest neighbour. If equidistant, rounds away from zero
    if (roundingMode === RoundingMode.ROUND_HALF_UP) {
      return nextDigit >= 5 ? decimalPart + 1n : decimalPart;
    }

    // (5) ROUND_HALF_DOWN
    // Rounds towards nearest neighbour. If equidistant, rounds towards zero
    if (roundingMode === RoundingMode.ROUND_HALF_DOWN) {
      return nextDigit > 5 ? decimalPart + 1n : decimalPart;
    }

    // (6) ROUND_HALF_EVEN
    // Rounds towards nearest neighbour. If equidistant, rounds towards even neighbour
    if (roundingMode === RoundingMode.ROUND_HALF_EVEN) {
      // check if the last digit is event
      const isEvent =
        decimalPlaces === 0 ? integerPart % 2n === 0n : decimalPart % 2n === 0n;

      if (nextDigit < 5n) return decimalPart;
      if (nextDigit === 5n) return isEvent ? decimalPart : decimalPart + 1n;
      return decimalPart + 1n;
    }

    // (7) ROUND_HALF_CEIL
    // Rounds towards nearest neighbour. If equidistant, rounds towards Infinity
    if (roundingMode === RoundingMode.ROUND_HALF_CEIL) {
      if (nextDigit < 5n) return decimalPart;
      if (nextDigit === 5n) return isPositive ? decimalPart + 1n : decimalPart;
      return decimalPart + 1n;
    }

    // (8) ROUND_HALF_FLOOR
    // Rounds towards nearest neighbour. If equidistant, rounds towards -Infinity
    if (roundingMode === RoundingMode.ROUND_HALF_FLOOR) {
      if (nextDigit < 5n) return decimalPart;
      if (nextDigit === 5n) return isPositive ? decimalPart : decimalPart + 1n;
      return decimalPart + 1n;
    }

    throw new Error('Unreachable');
  }

  /**
   * Checks if the fraction is an integer
   */
  public isInteger(): boolean {
    return this.numerator % this.denominator === 0n;
  }

  // /**
  //  * Finds the recurring decimal part of the Fraction
  //  *
  //  * @returns
  //  *  1. The recurring decimal part of the fraction, if the Fraction is a recurring decimal
  //  *  2. `undefined`, if the Fraction is not a recurring decimal
  //  */
  // private getRecurringDecimal(): string | undefined {
  //   if (this.isInteger()) return undefined;

  //   const remainderMap = new Map();

  //   let n = this.numerator;
  //   const d = this.denominator;
  //   let q = n / d;
  //   let r = n % d;

  //   let decimal = '';

  //   while (r !== 0n && !remainderMap.has(r)) {
  //     remainderMap.set(r, decimal.length);

  //     n = r * 10n;
  //     q = n / d;
  //     r = n % d;
  //     decimal += q.toString();
  //   }

  //   return r !== 0n ? decimal.slice(remainderMap.get(r)) : undefined;
  // }

  // /**
  //  * Checks if the fraction is a recurring decimal
  //  */
  // private isRecurringDecimal() {
  //   return this.getRecurringDecimal() !== undefined;
  // }

  /**
   * Converts the fraction to a formatted string representation.
   * @param opts.decimalPlaces - The number of decimal places to include. (default: 0)
   * @param opts.roundingMode - The rounding mode to use. (optional)
   * @param opts.format - The format to apply. (optional)
   * @returns The formatted string representation of the fraction.
   */
  public toFormat(opts?: ToFormatOptions): string {
    const format = opts?.format ?? {};

    const str = this.toFixed(opts?.decimalPlaces, {
      trailingZeros: opts?.trailingZeros,
      roundingMode: opts?.roundingMode,
    });

    return this.addSeparator(
      str,
      format.groupSize ?? 3,
      format.groupSeparator ?? ',',
      format.decimalSeparator ?? '.',
    );
  }

  private addSeparator(
    str: string,
    groupSize: number,
    groupSeparator: string,
    decimalSeparator: string,
  ): string {
    const parts = str.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || '';

    let formattedIntegerPart = '';
    let counter = 0;

    for (let i = integerPart.length - 1; i >= 0; i--) {
      formattedIntegerPart = integerPart[i] + formattedIntegerPart;
      counter++;

      if (counter === groupSize && i !== 0) {
        formattedIntegerPart = groupSeparator + formattedIntegerPart;
        counter = 0;
      }
    }

    return decimalPart
      ? formattedIntegerPart + decimalSeparator + decimalPart
      : formattedIntegerPart;
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
