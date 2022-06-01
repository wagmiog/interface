import { ethers } from "ethers";
import { Chain } from "../types/chain";

export function getProvider(chain: Chain): ethers.providers.BaseProvider {
  return new ethers.providers.JsonRpcProvider(chain.rpcUrls[0]);
}
