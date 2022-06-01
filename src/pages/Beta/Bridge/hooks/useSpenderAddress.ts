// import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { selectSrcChain } from "../slices/swapInputSlice";
import { useAppSelector } from "./useAppSelector";
import useSwapChecker, { SWAP_TYPE } from "./useSwapChecker";

const useSpenderAddress = () => {
  const srcChain = useAppSelector(selectSrcChain);
  // const router = useRouter();
  const swapType = useSwapChecker();
  const [spender, setSpender] = useState<string>();

  useEffect(() => {
    if (!srcChain) return;
    let _spender;
    // if (router?.pathname?.includes("airdrop")) {
    //   _spender = srcChain.distributionENSExecutableAddress;
    // } else {
      if (swapType === SWAP_TYPE.SEND) {
        _spender = srcChain.gatewayAddress;
      } else {
        _spender = srcChain.swapExecutorAddress;
      }
    // }

    setSpender(_spender);
  }, [ srcChain, swapType]);

  return spender;
};

export default useSpenderAddress;
