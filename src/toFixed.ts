import { RoundingMode } from './fraction';

/**
 * Converts a fraction represented by `numerator` and `denominator` to a fixed-point decimal representation with the specified number of decimal places and rounding mode.
 * @param numerator - The numerator of the fraction.
 * @param denominator - The denominator of the fraction.
 * @param decimalPlaces - The number of decimal places in the fixed-point decimal representation.
 * @param roundingMode - The rounding mode to be applied.
 * @param trailingZeros - Indicates whether trailing zeros should be included in the result.
 * @returns The fixed-point decimal representation of the fraction as a string.
 */
export const toFixed = ({
  numerator,
  denominator,
  decimalPlaces,
  roundingMode,
  trailingZeros,
}: {
  numerator: bigint;
  denominator: bigint;
  decimalPlaces: number;
  roundingMode: RoundingMode;
  trailingZeros: boolean;
}) => {
  const isPositive = numerator * denominator >= 0n;
  const n = numerator > 0n ? numerator : -numerator;
  const d = denominator > 0n ? denominator : -denominator;
  const q = n / d; // quotient;

  let r = n % d; // reminder
  let carry = 0n;
  let decimalPartStr = '';

  let i = 0;
  while (r > 0n && i < decimalPlaces) {
    const v = r * 10n;
    decimalPartStr += v / d;
    r = v % d;
    i += 1;
  }

  if (r === 0n || decimalPartStr.length < decimalPlaces) {
    if (trailingZeros) {
      decimalPartStr = decimalPartStr.padEnd(decimalPlaces, '0');
    }
  } else {
    [carry, decimalPartStr] = handleRounding({
      integerPart: q,
      decimalPart: BigInt(decimalPartStr),
      decimalPlaces,
      nextDigit: (r * 10n) / d,
      roundingMode,
      isPositive,
    });
  }

  const integerPart = q + carry;

  const str = decimalPartStr
    ? `${integerPart}.${decimalPartStr}`
    : `${integerPart}`;

  return isPositive ? str : `-${str}`;
};

type Carry = bigint;
type DecimalPartStr = string;

/**
 * Handles rounding for the decimal part of a number during conversion to fixed-point decimal representation.
 * @param integerPart - The integer part of the number.
 * @param decimalPart - The decimal part of the number.
 * @param decimalPlaces - The number of decimal places in the fixed-point decimal representation.
 * @param nextDigit - The next digit of the decimal.
 * @param roundingMode - The rounding mode to be applied.
 * @param isPositive - Indicates whether the number is positive.
 * @returns A tuple containing the carry and the updated decimal part as a string.
 */
const handleRounding = ({
  integerPart,
  decimalPart,
  decimalPlaces,
  nextDigit,
  roundingMode,
  isPositive,
}: {
  integerPart: bigint;
  decimalPart: bigint;
  decimalPlaces: number;
  nextDigit: bigint;
  roundingMode: RoundingMode;
  isPositive: boolean;
}): [Carry, DecimalPartStr] => {
  let x: bigint;

  if (roundingMode === RoundingMode.ROUND_UP) {
    // (0) ROUND_UP
    // Rounds away from zero
    x = decimalPart + 1n;
  } else if (roundingMode === RoundingMode.ROUND_DOWN) {
    // (1) ROUND_DOWN
    // Rounds towards from zero
    x = decimalPart;
  } else if (roundingMode === RoundingMode.ROUND_CEIL) {
    // (2) ROUND_CEIL
    // Rounds towards Infinity
    x = isPositive ? decimalPart + 1n : decimalPart;
  } else if (roundingMode === RoundingMode.ROUND_FLOOR) {
    // (3) ROUND_FLOOR
    // Rounds towards -Infinity
    x = isPositive ? decimalPart : decimalPart + 1n;
  } else if (roundingMode === RoundingMode.ROUND_HALF_UP) {
    // (4) ROUND_HALF_UP
    // Rounds towards nearest neighbour. If equidistant, rounds away from zero
    x = nextDigit < 5 ? decimalPart : decimalPart + 1n;
  } else if (roundingMode === RoundingMode.ROUND_HALF_DOWN) {
    // (5) ROUND_HALF_DOWN
    // Rounds towards nearest neighbour. If equidistant, rounds towards zero
    x = nextDigit <= 5 ? decimalPart : decimalPart + 1n;
  } else if (roundingMode === RoundingMode.ROUND_HALF_EVEN) {
    // (6) ROUND_HALF_EVEN
    // Rounds towards nearest neighbour. If equidistant, rounds towards even neighbour
    // check if the last digit is event
    const isEvent =
      decimalPlaces === 0 ? integerPart % 2n === 0n : decimalPart % 2n === 0n;

    if (nextDigit < 5n) {
      x = decimalPart;
    } else if (nextDigit === 5n) {
      x = isEvent ? decimalPart : decimalPart + 1n;
    } else {
      x = decimalPart + 1n;
    }
  } else if (roundingMode === RoundingMode.ROUND_HALF_CEIL) {
    // (7) ROUND_HALF_CEIL
    // Rounds towards nearest neighbour. If equidistant, rounds towards Infinity
    if (nextDigit < 5n) {
      x = decimalPart;
    } else if (nextDigit === 5n) {
      x = isPositive ? decimalPart + 1n : decimalPart;
    } else {
      x = decimalPart + 1n;
    }
  } else {
    // (8) ROUND_HALF_FLOOR
    // Rounds towards nearest neighbour. If equidistant, rounds towards -Infinity
    if (nextDigit < 5n) {
      x = decimalPart;
    } else if (nextDigit === 5n) {
      x = isPositive ? decimalPart : decimalPart + 1n;
    } else {
      x = decimalPart + 1n;
    }
  }

  const factor = 10n ** BigInt(decimalPlaces);
  const carry = x / factor;

  let decimalPartStr = '';
  if (decimalPlaces > 0) {
    decimalPartStr = `${x % factor}`.padStart(decimalPlaces, '0');
  }

  return [carry, decimalPartStr];
};

/**
 * Finds the recurring decimal part of the Fraction
 *
 * @returns
 *  1. The recurring decimal part of the fraction, if the Fraction is a recurring decimal
 *  2. `undefined`, if the Fraction is not a recurring decimal
 */
export const getRecurringDecimal = (
  numerator: bigint,
  denominator: bigint,
): string | undefined => {
  const remainderMap = new Map();

  let n = numerator;
  const d = denominator;
  let q = n / d;
  let r = n % d;

  let decimal = '';

  while (r !== 0n && !remainderMap.has(r)) {
    remainderMap.set(r, decimal.length);

    n = r * 10n;
    q = n / d;
    r = n % d;
    decimal += q.toString();
  }

  return r !== 0n ? decimal.slice(remainderMap.get(r)) : undefined;
};
