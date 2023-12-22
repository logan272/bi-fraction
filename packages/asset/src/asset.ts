import invariant from 'tiny-invariant';

export class Asset {
  /**
   * The decimals used in representing the `asset`.
   */
  public readonly decimals: number;

  /**
   * The symbol of the `asset`.
   */
  public readonly symbol: string;

  /**
   * The decimal scale of the `asset`, used for conversions.
   */
  public get decimalScale(): bigint {
    return 10n ** BigInt(this.decimals);
  }

  /**
   * Constructs an instance of the `Asset` class.
   *
   * @param symbol symbol of the asset
   * @param decimals decimals of the asset
   */
  constructor(symbol: string, decimals: number) {
    invariant(
      decimals >= 0 && decimals < 255 && Number.isInteger(decimals),
      'DECIMALS',
    );

    this.decimals = decimals;
    this.symbol = symbol;
  }

  /**
   * Returns whether this asset is functionally equivalent to the other asset
   * @param other the other asset
   */
  public eq(other: Asset): boolean {
    return this.symbol === other.symbol && this.decimals === other.decimals;
  }

  /**
   * Returns whether this asset is not functionally equivalent to the other asset
   * @param other the other asset
   */
  public neq(other: Asset): boolean {
    return !this.eq(other);
  }
}
