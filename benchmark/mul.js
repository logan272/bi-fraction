const b = require('benny');
const { Fraction } = require('../dist/cjs/index');

b.suite(
  'mul',

  b.add(`Fr.1`, () => {
    new Fraction('1').mul('2');
  }),

  b.add(`Fr.2`, () => {
    new Fraction('1').mul('2');
  }),

  b.add(`Fr.3`, () => {
    new Fraction('1.234').mul('2.345');
  }),

  b.add(`Fr.4`, () => {
    new Fraction('1.2345678901234567890').mul('2.345678901234567890');
  }),

  b.add(`Fr.5`, () => {
    new Fraction('12345678901234567890.2345678901234567890').mul(
      '12345678901234567890.345678901234567890',
    );
  }),

  b.add(`Fr.6`, () => {
    new Fraction('-12345678901234567890.2345678901234567890').mul(
      '12345678901234567890.345678901234567890',
    );
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'mul', version: '1.2.0' }),
  b.save({ file: 'mul', format: 'chart.html' }),
);
