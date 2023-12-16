import type { BigIntIsh } from '@web3-kit/fraction';
import { Fraction } from '@web3-kit/fraction';
import BigNumberJs from 'bignumber.js';
import invariant from 'tiny-invariant';

import { MaxUint256 } from './constants';
import type { Currency } from './currency';

export class CurrencyAmount<T extends Currency> extends Fraction {
  public readonly currency: T;
  public readonly decimalScale: bigint;

  protected constructor(
    currency: T,
    numerator: BigIntIsh,
    denominator?: BigIntIsh,
  ) {
    super(numerator, denominator);
    invariant(this.quotient <= MaxUint256, 'AMOUNT');
    this.currency = currency;
    this.decimalScale = 10n ** BigInt(currency.decimals);
  }

  public override add(other: CurrencyAmount<T>): CurrencyAmount<T> {
    // It only make sense to add the amounts of the same currency.
    invariant(this.currency.eq(other.currency), 'CURRENCY');
    const added = super.add(other);
    return new CurrencyAmount(
      this.currency,
      added.numerator,
      added.denominator,
    );
  }

  public override sub(other: CurrencyAmount<T>): CurrencyAmount<T> {
    // It only make sense to sub the amounts of the same currency.
    invariant(this.currency.eq(other.currency), 'CURRENCY');
    const subtracted = super.sub(other);
    return new CurrencyAmount(
      this.currency,
      subtracted.numerator,
      subtracted.denominator,
    );
  }

  public override mul(other: Fraction | BigIntIsh): CurrencyAmount<T> {
    const multiplied = super.mul(other);
    return new CurrencyAmount(
      this.currency,
      multiplied.numerator,
      multiplied.denominator,
    );
  }

  public override div(other: Fraction | BigIntIsh): CurrencyAmount<T> {
    const divided = super.div(other);
    return new CurrencyAmount(
      this.currency,
      divided.numerator,
      divided.denominator,
    );
  }

  public override toFixed(
    decimalPlaces: number = this.currency.decimals,
    roundingMode?: BigNumberJs.RoundingMode,
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS');
    return super.div(this.decimalScale).toFixed(decimalPlaces, roundingMode);
  }

  public override toFormat(
    decimalPlaces: number = this.currency.decimals,
    roundingMode?: BigNumberJs.RoundingMode,
    format?: BigNumberJs.Format,
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS');
    return super
      .div(this.decimalScale)
      .toFormat(
        decimalPlaces,
        roundingMode ?? BigNumberJs.ROUND_HALF_UP,
        format,
      );
  }
}
