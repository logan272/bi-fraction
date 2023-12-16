import BigNumberJs from 'bignumber.js';

import { type BigIntIsh, ONE_HUNDRED } from './constants';
import { Fraction } from './fraction';

export class Percent extends Fraction {
  /**
   * This boolean prevents a fraction from being interpreted as a Percent
   */
  public readonly isPercent = true as const;

  /**
   * Create a Percent from a fraction
   * @param fraction the fraction to convert
   */
  static from(fraction: Fraction): Percent {
    return new Percent(fraction.numerator, fraction.denominator);
  }

  public override add(other: Fraction | BigIntIsh): Percent {
    return Percent.from(super.add(other));
  }

  public override sub(other: Fraction | BigIntIsh): Percent {
    return Percent.from(super.sub(other));
  }

  public override mul(other: Fraction | BigIntIsh): Percent {
    return Percent.from(super.mul(other));
  }

  public override div(other: Fraction | BigIntIsh): Percent {
    return Percent.from(super.div(other));
  }

  public override toFixed(
    decimalPlaces = 2,
    roundingMode?: BigNumberJs.RoundingMode,
  ): string {
    return super.mul(ONE_HUNDRED).toFixed(decimalPlaces, roundingMode);
  }

  public override toFormat(
    decimalPlaces = 2,
    roundingMode?: BigNumberJs.RoundingMode,
    format?: BigNumberJs.Format,
  ): string {
    return super
      .mul(ONE_HUNDRED)
      .toFormat(
        decimalPlaces,
        roundingMode ?? BigNumberJs.ROUND_HALF_UP,
        format,
      );
  }
}
