export type BigIntIsh = string | number | bigint;
export type BigNumberIsh = string | number | bigint;

/**
 * Checks if a value is a valid BigIntIsh.
 * @param value - The value to check.
 * @returns True if the value is a valid BigIntIsh, false otherwise.
 */
export const isValidBigIntIsh = (value: BigIntIsh): boolean => {
  try {
    BigInt(value);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Checks if a value is a valid BigNumberIsh.
 * @param value - The value to check.
 * @returns True if the value is a valid BigNumberIsh, false otherwise.
 */
export const isValidBigNumberIsh = (value: BigNumberIsh): boolean => {
  return !Number.isNaN(Number(value));
};
