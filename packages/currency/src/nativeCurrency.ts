import { BaseCurrency } from './baseCurrency';
import type { Currency } from './currency';

/**
 * Represents the native currency of the chain on which it resides, e.g.
 */
export abstract class NativeCurrency extends BaseCurrency {
  public readonly isNative = true as const;
  public readonly isToken = false as const;

  public static isNative(currency: Currency): currency is NativeCurrency {
    return currency.isNative;
  }
}
