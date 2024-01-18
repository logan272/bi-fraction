const b = require('benny');

b.suite(
  'bigint benchmark',

  b.add(`1 + 1`, () => {
    1 + 1;
  }),

  b.add(`1n + 1n`, () => {
    1n + 1n;
  }),

  b.add(`2n > 1`, () => {
    2n > 1;
  }),

  b.add(`2n > 1n`, () => {
    2n > 1n;
  }),

  b.add(`2 > 1`, () => {
    2 > 1;
  }),

  b.add(`Number('1') + Number('1')`, () => {
    Number('1') + Number('1');
  }),

  b.add(`Number(1n) + Number(1n)`, () => {
    Number('1') + Number('1');
  }),

  b.add(`BigInt(1) + BigInt(1)`, () => {
    BigInt(1) + BigInt(1);
  }),

  b.add(`BigInt('1') + BigInt('1')`, () => {
    BigInt('1') + BigInt('1');
  }),

  b.add(`large bigint + large bigint`, () => {
    1234567890123456789012345678901234567890n +
      1234567890123456789012345678901234567890n;
  }),

  b.add(`large bigint * large bigint`, () => {
    1234567890123456789012345678901234567890n *
      1234567890123456789012345678901234567890n;
  }),

  b.add(`large bigint / bigint`, () => {
    1234567890123456789012345678901234567890n / 3n;
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'bigint', version: '1.2.0' }),
  b.save({ file: 'bigint', format: 'chart.html' }),
);
