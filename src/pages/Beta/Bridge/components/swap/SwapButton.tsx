import { ComponentStyle } from "../../types/component";
import React, { FunctionComponent, useCallback, useState } from "react";
import cn from "classnames";
import { useAppDispatch } from "../../hooks/useAppSelector";
import { Validation } from "../../hooks/useAmountValidator";
import { setSrcTx } from "../../slices/swapStatusSlice";
import useSwapChecker, { SWAP_TYPE } from "../../hooks/useSwapChecker";
import useSwap from "../../hooks/useSwap";
import { useConnect } from "wagmi";

interface SwapButtonProps extends ComponentStyle {
  amount: string;
  amountValidation: Validation;
}

export const SwapButton: FunctionComponent<SwapButtonProps> = ({
  className,
  amount,
  amountValidation,
}) => {
  const { isConnected } = useConnect();
  const swapType = useSwapChecker();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { swapOnlyDest, swapSrcAndDest, swapOnlySrc, sendToken } = useSwap();

  const selectSwapFunction = useCallback(() => {
    if (swapType === SWAP_TYPE.SEND_SWAP) {
      return () => swapOnlyDest();
    } else if (swapType === SWAP_TYPE.SWAP_SEND_SWAP) {
      return () => swapSrcAndDest();
    } else if (swapType === SWAP_TYPE.SWAP_SEND) {
      return () => swapOnlySrc();
    } else if (swapType === SWAP_TYPE.SEND) {
      return () => sendToken();
    }
    return ;
  }, [sendToken, swapOnlyDest, swapOnlySrc, swapSrcAndDest, swapType]);

  const swap = useCallback(async () => {
    setLoading(true);

    const swapFn = selectSwapFunction();
    if (!swapFn) return;

    const result = await swapFn().catch((e) => setLoading(false));
    if (result) {
      const { tx, traceId, payloadHash } = result;
      if (tx) {
        dispatch(setSrcTx({ txHash: tx.hash, payloadHash, traceId }));
        // if (payloadHash) {
        //   push(`/tx/swap/${srcChain.name}/${tx.hash}`);
        // } else {
        //   push(`/tx/send/${srcChain.name}/${tx.hash}`);
        // }
      }
    }

    setLoading(false);
  }, [selectSwapFunction, dispatch]);

  if (!isConnected) {
    return (
      <button disabled className={"btn"}>
        CONNECT YOUR WALLET TO SWAP
      </button>
    );
  }

  return (
    <button
      className={cn(
        `btn text-white bg-gradient-to-r from-[#760FC8] to-[#7522DE] disabled:bg-opacity-30 transition-all ease-in ${className}`,
        {
          loading: loading,
        }
      )}
      onClick={swap}
    >
      Swap
    </button>
  );
};
