/**
 * Find the greatest common divisor(GCD) of `a` and `b`.
 *
 * @returns The sign is ignored, it always returns the positive gcd of `a` and `b`.
 */
export const gcd = (a: bigint, b: bigint): bigint => {
  // Make sure that gcd always operates with and returns positive numbers
  if (a < 0n) a = -a;
  if (b < 0n) b = -b;

  while (b !== 0n) {
    const temp = b;
    b = a % b;
    a = temp;
  }

  return a;
};
