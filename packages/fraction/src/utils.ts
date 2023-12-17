import type { BigIntIsh } from './types';

export const isValidBigIntIsh = (value: BigIntIsh): boolean => {
  try {
    BigInt(value);
    return true;
  } catch (_) {
    return false;
  }
};
