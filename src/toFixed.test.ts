import { RoundingMode } from './bn';
import { Fraction } from './fraction';

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
    // Rounds away from zero
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
    // Rounds towards nearest neighbour. If equidistant, rounds away from zero
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

  describe('Trailing Zero', () => {
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
      const opts = { removeTrailingZeros: true };
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
