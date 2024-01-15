[![npm version](https://badge.fury.io/js/bi-fraction.svg)](https://badge.fury.io/js/bi-fraction)

## Introduce

[bi-fraction](https://github.com/logan272/bi-fraction) provides a fraction number abstraction for working with numbers in Javascript.

### Accuracy

One significant benefit of using BigInt with the Fraction abstraction is that it eliminates the need for rounding for rational numbers. You can perform mathematical operations on fractions without losing any precision. The ensures that all rational number math operations are exact, allowing you to maintain the highest level of accuracy.

### Arbitrary Precision

When doing math operations that produce irrational numbers or when converting a Fraction to other representations (such as strings or numbers), bi-fraction offers the "arbitrary precision and magnitude" feature. This means that you have the freedom to specify the desired precision, enabling you to obtain as many precision as needed.

### Rounding Considerations

bi-fraction support the same 9 rounding modes as in [bignumber.js](https://github.com/MikeMcl/bignumber.js) or [decimal.js](https://github.com/MikeMcl/decimal.js). But in contrast to the other libraries, bi-fraction is built on top of native JS bigint. bi-fraction excels at representing rational numbers without requiring rounding in basic arithmetic operations (`add`, `subtract`, `multiply`, `divide`). Since rational numbers can be represented precisely with fraction numbers. Rounding is only necessary when performing operations that produce irrational numbers (e.g., sqrt, sin, cos, ...) or when converting fractions to other representations (such as strings or numbers).

###

[API Doc](https://logan272.github.io/bi-fraction/api/)

## Getting Started

```sh
# install with npm
npm install bi-fraction

# install with yarn
yarn add bi-fraction

# install with pnpm
pnpm add bi-fraction

```

```ts
import { Fraction, RoundingMode } from 'bi-fraction';

0.1 + 0.2 === 0.3; // false
new Fraction(0.1).add(0.2).eq(0.3); // true

1e18 + 1 === 1e18; // true
new Fraction(1e18).add(1).eq(1e18); // false
new Fraction('1e18').add(1).eq('1e18'); // false

// new Fraction(numerator: FractionIsh, denominator?: FractionIsh = 1)
const a = new Fraction('0.1');
const b = new Fraction('0.3');

const c = a.div(b);
c.eq(new Fraction(1, 3)); // true

const d = a.add(0.1); // 0.2
d.eq(new Fraction(2, 10)); // true
d.eq(new Fraction(1, 5)); // true
d.eq(new Fraction(100, 500)); // true

const bigNumber = new Fraction(
  '10000000000000000000000000000000001.0000000001',
);
const bigInteger = new Fraction(1_000_000_000n);
bigNumber
  .mul(bigInteger)
  .eq(new Fraction(100000000000000000000000000000000010000000001n)); // true

// Fraction.toFixed(decimalPlaces?: number, opts: ToFixedOption)
const x = new Fraction('1234.5');
const y = new Fraction(1234.5);
x.eq(y); // true
x.toFixed(0); // '1235'
x.toFixed(0, RoundingMode.ROUND_DOWN); // '1234'
y.toFixed(3); // '1234.500'

const z = x.mul(y); // 1523990.25

// Fraction.toPrecision(decimalPlaces?: number, opts)
z.toPrecision(4); // '1524000'
z.toPrecision(4, { roundingMode: RoundingMode.ROUND_DOWN }); // '1523000'
z.toPrecision(9); // '1523990.25'
z.toPrecision(18); // '1523990.25'
z.toPrecision(100); // '1523990.25'

// Fraction.toFormat(opts: ToFormatOption)
z.toFormat({ decimalPlaces: 0 }); // '1,523,990';
z.toFormat({ decimalPlaces: 0, format: { groupSize: 4 } }); // '152,3990'
z.toFormat({ decimalPlaces: 0, { groupSeparator: '_' }}); // '1_523_990'
```

## Tests

```sh
pnpm test
pnpm coverage
```
