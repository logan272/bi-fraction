import { RoundingMode } from './fraction';

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
export const rounding = ({
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
