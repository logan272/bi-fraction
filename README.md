[![npm version](https://badge.fury.io/js/bi-fraction.svg)](https://badge.fury.io/js/bi-fraction)

## Introduction

[bi-fraction](https://github.com/logan272/bi-fraction) provides a fraction number abstraction for working with numbers in Javascript.

### Accuracy

One benefit of using BigInt with the Fraction abstraction is that it eliminates the need for rounding for rational numbers. It can perform math operations on fractions without losing any precision. The ensures that all rational math operations are exact, allowing you to maintain the highest level of accuracy.

### Arbitrary Precision

When doing math operations that produce irrational numbers or converting a Fraction to other representations such as strings or numbers, bi-fraction offers the "arbitrary precision and magnitude" feature. This means that you have the freedom to specify the desired precision, enabling you to obtain as many precision as needed.

### Rounding Considerations

bi-fraction support the same 9 rounding modes as in [bignumber.js](https://github.com/MikeMcl/bignumber.js) and [decimal.js](https://github.com/MikeMcl/decimal.js). bi-fraction is built on top of native JS bigint and it excels at representing numbers without requiring rounding in rational math operations (e.g., `add`, `sub`, `mul`, `div`). Since rational numbers can be represented precisely with fraction numbers, rounding is only necessary when performing operations that produce irrational numbers (e.g., `sqrt`, `sin`, `cos`) or converting fractions to other representations.

## Error Handling

### Invalid Inputs

The Fraction class ensure reliable and predictable behavior throughout its methods. Lots methods of the Fraction class accept an `other: FractionIsh` parameter as input. The FractionIsh type is defined as `type FractionIsh = Fraction | NumberIsh`.

A NumberIsh represents a value that can be converted to a number. It can be either a number, bigint, or string that can be successfully converted using the `Number(str)` function. However, if `Number(str)` returns NaN, indicating a failed conversion, the input `str` is considered an invalid NumberIsh.

In such cases, instead of returning NaN, all methods of the Fraction class will throw an error to indicate that the input is not a valid NumberIsh.

### Division by Zero

Built on top of BigInt, Fraction follows the same behavior of BigInt division by zero. In contrast to plain JavaScript numbers, which return Infinity or -Infinity when divided by zero, BigInt (and therefore Fraction) throws an error when divided by zero.

## API Doc

[bi-fraction API Doc](https://logan272.github.io/bi-fraction/api/)

## Install

```sh
# install with npm
npm install bi-fraction

# install with yarn
yarn add bi-fraction

# install with pnpm
pnpm add bi-fraction

```

## Getting Started

```ts
import { Fraction, RoundingMode } from 'bi-fraction';

0.1 + 0.2 === 0.3; // false
new Fraction(0.1).add(0.2).eq(0.3); // true

1e18 + 1 === 1e18; // true
new Fraction(1e18).add(1).eq(1e18); // false
new Fraction('1e18').add(1).eq('1e18'); // false

// new Fraction(numerator: FractionIsh, denominator?: FractionIsh = 1)
const a = new Fraction('0.1').div('0.3');
q.eq(new Fraction(1, 3)); // true

const bigNumber = new Fraction(
  '10000000000000000000000000000000001.0000000001',
);
const bigInteger = new Fraction(1_000_000_000n);
bigNumber
  .mul(bigInteger)
  .eq(new Fraction(100000000000000000000000000000000010000000001n)); // true

// Fraction.toFixed(decimalPlaces?: number = 0, opts: ToFixedOption)
const x = new Fraction(1234.5);
x.toFixed(0); // '1235'
x.toFixed(0, { roundingMode: RoundingMode.ROUND_DOWN }); // '1234'
x.toFixed(3); // '1234.500'
x.toFixed(3, { trailingZero: false }); // '1234.5'

const z = x.mul(x); // 1523990.25

// Fraction.toPrecision(significantDigits: number, opts)
z.toPrecision(4); // '1524000'
z.toPrecision(4, { roundingMode: RoundingMode.ROUND_DOWN }); // '1523000'
z.toPrecision(9); // '1523990.25'
z.toPrecision(10); // '1523990.250'

// Fraction.toFormat(opts: ToFormatOption)
z.toFormat({  decimalPlaces: 0 }); // '1,523,990';
z.toFormat({ format: { groupSize: 4 } }); // '152,3990'
z.toFormat({ decimalPlaces: 3, { groupSeparator: '_' }}); // '1_523_990.250'
z.toFormat({ decimalPlaces: 3, trailingZero: false, { groupSeparator: '_' }}); // '1_523_990.25'
```

## Test

```sh
pnpm test
pnpm coverage
```
