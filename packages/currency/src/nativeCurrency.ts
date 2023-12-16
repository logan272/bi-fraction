import { BaseCurrency } from './baseCurrency';
import type { Currency } from './currency';

/**
 * Represents the native currency of the chain on which it resides, e.g.
 */
export abstract class NativeCurrency extends BaseCurrency {
  // Indicate that isNative is always true for NativeCurrency
  public readonly isNative = true as const;

  // Indicate that isToken is always false for NativeCurrency
  public readonly isToken = false as const;

  /**
   * Token type guard
   *
   * Check if a given currency is a NativeCurrency
   *
   * @param currency currency to check
   * @returns true if the currency is a NativeCurrency
   */
  public static isNative(currency: Currency): currency is NativeCurrency {
    return currency.isNative;
  }
}
