const b = require('benny');
const Bn = require('bignumber.js');
const { Fraction } = require('../dist/cjs/index');

b.suite(
  'toFormat',

  b.add(`Fr.1`, () => {
    new Fraction('12345.6789').toFormat({ decimalPlaces: 3 });
  }),

  b.add(`Fr.2`, () => {
    new Fraction('0.999999999999999999999999999999999999999999999').toFormat({
      decimalPlaces: 30,
    });
  }),

  b.add(`Fr.3`, () => {
    new Fraction(
      '1234567890123456789012345678901234567890.1234567890123456789012345678901234567890',
    ).toFormat({ decimalPlaces: 30 });
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'toFormat', version: '1.2.0' }),
  b.save({ file: 'toFormat', format: 'chart.html' }),
);
