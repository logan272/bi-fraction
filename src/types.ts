/**
 * Represents `Bigint` or any number of string that can be converted to `BigInt`.
 */
export type BigIntIsh = string | number | bigint;
/**
 * Represents number,or and Bigint or string that can be converted to number.
 */
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
