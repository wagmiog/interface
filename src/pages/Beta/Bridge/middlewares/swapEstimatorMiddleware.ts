import {
  createListenerMiddleware,
  isAnyOf,
  TypedStartListening,
} from "@reduxjs/toolkit";
import {
  setError,
  setLoading,
  setSendDestAmount,
  setSwapDestAmount,
  setSwapSrcAmount,
} from "../slices/swapEstimatorSlice";
import { setAmount, setDestToken, setSrcToken } from "../slices/swapInputSlice";
import {
  selectCrosschainTokenAtDestChain,
  selectCrosschainTokenAtSrcChain,
} from "../slices/tokenSlice";
import { ethers } from "ethers";
import { AppDispatch, RootState } from "src/state";
import { estimateSwapOutputAmount } from "../utils/contract";
import { requiredSwapDest, requiredSwapSrc } from "../utils/swap";
import { fetchTransferFee } from "../slices/transferFeeSlice";

// import { fetchTransferFee } from "../slices/transferFeeSlice";

export const swapEstimatorMiddleware = createListenerMiddleware();

type SwapEstimatorStartListening = TypedStartListening<RootState, AppDispatch>;

const swapEstimatorStartListening =
  swapEstimatorMiddleware.startListening as SwapEstimatorStartListening;

swapEstimatorStartListening({
  matcher: isAnyOf(setSrcToken, setDestToken, setAmount),
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState();
    const { srcChain, srcToken, destChain, destToken, amount } =
      state.swapInputs;
    if (!srcChain) return;
    if (!amount) return;
    if (!srcToken) return;
    if (!destToken) return;
    const crosschainTokenAtDestChain = selectCrosschainTokenAtDestChain(state);
    const crosschainTokenAtSrcChain = selectCrosschainTokenAtSrcChain(state);
    if (!crosschainTokenAtSrcChain) return;
    if (!crosschainTokenAtDestChain) return;

    const isRequiredSwapAtSrc = requiredSwapSrc(srcToken);
    const isRequiredSwapAtDest = requiredSwapDest(
      srcToken,
      destToken,
      destChain
    );

    const feeResponse = await listenerApi.dispatch(
      fetchTransferFee(state, crosschainTokenAtSrcChain)
    );
    const fee = feeResponse.data;
    if (!fee) return;

    listenerApi.dispatch(setLoading(true));
    listenerApi.dispatch(setError(""));

    let _amount = ethers.utils.parseUnits(amount, srcToken.decimals).toString();
    try {
      if (isRequiredSwapAtSrc) {
        //  estimate swap at src chain first
        const crosschainTokenAmountSrcChain = await estimateSwapOutputAmount({
          tokenA: srcToken,
          tokenB: crosschainTokenAtSrcChain,
          chain: srcChain,
          routerAddress: srcChain.routerAddress,
          amount: _amount,
        });
        _amount = crosschainTokenAmountSrcChain || _amount;
      }
      listenerApi.dispatch(setSwapSrcAmount(_amount));

      // Deduct fee before calculating swap output at destination chain.
      _amount = ethers.BigNumber.from(_amount).sub(fee).toString();
      listenerApi.dispatch(setSendDestAmount(_amount));

      if (ethers.BigNumber.from(_amount).isNegative()) {
        listenerApi.dispatch(setError("Swap amount is too low"));
        return;
      }

      if (isRequiredSwapAtDest) {
        const destSwapAmount = await estimateSwapOutputAmount({
          tokenA: crosschainTokenAtDestChain,
          tokenB: destToken,
          chain: destChain,
          routerAddress: destChain.routerAddress,
          amount: _amount,
        });
        listenerApi.dispatch(setSwapDestAmount(destSwapAmount));
      }
    } catch (e: any) {
      listenerApi.dispatch(setError(e.message));
    }

    listenerApi.dispatch(setLoading(false));
  },
});
