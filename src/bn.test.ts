import BignumberJs from 'bignumber.js';

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

  describe('RoundingMode.', () => {
    // (0) ROUND_UP
    // Rounds away from zero
    describe('RoundingMode.ROUND_UP', () => {
      it('should pass', () => {
        const B = Bn.clone({ ROUNDING_MODE: BignumberJs.ROUND_UP });
        expect(B('1.4').toFixed(0)).toBe('2');
        expect(B('1.5').toFixed(0)).toBe('2');
        expect(B('1.6').toFixed(0)).toBe('2');

        expect(B('-1.4').toFixed(0)).toBe('-2');
        expect(B('-1.5').toFixed(0)).toBe('-2');
        expect(B('-1.6').toFixed(0)).toBe('-2');
      });
    });

    describe('trailing zeros', () => {
      it('should pass', () => {
        expect(Bn('1.40').toFixed(2)).toBe('1.40');
      });
    });

    // (1) ROUND_DOWN
    // Rounds towards from zero
    describe('RoundingMode.ROUND_DOWN', () => {
      it('should pass', () => {
        const B = Bn.clone({ ROUNDING_MODE: BignumberJs.ROUND_DOWN });
        expect(B('1.4').toFixed(0)).toBe('1');
        expect(B('1.5').toFixed(0)).toBe('1');
        expect(B('1.6').toFixed(0)).toBe('1');

        expect(B('-1.4').toFixed(0)).toBe('-1');
        expect(B('-1.5').toFixed(0)).toBe('-1');
        expect(B('-1.6').toFixed(0)).toBe('-1');
      });
    });

    // (2) ROUND_CEIL
    // Rounds towards Infinity
    describe('RoundingMode.ROUND_CEIL', () => {
      it('should pass', () => {
        const B = Bn.clone({ ROUNDING_MODE: BignumberJs.ROUND_CEIL });
        expect(B('1.4').toFixed(0)).toBe('2');
        expect(B('1.5').toFixed(0)).toBe('2');
        expect(B('1.6').toFixed(0)).toBe('2');

        expect(B('-1.4').toFixed(0)).toBe('-1');
        expect(B('-1.5').toFixed(0)).toBe('-1');
        expect(B('-1.6').toFixed(0)).toBe('-1');
      });
    });

    // (3) ROUND_FLOOR
    // Rounds towards -Infinity
    describe('RoundingMode.ROUND_FLOOR', () => {
      it('should pass', () => {
        const B = Bn.clone({ ROUNDING_MODE: BignumberJs.ROUND_FLOOR });
        expect(B('1.4').toFixed(0)).toBe('1');
        expect(B('1.5').toFixed(0)).toBe('1');
        expect(B('1.6').toFixed(0)).toBe('1');

        expect(B('-1.4').toFixed(0)).toBe('-2');
        expect(B('-1.5').toFixed(0)).toBe('-2');
        expect(B('-1.6').toFixed(0)).toBe('-2');
      });
    });

    // (4) ROUND_HALF_UP
    // Rounds towards nearest neighbour. If equidistant, rounds away from zero
    describe('RoundingMode.ROUND_HALF_UP', () => {
      it('should pass', () => {
        const B = Bn.clone({ ROUNDING_MODE: BignumberJs.ROUND_HALF_UP });
        expect(B('1.4').toFixed(0)).toBe('1');
        expect(B('1.5').toFixed(0)).toBe('2');
        expect(B('1.6').toFixed(0)).toBe('2');

        expect(B('-1.4').toFixed(0)).toBe('-1');
        expect(B('-1.5').toFixed(0)).toBe('-2');
        expect(B('-1.6').toFixed(0)).toBe('-2');
      });
    });

    // (5) ROUND_HALF_DOWN
    // Rounds towards nearest neighbour. If equidistant, rounds towards zero
    describe('RoundingMode.ROUND_HALF_DOWN', () => {
      it('should pass', () => {
        const B = Bn.clone({ ROUNDING_MODE: BignumberJs.ROUND_HALF_DOWN });
        expect(B('1.4').toFixed(0)).toBe('1');
        expect(B('1.5').toFixed(0)).toBe('1');
        expect(B('1.6').toFixed(0)).toBe('2');

        expect(B('-1.4').toFixed(0)).toBe('-1');
        expect(B('-1.5').toFixed(0)).toBe('-1');
        expect(B('-1.6').toFixed(0)).toBe('-2');
      });
    });

    // (6) ROUND_HALF_EVEN
    // Rounds towards nearest neighbour. If equidistant, rounds towards even neighbour
    describe('RoundingMode.ROUND_HALF_EVEN', () => {
      it('should pass', () => {
        const B = Bn.clone({ ROUNDING_MODE: BignumberJs.ROUND_HALF_EVEN });
        expect(B('1.4').toFixed(0)).toBe('1');
        expect(B('1.5').toFixed(0)).toBe('2');
        expect(B('1.6').toFixed(0)).toBe('2');

        expect(B('1.14').toFixed(1)).toBe('1.1');
        expect(B('1.15').toFixed(1)).toBe('1.2');
        expect(B('1.16').toFixed(1)).toBe('1.2');

        expect(B('-1.4').toFixed(0)).toBe('-1');
        expect(B('-1.5').toFixed(0)).toBe('-2');
        expect(B('-1.6').toFixed(0)).toBe('-2');

        expect(B('-1.14').toFixed(1)).toBe('-1.1');
        expect(B('-1.15').toFixed(1)).toBe('-1.2');
        expect(B('-1.16').toFixed(1)).toBe('-1.2');

        expect(B('2.4').toFixed(0)).toBe('2');
        expect(B('2.5').toFixed(0)).toBe('2');
        expect(B('2.6').toFixed(0)).toBe('3');

        expect(B('2.24').toFixed(1)).toBe('2.2');
        expect(B('2.25').toFixed(1)).toBe('2.2');
        expect(B('2.26').toFixed(1)).toBe('2.3');

        expect(B('-2.4').toFixed(0)).toBe('-2');
        expect(B('-2.5').toFixed(0)).toBe('-2');
        expect(B('-2.6').toFixed(0)).toBe('-3');

        expect(B('-2.24').toFixed(1)).toBe('-2.2');
        expect(B('-2.25').toFixed(1)).toBe('-2.2');
        expect(B('-2.26').toFixed(1)).toBe('-2.3');
      });
    });

    // (7) ROUND_HALF_CEIL
    // Rounds towards nearest neighbour. If equidistant, rounds towards Infinity
    describe('RoundingMode.ROUND_HALF_CEIL', () => {
      it('should pass', () => {
        const B = Bn.clone({ ROUNDING_MODE: BignumberJs.ROUND_HALF_CEIL });
        expect(B('1.4').toFixed(0)).toBe('1');
        expect(B('1.5').toFixed(0)).toBe('2');
        expect(B('1.6').toFixed(0)).toBe('2');

        expect(B('-1.4').toFixed(0)).toBe('-1');
        expect(B('-1.5').toFixed(0)).toBe('-1');
        expect(B('-1.6').toFixed(0)).toBe('-2');
      });
    });

    // (8) ROUND_HALF_FLOOR
    // Rounds towards nearest neighbour. If equidistant, rounds towards -Infinity
    describe('RoundingMode.ROUND_HALF_FLOOR', () => {
      it('should pass', () => {
        const B = Bn.clone({ ROUNDING_MODE: BignumberJs.ROUND_HALF_FLOOR });
        expect(B('1.4').toFixed(0)).toBe('1');
        expect(B('1.5').toFixed(0)).toBe('1');
        expect(B('1.6').toFixed(0)).toBe('2');

        expect(B('-1.4').toFixed(0)).toBe('-1');
        expect(B('-1.5').toFixed(0)).toBe('-2');
        expect(B('-1.6').toFixed(0)).toBe('-2');
      });
    });
  });
});
