import BigNumberJs from 'bignumber.js';

import { ONE_HUNDRED } from './constants';
import { Fraction } from './fraction';
import type { BigIntIsh } from './types';

/**
 * Represents a percentage value.
 */
export class Percent extends Fraction {
  /**
   * This boolean prevents a fraction from being interpreted as a Percent.
   */
  public readonly isPercent = true as const;

  /**
   * Creates a Percent instance from a fraction.
   *
   * @param fraction - The fraction to convert.
   * @returns A Percent instance representing the converted fraction.
   */
  static from(fraction: Fraction): Percent {
    return new Percent(fraction.numerator, fraction.denominator);
  }

  /** {@inheritDoc Fraction.add} */
  public override add(other: Fraction | BigIntIsh): Percent {
    return Percent.from(super.add(other));
  }

  /** {@inheritDoc Fraction.sub} */
  public override sub(other: Fraction | BigIntIsh): Percent {
    return Percent.from(super.sub(other));
  }

  /** {@inheritDoc Fraction.mul} */
  public override mul(other: Fraction | BigIntIsh): Percent {
    return Percent.from(super.mul(other));
  }

  /** {@inheritDoc Fraction.div} */
  public override div(other: Fraction | BigIntIsh): Percent {
    return Percent.from(super.div(other));
  }

  /** {@inheritDoc Fraction.toFixed} */
  public override toFixed(
    decimalPlaces = 2,
    roundingMode?: BigNumberJs.RoundingMode,
  ): string {
    return super.mul(ONE_HUNDRED).toFixed(decimalPlaces, roundingMode);
  }

  /** {@inheritDoc Fraction.toFormat} */
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
