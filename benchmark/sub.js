const b = require('benny');
const { Fraction } = require('../dist/cjs/index');

b.suite(
  'sub',

  b.add(`Fr.1`, () => {
    new Fraction('1').sub('2');
  }),

  b.add(`Fr.2`, () => {
    new Fraction('1').sub('2');
  }),

  b.add(`Fr.3`, () => {
    new Fraction('1.234').sub('2.345');
  }),

  b.add(`Fr.4`, () => {
    new Fraction('1.2345678901234567890').sub('2.345678901234567890');
  }),

  b.add(`Fr.5`, () => {
    new Fraction('12345678901234567890.2345678901234567890').sub(
      '12345678901234567890.345678901234567890',
    );
  }),

  b.add(`Fr.6`, () => {
    new Fraction('-12345678901234567890.2345678901234567890').sub(
      '12345678901234567890.345678901234567890',
    );
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'sub', version: '1.2.0' }),
  b.save({ file: 'sub', format: 'chart.html' }),
);
