import { Bn } from './bn';

describe('bn', () => {
  it('should return `NaN` for invalid string', () => {
    expect(Bn('not a valid numeric string').isNaN()).toBe(true);
  });

  it('should return NaN for empty string', () => {
    expect(Bn('').isNaN()).toBe(true);
  });

  it('should return `0` for valid zero string', () => {
    expect(Bn('0').toNumber()).toBe(0);
    expect(Bn('0.0').toNumber()).toBe(0);
    expect(Bn('00.00').toNumber()).toBe(0);
    expect(Bn('000').toNumber()).toBe(0);
  });

  it('should return `NaN` for invalid zero string', () => {
    expect(Bn('0_000').isNaN()).toBe(true);
    expect(Bn('0,000').isNaN()).toBe(true);
    expect(Bn('0.0.00').isNaN()).toBe(true);
  });

  it('should be able to interpret scientific notation', () => {
    expect(Bn('0e10').toNumber()).toBe(0);
    expect(Bn('1e0').toNumber()).toBe(1);
    expect(Bn('1e3').toNumber()).toBe(1e3);
    expect(Bn('1e6').toNumber()).toBe(1e6);
    expect(Bn('1e9').toNumber()).toBe(1e9);
  });

  it('should return `NaN` for BigInt string', () => {
    expect(Bn('1n').isNaN()).toBe(true);
    expect(Bn('123n').isNaN()).toBe(true);
  });

  it('should be return `NaN` for formatted invalid string', () => {
    expect(Bn('25_000').isNaN()).toBe(true);
    expect(Bn('25,000').isNaN()).toBe(true);
    expect(Bn('2.5,000').isNaN()).toBe(true);
    expect(Bn('2.5.000').isNaN()).toBe(true);
    expect(Bn('$2.5000').isNaN()).toBe(true);
    expect(Bn('2.5000 USD').isNaN()).toBe(true);
    expect(Bn('3.0000000000000005e+21').isNaN()).toBe(false);
  });
});
