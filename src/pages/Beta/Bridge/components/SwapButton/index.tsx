import { ComponentStyle } from "../../types/component";
import React, { FunctionComponent, useCallback, useState } from "react";
import cn from "classnames";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";
import {
  selectDestChain,
  selectDestToken,
  selectSrcChain,
  selectSrcToken,
} from "../../slices/swapInputSlice";
import useTokens from "../../hooks/useTokens";
import { Validation } from "../../hooks/useAmountValidator";
import useSwapValidator from "../../hooks/useSwapValidator";
import { setSrcTx } from "../../slices/swapStatusSlice";
// import { useRouter } from "next/router";
import { selectEstimateAmountState } from "../../slices/swapEstimatorSlice";
import useSwapChecker, { SWAP_TYPE } from "../../hooks/useSwapChecker";
import useSwap from "../../hooks/useSwap";

interface SwapButtonProps extends ComponentStyle {
  amount: string;
  amountValidation: Validation;
}

const SwapButton: FunctionComponent<SwapButtonProps> = ({
  className,
  amount,
  amountValidation,
}) => {
  const srcChain = useAppSelector(selectSrcChain);
  const srcToken = useAppSelector(selectSrcToken);
  const destChain = useAppSelector(selectDestChain);
  const destToken = useAppSelector(selectDestToken);
  const swapType = useSwapChecker();
  const swapEstimatorState = useAppSelector(selectEstimateAmountState);
  // const { push } = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const swapDisable = useSwapValidator(amount, amountValidation);
  const destTokens = useTokens(destChain);
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
    if (!srcChain) return;
    if (!srcToken) return;
    if (!destToken) return;

    const srcTokenDestChain = destTokens.find(
      (token: any) => token.symbol === srcToken.symbol
    );
    if (!srcTokenDestChain) return;
    // the token used for sending crosschain

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
  }, [
    srcChain,
    srcToken,
    destToken,
    destTokens,
    selectSwapFunction,
    dispatch,
    // push,
  ]);

  return (
    <button
      disabled={swapDisable || loading || swapEstimatorState.loading}
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

export default SwapButton;
