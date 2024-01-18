import type { Config } from './fraction';
import { Fraction, mergeWithDefaultConfig, RoundingMode } from './fraction';

/**
 * Clone Fraction by extends Fraction.
 *
 * This is the recommended way to customize the Fraction default configurations.
 */
class MyFraction extends Fraction {
  public static override get config(): Config {
    return mergeWithDefaultConfig({
      decimalPlaces: 2,
      maxDecimalPlaces: 22,
      toFormat: {
        decimalPlaces: 5,
        roundingMode: RoundingMode.ROUND_UP,
      },
    });
  }

  protected override get config() {
    return MyFraction.config;
  }
}

describe('clone', () => {
  it('should pass', () => {
    expect(Fraction.config.decimalPlaces).toBe(0);
    expect(Fraction.config.maxDecimalPlaces).toBe(20);

    expect(MyFraction.config.decimalPlaces).toBe(2);
    expect(MyFraction.config.maxDecimalPlaces).toBe(22);
  });

  it('should apply config correctly', () => {
    expect(new Fraction(1, 3).toFixed()).toBe('0');
    expect(new MyFraction(1, 3).toFixed()).toBe('0.33');

    expect(new Fraction(1, 3).toFormat()).toBe('0');
    expect(new MyFraction(1, 3).toFormat()).toBe('0.33334');

    expect(new Fraction(1, 3).toFixed(3)).toBe('0.333');
    expect(new MyFraction(1, 3).toFixed(3)).toBe('0.333');
  });
});
