const b = require('benny');
const { Fraction } = require('../dist/cjs/index');

b.suite(
  'div',

  b.add(`Fr.1`, () => {
    new Fraction('1').div('2');
  }),

  b.add(`Fr.2`, () => {
    new Fraction('1').div('2');
  }),

  b.add(`Fr.3`, () => {
    new Fraction('1.234').div('2.345');
  }),

  b.add(`Fr.4`, () => {
    new Fraction('1.2345678901234567890').div('2.345678901234567890');
  }),

  b.add(`Fr.5`, () => {
    new Fraction('12345678901234567890.2345678901234567890').div(
      '12345678901234567890.345678901234567890',
    );
  }),

  b.add(`Fr.6`, () => {
    new Fraction('-12345678901234567890.2345678901234567890').div(
      '12345678901234567890.345678901234567890',
    );
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'div', version: '1.2.0' }),
  b.save({ file: 'div', format: 'chart.html' }),
);
