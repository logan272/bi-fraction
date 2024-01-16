import type { ToFixedOptions } from './fraction';
import { Fraction, RoundingMode } from './fraction';

describe('Fraction.toFixed', () => {
  it('should throw if `decimalPlaces < 0`', () => {
    const pi = new Fraction('3.14159');
    expect(() => pi.toFixed(-1)).toThrow();
  });

  it('basic', () => {
    const pi = new Fraction('3.14159');
    expect(pi.toFixed(0)).toBe('3');
    expect(pi.toFixed(1)).toBe('3.1');
    expect(pi.toFixed(5)).toBe('3.14159');
    expect(pi.toFixed(6)).toBe('3.141590');
    expect(pi.toFixed(3, { roundingMode: RoundingMode.ROUND_FLOOR })).toBe(
      '3.141',
    );
    expect(pi.toFixed(4)).toBe('3.1416');
    expect(pi.toFixed(4, { roundingMode: RoundingMode.ROUND_FLOOR })).toBe(
      '3.1415',
    );
    expect(pi.toFixed(5)).toBe('3.14159');
    expect(pi.toFixed(6)).toBe('3.141590');
    expect(pi.toFixed(7)).toBe('3.1415900');

    expect(new Fraction(0.6).toFixed(0)).toBe('1');
    expect(new Fraction(0.6666).toFixed(3)).toBe('0.667');
  });

  it('should handle the carry correctly', () => {
    expect(new Fraction('999.999').toFixed(0)).toBe('1000');
    expect(new Fraction('999.999').toFixed(1)).toBe('1000.0');
    expect(new Fraction('999.999').toFixed(2)).toBe('1000.00');
    expect(new Fraction('999.999').toFixed(3)).toBe('999.999');
    expect(new Fraction('999.999').toFixed(4)).toBe('999.9990');
    expect(new Fraction('999.999').toFixed(5)).toBe('999.99900');
  });

  it('should handle recurring fraction correctly', () => {
    // 1/3: 0.333333333333333
    const f1 = new Fraction(1, 3);
    expect(f1.toFixed(0)).toBe('0');
    expect(f1.toFixed(1)).toBe('0.3');
    expect(f1.toFixed(5)).toBe('0.33333');
    expect(f1.toFixed(6)).toBe('0.333333');
    expect(f1.toFixed(100)).toBe('0.' + '3'.repeat(100));

    const f2 = new Fraction(1, 300);
    expect(f2.toFixed(0)).toBe('0');
    expect(f2.toFixed(1)).toBe('0.0');
    expect(f2.toFixed(2)).toBe('0.00');
    expect(f2.toFixed(3)).toBe('0.003');
    expect(f2.toFixed(4)).toBe('0.0033');
    expect(f2.toFixed(5)).toBe('0.00333');
    expect(f2.toFixed(6)).toBe('0.003333');
    expect(f2.toFixed(100)).toBe('0.00' + '3'.repeat(98));

    // 1/7: 0.14285714285714285
    const f3 = new Fraction(1, 7);
    expect(f3.toFixed(0)).toBe('0');
    expect(f3.toFixed(1)).toBe('0.1');
    expect(f3.toFixed(2)).toBe('0.14');
    expect(f3.toFixed(3)).toBe('0.143');
    expect(f3.toFixed(4)).toBe('0.1429');
    expect(f3.toFixed(5)).toBe('0.14286');
    expect(f3.toFixed(6)).toBe('0.142857');
    expect(f3.toFixed(7)).toBe('0.1428571');
    expect(f3.toFixed(8)).toBe('0.14285714');
    expect(f3.toFixed(100)).toBe('0.' + '142857'.repeat(16) + '1429');

    // 1/7000: 0.00014285714285714285
    const f4 = new Fraction(1, 7000);
    expect(f4.toFixed(0)).toBe('0');
    expect(f4.toFixed(1)).toBe('0.0');
    expect(f4.toFixed(2)).toBe('0.00');
    expect(f4.toFixed(3)).toBe('0.000');
    expect(f4.toFixed(4)).toBe('0.0001');
    expect(f4.toFixed(5)).toBe('0.00014');
    expect(f4.toFixed(6)).toBe('0.000143');
    expect(f4.toFixed(7)).toBe('0.0001429');
    expect(f4.toFixed(8)).toBe('0.00014286');
    expect(f4.toFixed(9)).toBe('0.000142857');
    expect(f4.toFixed(10)).toBe('0.0001428571');
    expect(f4.toFixed(11)).toBe('0.00014285714');
    expect(f4.toFixed(100)).toBe('0.000' + '142857'.repeat(16) + '1');
  });

  it('should convert the fraction to a fixed-point decimal string representation correctly for very large/small number', () => {
    const small = '1.2345678901234567890123';
    const f1 = new Fraction(small);
    expect(f1.toFixed(12)).toBe('1.234567890123');
    expect(f1.toFixed(13, { roundingMode: RoundingMode.ROUND_FLOOR })).toBe(
      '1.2345678901234',
    );
    expect(f1.toFixed(13)).toBe('1.2345678901235');

    const withMoreThan21DecimalPlaces = '1.234567890123456789012345';
    const f2 = new Fraction(withMoreThan21DecimalPlaces);
    expect(f2.toFixed(20)).toBe('1.23456789012345678901');
    expect(f2.toFixed(21)).toBe('1.234567890123456789012');
    expect(f2.toFixed(22)).toBe('1.2345678901234567890123');
    expect(f2.toFixed(23)).toBe('1.23456789012345678901235');
    expect(f2.toFixed(24)).toBe('1.234567890123456789012345');
  });

  describe('RoundingMode.', () => {
    // (0) ROUND_UP
    // Rounds away zero
    describe('RoundingMode.ROUND_UP', () => {
      it('should pass', () => {
        const rm = { roundingMode: RoundingMode.ROUND_UP };
        expect(new Fraction('1.4').toFixed(0, rm)).toBe('2');
        expect(new Fraction('1.5').toFixed(0, rm)).toBe('2');
        expect(new Fraction('1.6').toFixed(0, rm)).toBe('2');

        expect(new Fraction('-1.4').toFixed(0, rm)).toBe('-2');
        expect(new Fraction('-1.5').toFixed(0, rm)).toBe('-2');
        expect(new Fraction('-1.6').toFixed(0, rm)).toBe('-2');
      });
    });

    // (1) ROUND_DOWN
    // Rounds towards from zero
    describe('RoundingMode.ROUND_DOWN', () => {
      it('should pass', () => {
        const rm = { roundingMode: RoundingMode.ROUND_DOWN };
        expect(new Fraction('1.4').toFixed(0, rm)).toBe('1');
        expect(new Fraction('1.5').toFixed(0, rm)).toBe('1');
        expect(new Fraction('1.6').toFixed(0, rm)).toBe('1');

        expect(new Fraction('-1.4').toFixed(0, rm)).toBe('-1');
        expect(new Fraction('-1.5').toFixed(0, rm)).toBe('-1');
        expect(new Fraction('-1.6').toFixed(0, rm)).toBe('-1');
      });
    });

    // (2) ROUND_CEIL
    // Rounds towards Infinity
    describe('RoundingMode.ROUND_CEIL', () => {
      it('should pass', () => {
        const rm = { roundingMode: RoundingMode.ROUND_CEIL };
        expect(new Fraction('1.4').toFixed(0, rm)).toBe('2');
        expect(new Fraction('1.5').toFixed(0, rm)).toBe('2');
        expect(new Fraction('1.6').toFixed(0, rm)).toBe('2');

        expect(new Fraction('-1.4').toFixed(0, rm)).toBe('-1');
        expect(new Fraction('-1.5').toFixed(0, rm)).toBe('-1');
        expect(new Fraction('-1.6').toFixed(0, rm)).toBe('-1');
      });
    });

    // (3) ROUND_FLOOR
    // Rounds towards -Infinity
    describe('RoundingMode.ROUND_FLOOR', () => {
      it('should pass', () => {
        const rm = { roundingMode: RoundingMode.ROUND_FLOOR };
        expect(new Fraction('1.4').toFixed(0, rm)).toBe('1');
        expect(new Fraction('1.5').toFixed(0, rm)).toBe('1');
        expect(new Fraction('1.6').toFixed(0, rm)).toBe('1');

        expect(new Fraction('-1.4').toFixed(0, rm)).toBe('-2');
        expect(new Fraction('-1.5').toFixed(0, rm)).toBe('-2');
        expect(new Fraction('-1.6').toFixed(0, rm)).toBe('-2');
      });
    });

    // (4) ROUND_HALF_UP
    // Rounds towards nearest neighbour. If equidistant, rounds away zero
    describe('RoundingMode.ROUND_HALF_UP', () => {
      it('should pass', () => {
        const rm = { roundingMode: RoundingMode.ROUND_HALF_UP };
        expect(new Fraction('1.4').toFixed(0, rm)).toBe('1');
        expect(new Fraction('1.5').toFixed(0, rm)).toBe('2');
        expect(new Fraction('1.6').toFixed(0, rm)).toBe('2');

        expect(new Fraction('-1.4').toFixed(0, rm)).toBe('-1');
        expect(new Fraction('-1.5').toFixed(0, rm)).toBe('-2');
        expect(new Fraction('-1.6').toFixed(0, rm)).toBe('-2');
      });
    });

    // (5) ROUND_HALF_DOWN
    // Rounds towards nearest neighbour. If equidistant, rounds towards zero
    describe('RoundingMode.ROUND_HALF_DOWN', () => {
      it('should pass', () => {
        const rm = { roundingMode: RoundingMode.ROUND_HALF_DOWN };
        expect(new Fraction('1.4').toFixed(0, rm)).toBe('1');
        expect(new Fraction('1.5').toFixed(0, rm)).toBe('1');
        expect(new Fraction('1.6').toFixed(0, rm)).toBe('2');

        expect(new Fraction('-1.4').toFixed(0, rm)).toBe('-1');
        expect(new Fraction('-1.5').toFixed(0, rm)).toBe('-1');
        expect(new Fraction('-1.6').toFixed(0, rm)).toBe('-2');
      });
    });

    // (6) ROUND_HALF_EVEN
    // Rounds towards nearest neighbour. If equidistant, rounds towards even neighbour
    describe('RoundingMode.ROUND_HALF_EVEN', () => {
      it('should pass', () => {
        const rm = { roundingMode: RoundingMode.ROUND_HALF_EVEN };
        expect(new Fraction('1.4').toFixed(0, rm)).toBe('1');
        expect(new Fraction('1.5').toFixed(0, rm)).toBe('2');
        expect(new Fraction('1.6').toFixed(0, rm)).toBe('2');

        expect(new Fraction('1.14').toFixed(1, rm)).toBe('1.1');
        expect(new Fraction('1.15').toFixed(1, rm)).toBe('1.2');
        expect(new Fraction('1.16').toFixed(1, rm)).toBe('1.2');

        expect(new Fraction('-1.4').toFixed(0, rm)).toBe('-1');
        expect(new Fraction('-1.5').toFixed(0, rm)).toBe('-2');
        expect(new Fraction('-1.6').toFixed(0, rm)).toBe('-2');

        expect(new Fraction('-1.14').toFixed(1, rm)).toBe('-1.1');
        expect(new Fraction('-1.15').toFixed(1, rm)).toBe('-1.2');
        expect(new Fraction('-1.16').toFixed(1, rm)).toBe('-1.2');

        expect(new Fraction('2.4').toFixed(0, rm)).toBe('2');
        expect(new Fraction('2.5').toFixed(0, rm)).toBe('2');
        expect(new Fraction('2.6').toFixed(0, rm)).toBe('3');

        expect(new Fraction('2.24').toFixed(1, rm)).toBe('2.2');
        expect(new Fraction('2.25').toFixed(1, rm)).toBe('2.2');
        expect(new Fraction('2.26').toFixed(1, rm)).toBe('2.3');

        expect(new Fraction('-2.4').toFixed(0, rm)).toBe('-2');
        expect(new Fraction('-2.5').toFixed(0, rm)).toBe('-2');
        expect(new Fraction('-2.6').toFixed(0, rm)).toBe('-3');

        expect(new Fraction('-2.24').toFixed(1, rm)).toBe('-2.2');
        expect(new Fraction('-2.25').toFixed(1, rm)).toBe('-2.2');
        expect(new Fraction('-2.26').toFixed(1, rm)).toBe('-2.3');
      });
    });

    // (7) ROUND_HALF_CEIL
    // Rounds towards nearest neighbour. If equidistant, rounds towards Infinity
    describe('RoundingMode.ROUND_HALF_CEIL', () => {
      it('should pass', () => {
        const rm = { roundingMode: RoundingMode.ROUND_HALF_CEIL };
        expect(new Fraction('1.4').toFixed(0, rm)).toBe('1');
        expect(new Fraction('1.5').toFixed(0, rm)).toBe('2');
        expect(new Fraction('1.6').toFixed(0, rm)).toBe('2');

        expect(new Fraction('-1.4').toFixed(0, rm)).toBe('-1');
        expect(new Fraction('-1.5').toFixed(0, rm)).toBe('-1');
        expect(new Fraction('-1.6').toFixed(0, rm)).toBe('-2');
      });
    });

    // (8) ROUND_HALF_FLOOR
    // Rounds towards nearest neighbour. If equidistant, rounds towards -Infinity
    describe('RoundingMode.ROUND_HALF_FLOOR', () => {
      it('should pass', () => {
        const rm = { roundingMode: RoundingMode.ROUND_HALF_FLOOR };
        expect(new Fraction('1.4').toFixed(0, rm)).toBe('1');
        expect(new Fraction('1.5').toFixed(0, rm)).toBe('1');
        expect(new Fraction('1.6').toFixed(0, rm)).toBe('2');

        expect(new Fraction('-1.4').toFixed(0, rm)).toBe('-1');
        expect(new Fraction('-1.5').toFixed(0, rm)).toBe('-2');
        expect(new Fraction('-1.6').toFixed(0, rm)).toBe('-2');
      });
    });
  });

  describe('trailing zeros', () => {
    it('should have trailing zeros', () => {
      expect(new Fraction('1.4').toFixed(0)).toBe('1');
      expect(new Fraction('1.4').toFixed(1)).toBe('1.4');
      expect(new Fraction('1.4').toFixed(2)).toBe('1.40');
      expect(new Fraction('1.4').toFixed(3)).toBe('1.400');

      expect(new Fraction('1.5').toFixed(0)).toBe('2');
      expect(new Fraction('1.5').toFixed(1)).toBe('1.5');
      expect(new Fraction('1.5').toFixed(2)).toBe('1.50');
      expect(new Fraction('1.5').toFixed(3)).toBe('1.500');

      expect(new Fraction('1.6').toFixed(0)).toBe('2');
      expect(new Fraction('1.6').toFixed(1)).toBe('1.6');
      expect(new Fraction('1.6').toFixed(2)).toBe('1.60');
      expect(new Fraction('1.6').toFixed(3)).toBe('1.600');
    });

    it('should remove trailing zeros', () => {
      const opts: ToFixedOptions = { trailingZeros: false };
      expect(new Fraction('1.4').toFixed(0, opts)).toBe('1');
      expect(new Fraction('1.4').toFixed(1, opts)).toBe('1.4');
      expect(new Fraction('1.4').toFixed(2, opts)).toBe('1.4');
      expect(new Fraction('1.4').toFixed(3, opts)).toBe('1.4');

      expect(new Fraction('1.5').toFixed(0, opts)).toBe('2');
      expect(new Fraction('1.5').toFixed(1, opts)).toBe('1.5');
      expect(new Fraction('1.5').toFixed(2, opts)).toBe('1.5');
      expect(new Fraction('1.5').toFixed(3, opts)).toBe('1.5');

      expect(new Fraction('1.6').toFixed(0, opts)).toBe('2');
      expect(new Fraction('1.6').toFixed(1, opts)).toBe('1.6');
      expect(new Fraction('1.6').toFixed(2, opts)).toBe('1.6');
      expect(new Fraction('1.6').toFixed(3, opts)).toBe('1.6');
    });
  });
});
