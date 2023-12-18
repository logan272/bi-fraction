import { BaseCurrency } from './baseCurrency';

/**
 * Represents the native currency of the chain on which it resides, e.g.
 */
export abstract class NativeCurrency extends BaseCurrency {
  // Indicate that isNative is always true for NativeCurrency
  public readonly isNative = true as const;

  // Indicate that isToken is always false for NativeCurrency
  public readonly isToken = false as const;
}
