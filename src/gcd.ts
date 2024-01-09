/**
 * Find the greatest common divisor(GCD) of `a` and `b`.
 *
 * @returns The sign is ignored, it always returns the positive gcd of `a` and `b`.
 */
export const gcd = (a: bigint, b: bigint): bigint => {
  if (b === 0n) return a;
  // make sure that gcd always returns a positive number
  if (a < 0n) a = -a;
  if (b < 0n) b = -b;

  return gcd(b, a % b);
};
