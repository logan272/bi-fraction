/**
 * Adds separators to a string representing a number.
 *
 * @param str - The string representation of the number.
 * @param groupSize - The primary grouping size for grouping digits in the integer part.
 * @param groupSeparator - The character used as the grouping separator in the integer part.
 * @param decimalSeparator - The character used as the decimal separator.
 * @returns The string representation of the number with separators added.
 */
export const addSeparators = (
  str: string,
  {
    groupSize,
    groupSeparator,
    decimalSeparator,
  }: {
    groupSize: number;
    groupSeparator: string;
    decimalSeparator: string;
  },
): string => {
  const [integerPart, decimalPart] = str.split('.');

  let formattedIntegerPart = '';

  let end = integerPart.length;
  while (end > 0) {
    const start = end - groupSize;

    if (start > 0) {
      formattedIntegerPart =
        groupSeparator + integerPart.slice(start, end) + formattedIntegerPart;
    } else {
      formattedIntegerPart = integerPart.slice(0, end) + formattedIntegerPart;
    }

    end = start;
  }

  return decimalPart
    ? formattedIntegerPart + decimalSeparator + decimalPart
    : formattedIntegerPart;
};
