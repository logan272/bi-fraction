const b = require('benny');
const { Fraction } = require('../dist/cjs/index');

b.suite(
  'new',

  b.add(`Fr.1`, () => {
    new Fraction(1);
  }),

  b.add(`Fr.2`, () => {
    new Fraction(1, 2);
  }),

  b.add(`Fr.3`, () => {
    new Fraction(1n, 2n);
  }),

  b.add(`Fr.4`, () => {
    new Fraction('1', '2');
  }),

  b.add(`Fr.5`, () => {
    new Fraction('1.234');
  }),

  b.add(`Fr.6`, () => {
    new Fraction('1.234', '4.567');
  }),

  b.add(`Fr.7`, () => {
    new Fraction('12345678901234567890.2345678901234567890');
  }),

  b.add(`Fr.8`, () => {
    new Fraction('-12345678901234567890.2345678901234567890');
  }),

  b.add(`Fr.9`, () => {
    new Fraction(
      '-12345678901234567890.2345678901234567890',
      '0.000000000000000000000012345678901234567890',
    );
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'new', version: '1.2.0' }),
  b.save({ file: 'new', format: 'chart.html' }),
);
