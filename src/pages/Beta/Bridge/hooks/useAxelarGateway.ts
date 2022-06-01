import {
  AxelarGateway,
  Environment,
  EvmChain,
} from "@axelar-network/axelarjs-sdk";
import { ethers } from "ethers";
import { selectSrcChain } from "../slices/swapInputSlice";
import { useAppSelector } from "./useAppSelector";

const useAxelarGateway = () => {
  const chain = useAppSelector(selectSrcChain);

  if (chain) {
    return AxelarGateway.create(
      Environment.TESTNET,
      chain?.name?.toString() as EvmChain,
      new ethers.providers.JsonRpcProvider(chain?.rpcUrls[0])
    );
  } else return null;
};

export default useAxelarGateway;
