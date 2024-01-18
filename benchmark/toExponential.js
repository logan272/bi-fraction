const b = require('benny');
const { Fraction } = require('../dist/cjs/index');

b.suite(
  'toExponential',

  b.add(`Fr.1`, () => {
    new Fraction('12345.6789').toExponential(10);
  }),

  b.add(`Fr.2`, () => {
    new Fraction(
      '0.000000000000000000000000000000000001234567890123456789012345678901234567890',
    ).toExponential(40);
  }),

  b.add(`Fr.3`, () => {
    new Fraction(
      '1234567890123456789012345678901234567890.1234567890123456789012345678901234567890',
    ).toExponential(40);
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'toExponential', version: '1.2.0' }),
  b.save({ file: 'toExponential', format: 'chart.html' }),
);
