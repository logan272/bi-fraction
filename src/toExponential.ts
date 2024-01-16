import type { RoundingMode } from './fraction';
import { toFixed } from './toFixed';

/**
 * Converts a fraction represented by `numerator` and `denominator` to a exponential string representation.
 * @param numerator - The numerator of the fraction.
 * @param denominator - The denominator of the fraction.
 * @param decimalPlaces - The number of decimal places in the resulting string.
 * @param roundingMode - The rounding mode to be applied.
 * @returns The string representation of the fraction with the specified number of significant digits.
 */
export const toExponential = ({
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
}): string => {
  const isPositive = numerator * denominator >= 0n;
  let n = numerator > 0n ? numerator : -numerator;
  let d = denominator > 0n ? denominator : -denominator;

  let e = 0; // the exponential

  if (n !== 0n && n < d) {
    while (n < d) {
      n *= 10n;
      e -= 1;
    }
  } else if (n >= 10n * d) {
    while (n >= 10n * d) {
      d *= 10n;
      e += 1;
    }
  } else {
    // empty block
  }

  let s = toFixed({
    numerator: n,
    denominator: d,
    decimalPlaces,
    roundingMode,
    trailingZeros,
  });

  s = isPositive ? s : `-${s}`;

  return e >= 0 ? `${s}e+${e}` : `${s}e${e}`;
};
