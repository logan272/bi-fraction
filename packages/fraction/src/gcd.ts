import type { BigIntIsh } from './constants';

/**
 * Find the greatest common divisor(GCD) of `a` and `b`.
 *
 * It uses the Euclidean algorithm.
 * The time complexity of the Euclidean algorithm is O(log min(a, b)).
 *
 * @returns The sign is ignored, it always returns the positive gcd of `a` and `b`.
 */
export const gcd = (a: BigIntIsh, b: BigIntIsh): bigint => {
  a = BigInt(a);
  b = BigInt(b);

  if (b === 0n) return a;
  // make sure that gcd always returns a positive number
  if (a < 0n) a = -a;
  if (b < 0n) b = -b;

  return gcd(b, a % b);
};
