import type { RoundingMode } from './fraction';
import { rounding } from './rounding';
import { toFixed } from './toFixed';

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

  if (10n ** BigInt(significantDigits) > q) {
    return toFixed({
      numerator,
      denominator,
      decimalPlaces: significantDigits - sdc,
      roundingMode,
      trailingZeros: true,
    });
  }

  const diff = sdc - significantDigits;
  const factor = 10n ** BigInt(diff);
  const integerPart = q / factor;
  const nextDigit = (q % factor) / (factor / 10n);

  const [carry] = rounding({
    integerPart,
    decimalPart: 0n,
    nextDigit,
    roundingMode,
    decimalPlaces: 0,
    isPositive,
  });

  return `${(integerPart + carry) * factor}`;
};
