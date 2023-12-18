import invariant from 'tiny-invariant';

import { BaseCurrency } from './baseCurrency';
import type { Currency } from './currency';

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token extends BaseCurrency {
  // Indicate that isNative is always false for tokens
  public readonly isNative: false = false as const;

  // Indicate that isToken is always true for tokens
  public readonly isToken: true = true as const;

  /**
   * The contract address on the chain on which this token lives
   */
  public readonly address: string;

  /**
   * Create a new Token instance
   *
   * @param chainId the chain ID of the token
   * @param address the contract address of the token
   * @param decimals the number of decimals the token uses
   * @param symbol the symbol of the token
   * @param name (optional) the name of the token
   */
  public constructor(
    chainId: number,
    address: string,
    decimals: number,
    symbol: string,
    name?: string,
  ) {
    super(chainId, decimals, symbol, name);
    this.address = address;
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   *
   * @param other other token to compare
   */
  public eq(other: Currency): boolean {
    return (
      other.isToken &&
      this.chainId === other.chainId &&
      this.address === other.address
    );
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   *
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: Token): boolean {
    invariant(this.chainId === other.chainId, 'CHAIN_IDS');
    invariant(
      this.address.toLowerCase() !== other.address.toLowerCase(),
      'ADDRESSES',
    );
    return this.address.toLowerCase() < other.address.toLowerCase();
  }
}
