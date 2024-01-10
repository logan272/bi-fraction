/**
 * Represents bigint or any number and string that can be converted to bigInt.
 */
export type BigIntIsh = string | number | bigint;
/**
 * Represents number, bigint, or string that can be converted to number or bigint.
 */
export type NumberIsh = string | number | bigint;

/**
 * Checks if value is a valid BigIntIsh.
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
 * Checks if value is a valid NumberIsh.
 * @param value - The value to check.
 * @returns True if the value is a valid NumberIsh, false otherwise.
 */
export const isValidNumberIsh = (value: NumberIsh): boolean => {
  return !Number.isNaN(Number(value));
};
