import invariant from 'tiny-invariant';

import { BaseCurrency } from './baseCurrency';
import type { Currency } from './currency';

export interface SerializedToken {
  chainId: number;
  address: string;
  decimals: number;
  symbol: string;
  name?: string;
  projectLink?: string;
}

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token extends BaseCurrency {
  public readonly isNative: false = false as const;
  public readonly isToken: true = true as const;

  /**
   * The contract address on the chain on which this token lives
   */
  public readonly address: string;

  public readonly projectLink?: string;

  public constructor(
    chainId: number,
    address: string,
    decimals: number,
    symbol: string,
    name?: string,
    projectLink?: string,
  ) {
    super(chainId, decimals, symbol, name);
    this.address = address;
    this.projectLink = projectLink;
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
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

  public get serialize(): SerializedToken {
    return {
      address: this.address,
      chainId: this.chainId,
      decimals: this.decimals,
      symbol: this.symbol,
      name: this.name,
      projectLink: this.projectLink,
    };
  }
}
