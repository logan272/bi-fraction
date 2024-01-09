/**
 * Represents a type that can be converted into a BigInt.
 */
export type BigIntIsh = string | number | bigint;

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
 * Checks if a string value is a valid integer.
 * @param value - The string value to check.
 * @returns True if the string value is a valid integer, false otherwise.
 */
export const isValidIntString = (value: string) => {
  return Number.isInteger(Number(value));
};
