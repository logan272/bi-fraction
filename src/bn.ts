import BigNumberJs from 'bignumber.js';

// see: https://mikemcl.github.io/bignumber.js/#constructor-properties
export enum RoundingMode {
  /**
   * Rounds away from zero
   */
  ROUND_UP = BigNumberJs.ROUND_UP,
  /**
   * Rounds towards zero
   */
  ROUND_DOWN = BigNumberJs.ROUND_DOWN,
  /**
   * Rounds towards Infinity
   */
  ROUND_CEIL = BigNumberJs.ROUND_CEIL,
  /**
   * Rounds towards -Infinity
   */
  ROUND_FLOOR = BigNumberJs.ROUND_FLOOR,
  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds away from zero
   */
  ROUND_HALF_UP = BigNumberJs.ROUND_HALF_UP,
  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards zero
   */
  ROUND_HALF_DOWN = BigNumberJs.ROUND_HALF_DOWN,
  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards even neighbour
   */
  ROUND_HALF_EVEN = BigNumberJs.ROUND_HALF_EVEN,
  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards Infinity
   */
  ROUND_HALF_CEIL = BigNumberJs.ROUND_HALF_CEIL,
  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards -Infinity
   */
  ROUND_HALF_FLOOR = BigNumberJs.ROUND_HALF_FLOOR,
}
export const DEFAULT_ROUNDING_MODE = RoundingMode.ROUND_HALF_UP;

export type Format = BigNumberJs.Format;

export const DEFAULT_FORMAT: Format = {
  // string to prepend
  prefix: '',
  // decimal separator
  decimalSeparator: '.',
  // grouping separator of the integer part
  groupSeparator: ',',
  // primary grouping size of the integer part
  groupSize: 3,
  // secondary grouping size of the integer part
  secondaryGroupSize: 0,
  // grouping separator of the fraction part
  fractionGroupSeparator: '\xA0', // non-breaking space
  // grouping size of the fraction part
  fractionGroupSize: 0,
  // string to append
  suffix: '',
};
// https://mikemcl.github.io/bignumber.js/#bignumber
// Make an clone of the BigNumberJs constructor
export const Bn = BigNumberJs.clone({
  // https://mikemcl.github.io/bignumber.js/#config
  // Following config are the default settings. the defaults good enough
  // we don't need to change the default settings.
  // ================================
  //
  // DECIMAL_PLACES: 20,
  // ROUNDING_MODE: BigNumberJs.ROUND_HALF_UP,
  // EXPONENTIAL_AT: [-7, 20],
  // RANGE: [-1e9, 1e9],
  // CRYPTO: false,
  // MODULO_MODE: BigNumberJs.ROUND_DOWN,
  // POW_PRECISION: 0,
  // ALPHABET: '0123456789abcdefghijklmnopqrstuvwxyz',
  FORMAT: DEFAULT_FORMAT,
});
