import { Fraction, RoundingMode } from './fraction';

describe('toPrecision', () => {
  it('should throw if `significantDigits` is not an >= 1 integer', () => {
    const f = new Fraction(1);
    expect(() => f.toPrecision(0)).toThrow();
    expect(() => f.toPrecision(-1)).toThrow();
    expect(() => f.toPrecision(-123)).toThrow();
    expect(() => f.toPrecision(0.1)).toThrow();
    expect(() => f.toPrecision(1.2)).toThrow();
  });

  it('should handle zeros correct', () => {
    expect(Fraction.ZERO.toPrecision(1)).toBe('0');
    expect(Fraction.ZERO.toPrecision(2)).toBe('0.0');
    expect(Fraction.ZERO.toPrecision(3)).toBe('0.00');
    expect(Fraction.ZERO.toPrecision(4)).toBe('0.000');
    expect(new Fraction(0).toPrecision(2)).toBe('0.0');
    expect(new Fraction('0').toPrecision(2)).toBe('0.0');
    expect(new Fraction('0.0').toPrecision(2)).toBe('0.0');
    expect(new Fraction('0.000').toPrecision(2)).toBe('0.0');
  });

  it('should handle number with zero integer part correct', () => {
    const f1 = new Fraction('0.123456');
    expect(f1.toPrecision(1)).toBe('0.1');
    expect(f1.toPrecision(2)).toBe('0.12');
    expect(f1.toPrecision(3)).toBe('0.123');
    expect(f1.toPrecision(4)).toBe('0.1235');
    expect(f1.toPrecision(5)).toBe('0.12346');
    expect(f1.toPrecision(6)).toBe('0.123456');
    expect(f1.toPrecision(7)).toBe('0.1234560');
  });

  it('should convert to a string with the specified significant digits and rounding mode', () => {
    const f1 = new Fraction('12345.67890');
    expect(f1.toPrecision(12)).toBe('12345.6789'.padEnd(13, '0'));
    expect(f1.toPrecision(9)).toBe('12345.6789'.padEnd(10, '0'));
    expect(
      f1.toPrecision(8, { roundingMode: RoundingMode.ROUND_HALF_UP }),
    ).toBe('12345.679');
    expect(f1.toPrecision(8, { roundingMode: RoundingMode.ROUND_FLOOR })).toBe(
      '12345.678',
    );
    expect(f1.toPrecision(5, { roundingMode: RoundingMode.ROUND_FLOOR })).toBe(
      '12345',
    );
    expect(f1.toPrecision(2, { roundingMode: RoundingMode.ROUND_FLOOR })).toBe(
      '12000',
    );
  });

  it('should convert to an string with the specified significant digits for very large/small number', () => {
    const large = '12_345_678_901_234_567_890'.replace(/_/g, '');
    const f1 = new Fraction(large);
    expect(f1.toPrecision(12)).toBe('123456789012'.padEnd(large.length, '0'));
    expect(f1.toPrecision(10)).toBe('123456789'.padEnd(large.length, '0'));
    expect(f1.toPrecision(2)).toBe('12'.padEnd(large.length, '0'));

    const huge = '12_345_678_901_234_567_890_123'.replace(/_/g, '');
    const f2 = new Fraction(huge);
    expect(f2.toPrecision(12)).toBe('123456789012'.padEnd(huge.length, '0'));
    expect(f2.toPrecision(2)).toBe('12'.padEnd(huge.length, '0'));

    const small = '1.2_345_678_901_234_567_890'.replace(/_/g, '');
    const f3 = new Fraction(small);
    expect(f3.toPrecision(20)).toBe('1.234567890123456789'.padEnd(21, '0'));
    expect(f3.toPrecision(12)).toBe('1.23456789012'.padEnd(13, '0'));
    expect(f3.toPrecision(2)).toBe('1.2');
  });
});
