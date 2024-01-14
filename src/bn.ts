import BigNumberJs from 'bignumber.js';

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
  FORMAT: {
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
  },
});
