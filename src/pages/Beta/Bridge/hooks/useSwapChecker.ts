import { useEffect, useState } from "react";
import {
  selectDestChain,
  selectDestToken,
  selectSrcChain,
  selectSrcToken,
} from "../slices/swapInputSlice";
import { useAppSelector } from "./useAppSelector";

export enum SWAP_TYPE {
  SWAP_SEND_SWAP = 1,
  SWAP_SEND = 2,
  SEND_SWAP = 3,
  SEND = 4,
}

const useSwapChecker = () => {
  const srcToken = useAppSelector(selectSrcToken);
  const destToken = useAppSelector(selectDestToken);
  const srcChain = useAppSelector(selectSrcChain);
  const destChain = useAppSelector(selectDestChain);
  const [swapType, setSwapType] = useState<SWAP_TYPE>();

  useEffect(() => {
    if (srcToken && srcChain) {
      if (
        destToken?.address.toLowerCase() !==
        destChain.crosschainToken.toLowerCase()
      ) {
        if (
          srcToken.address.toLowerCase() ===
          srcChain.crosschainToken.toLowerCase()
        ) {
          setSwapType(SWAP_TYPE.SEND_SWAP);
        } else {
          setSwapType(SWAP_TYPE.SWAP_SEND_SWAP);
        }
      } else {
        if (
          srcToken.address.toLowerCase() ===
          srcChain.crosschainToken.toLowerCase()
        ) {
          setSwapType(SWAP_TYPE.SEND);
        } else {
          setSwapType(SWAP_TYPE.SWAP_SEND);
        }
      }
    }
  }, [srcChain, srcToken, destToken?.address, destChain.crosschainToken]);

  return swapType;
};

export default useSwapChecker;
