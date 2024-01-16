import type { RoundingMode } from './fraction';
import { rounding } from './rounding';
import { toFixed } from './toFixed';

/**
 * Converts a fraction represented by `numerator` and `denominator` to a string representation with the specified number of significant digits.
 * @param numerator - The numerator of the fraction.
 * @param denominator - The denominator of the fraction.
 * @param significantDigits - The number of significant digits in the resulting string representation.
 * @param roundingMode - The rounding mode to be applied.
 * @returns The string representation of the fraction with the specified number of significant digits.
 */
export const toPrecision = ({
  numerator,
  denominator,
  significantDigits,
  roundingMode,
}: {
  numerator: bigint;
  denominator: bigint;
  significantDigits: number;
  roundingMode: RoundingMode;
}): string => {
  const isPositive = numerator * denominator >= 0n;
  const isZero = numerator === 0n;
  const n = numerator > 0n ? numerator : -numerator;
  const d = denominator > 0n ? denominator : -denominator;
  const q = n / d; // quotient;

  // the significant digit count(sdc) of the integer part
  let sdc: number = 0;
  let i = q;

  while (i !== 0n) {
    sdc += 1;
    i /= 10n;
  }

  if (isZero) sdc = 1;

  if (10n ** BigInt(significantDigits) > q) {
    return toFixed({
      numerator,
      denominator,
      decimalPlaces: significantDigits - sdc,
      roundingMode,
      trailingZeros: true,
    });
  }

  const x = 10n ** BigInt(sdc - significantDigits);
  const integerPart = q / x;
  const nextDigit = (q % x) / (x / 10n);

  const [carry] = rounding({
    integerPart,
    decimalPart: 0n,
    nextDigit,
    roundingMode,
    decimalPlaces: 0,
    isPositive,
  });

  return `${(integerPart + carry) * x}`;
};
