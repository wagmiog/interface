export interface Token {
  chainId?: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  commonKey: string;
  logoURI: string;
}
