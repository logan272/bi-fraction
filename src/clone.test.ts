import { Fraction } from './fraction';

class MyFraction extends Fraction {
  public static override get config() {
    return {
      decimalPlaces: 2,
      maxDecimalPlaces: 22,
    };
  }
}

describe('clone', () => {
  it('should pass', () => {
    expect(Fraction.config.decimalPlaces).toBe(0);
    expect(Fraction.config.maxDecimalPlaces).toBe(20);

    expect(MyFraction.config.decimalPlaces).toBe(2);
    expect(MyFraction.config.maxDecimalPlaces).toBe(22);
  });

  it('instance config', () => {
    expect(new Fraction(123).getConfig().decimalPlaces).toBe(0);
    expect(new Fraction(123).getConfig().maxDecimalPlaces).toBe(20);

    expect(new MyFraction(123).getConfig().decimalPlaces).toBe(0);
    expect(new MyFraction(123).getConfig().maxDecimalPlaces).toBe(20);
  });
});
