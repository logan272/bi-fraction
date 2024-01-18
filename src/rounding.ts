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
    x = decimalPart + 1n;
  } else if (roundingMode === RoundingMode.ROUND_DOWN) {
    x = decimalPart;
  } else if (roundingMode === RoundingMode.ROUND_CEIL) {
    x = isPositive ? decimalPart + 1n : decimalPart;
  } else if (roundingMode === RoundingMode.ROUND_FLOOR) {
    x = isPositive ? decimalPart : decimalPart + 1n;
  } else if (roundingMode === RoundingMode.ROUND_HALF_UP) {
    x = nextDigit < 5n ? decimalPart : decimalPart + 1n;
  } else if (roundingMode === RoundingMode.ROUND_HALF_DOWN) {
    x = nextDigit <= 5n ? decimalPart : decimalPart + 1n;
  } else if (roundingMode === RoundingMode.ROUND_HALF_EVEN) {
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
    if (nextDigit < 5n) {
      x = decimalPart;
    } else if (nextDigit === 5n) {
      x = isPositive ? decimalPart + 1n : decimalPart;
    } else {
      x = decimalPart + 1n;
    }
  } else {
    if (nextDigit < 5n) {
      x = decimalPart;
    } else if (nextDigit === 5n) {
      x = isPositive ? decimalPart : decimalPart + 1n;
    } else {
      x = decimalPart + 1n;
    }
  }

  const y = 10n ** BigInt(decimalPlaces);
  const carry = x / y;

  let decimalPartStr = '';
  if (decimalPlaces > 0) {
    decimalPartStr = `${x % y}`.padStart(decimalPlaces, '0');
  }

  return [carry, decimalPartStr];
};
