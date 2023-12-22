import { Asset } from './asset';

/**
 * Represents a ERC20 token
 */
export class Erc20Token extends Asset {
  /**
   * The name of the ERC20 token.
   */
  public readonly chainId: number;

  /**
   * The name of the ERC20 token.
   */
  public readonly address: string;

  /**
   * The name of the ERC20 token.
   */
  public readonly name?: string;

  /**
   * Constructs an instance of the base class `BaseAsset`.
   *
   * @param symbol symbol of the ERC20 token
   * @param decimals decimals of the asset
   * @param address address of the asset token
   * @param chainId chainId of the ERC20 token asset
   * @param name name of the ERC20 token
   */
  constructor(
    symbol: string,
    decimals: number,
    chainId: number,
    address: string,
    name: string,
  ) {
    super(symbol, decimals);

    this.address = address;
    this.chainId = chainId;
    this.name = name;
  }

  public override eq(other: Erc20Token): boolean {
    return (
      super.eq(other) &&
      this.chainId === other.chainId &&
      this.address === other.address
    );
  }
}
