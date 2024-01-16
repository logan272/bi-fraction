import { Fraction } from './fraction';

describe('Fraction.toExponential', () => {
  it('basic', () => {
    expect(new Fraction(0).toExponential(1)).toBe('0.0e+0');
    expect(new Fraction(0).toExponential(3)).toBe('0.000e+0');
    expect(new Fraction('-0').toExponential(3)).toBe('0.000e+0');
    expect(new Fraction(0).toExponential(0)).toBe('0e+0');

    expect(new Fraction(1).toExponential(0)).toBe('1e+0');
    expect(new Fraction(1).toExponential(1)).toBe('1.0e+0');
    expect(new Fraction(1).toExponential(2)).toBe('1.00e+0');

    expect(new Fraction(0.0000012345).toExponential(4)).toBe('1.2345e-6');
    expect(new Fraction(-0.0000012345).toExponential(4)).toBe('-1.2345e-6');
    expect(new Fraction('0.0000001234').toExponential(4)).toBe('1.2340e-7');
    expect(new Fraction('-0.0000001234').toExponential(4)).toBe('-1.2340e-7');

    expect(new Fraction(123.4).toExponential(3)).toBe('1.234e+2');
    expect(new Fraction(-123.4).toExponential(3)).toBe('-1.234e+2');
    expect(new Fraction(123.4).toExponential(4)).toBe('1.2340e+2');
    expect(new Fraction(1234.5).toExponential(4)).toBe('1.2345e+3');

    expect(new Fraction(1234.5678).toExponential(1)).toBe('1.2e+3');
    expect(new Fraction(1234.5678).toExponential(3)).toBe('1.235e+3');
    expect(new Fraction(1234.5678).toExponential(5)).toBe('1.23457e+3');

    new Fraction(10n ** 100n).toExponential(2); // '1.00e+100'
    expect(new Fraction(`${10n ** 100n}`).toExponential(100)).toBe(
      '1.' + '0'.repeat(100) + 'e+100',
    );

    expect(
      new Fraction('1234.000_000_000_000_123'.replace(/_/g, '')).toExponential(
        18,
      ),
    ).toBe('1.234000_000_000_000_123e+3'.replace(/_/g, ''));
  });
});
