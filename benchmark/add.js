const b = require('benny');
const { Fraction } = require('../dist/cjs/index');

b.suite(
  'ddd',
  b.add(`Fr.1`, () => {
    new Fraction(1n).add(2n);
  }),

  b.add(`Fr.2`, () => {
    new Fraction(1).add(2);
  }),

  b.add(`Fr.3`, () => {
    new Fraction(1n).add(2);
  }),

  b.add(`Fr.4`, () => {
    new Fraction(1n).add('2');
  }),

  b.add(`Fr.5`, () => {
    new Fraction('1').add('2');
  }),

  b.add(`Fr.6`, () => {
    new Fraction('1.234').add('2.345');
  }),

  b.add(`Fr.7`, () => {
    new Fraction('0.100000000000000000011234').add(
      '0.100000000000000000011234',
    );
  }),

  b.add(`Fr.8`, () => {
    new Fraction('12345678901234567890.2345678901234567890').add(
      '12345678901234567890.345678901234567890',
    );
  }),

  b.add(`Fr.9`, () => {
    new Fraction('-12345678901234567890.2345678901234567890').add(
      '12345678901234567890.345678901234567890',
    );
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'add', version: '1.2.0' }),
  b.save({ file: 'add', format: 'chart.html' }),
);
