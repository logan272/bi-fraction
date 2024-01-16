/**
 * Represents number, bigint, or string that can be converted to number or bigint.
 * A `NumberIsh` can be converted to a Fraction by calling `new Fraction(numerator: NumberIsh)`.
 */
export type NumberIsh = string | number | bigint;

/**
 * Checks if value is a valid NumberIsh.
 * @param value - The value to check.
 * @returns True if the value is a valid NumberIsh, false otherwise.
 */
export const isValidNumberIsh = (value: NumberIsh): boolean => {
  return !Number.isNaN(Number(value));
};
