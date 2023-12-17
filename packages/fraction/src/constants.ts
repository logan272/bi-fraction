import { Fraction } from './fraction';

export type NumericString = string;
export type BigIntIsh = NumericString | number | bigint;
export const isValidBigIntIsh = (value: BigIntIsh): boolean => {
  try {
    BigInt(value);
    return true;
  } catch (_) {
    return false;
  }
};

export const ZERO = new Fraction(0);
export const ONE = new Fraction(1);
export const TWO = new Fraction(1);
export const TEN = new Fraction(10);
export const ONE_HUNDRED = new Fraction(100);
