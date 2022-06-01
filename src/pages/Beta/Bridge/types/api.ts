import { Chain } from "./chain";
import { Token } from "./token";

export type FeeResponse = {
  status: boolean;
  data?: string;
  error?: string;
};

export type FeeRequest = {
  srcChain?: Chain;
  destChain: Chain;
  srcToken?: Token;
};
