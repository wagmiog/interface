import {
  createListenerMiddleware,
  TypedStartListening,
} from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "src/state";
import {
  setChain,
  setCommandId,
  setRefundAddress,
  setStep,
  setSwapFailed,
  setDestSwapTx,
  setSrcTx,
  setDestApprovalTx,
} from "../slices/swapStatusSlice";
import { ethers } from "ethers";
import { getProvider } from "../utils/provider";
import gatewayAbi from "../abi/axelarGateway.json";
import swapExecutorAbi from "../abi/swapExecutor.json";

export const swapStatusMiddleware = createListenerMiddleware();

type RootStartListening = TypedStartListening<RootState, AppDispatch>;

const swapStatusStartListening =
  swapStatusMiddleware.startListening as RootStartListening;

swapStatusStartListening({
  predicate: (action, currentState, _prevState) => {
    const destTokenAddress =
      currentState.swapInputs.destToken?.address?.toLowerCase();
    const destCrosschainTokenAddress: any =
      currentState.swapInputs.destChain?.crosschainToken?.toLowerCase();
    return (
      action.type === setSrcTx.type &&
      destTokenAddress !== destCrosschainTokenAddress
    );
  },
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    const srcChain = state.swapInputs.srcChain;
    const destChain = state.swapInputs.destChain;
    const srcTxHash = state.swapStatus.srcTx;
    const payloadHash = state.swapStatus.payloadHash;
    if (!srcChain || !destChain || !payloadHash || !srcTxHash) return;
    const srcProvider = getProvider(srcChain);
    const destProvider = getProvider(destChain);

    listenerApi.dispatch(setChain(srcChain.name));

    await srcProvider.waitForTransaction(srcTxHash, 1);
    listenerApi.dispatch(setStep(1));

    // wait for relay tx
    const gatewayContract = new ethers.Contract(
      destChain.gatewayAddress,
      gatewayAbi,
      destProvider
    );
    const eventFilter = gatewayContract.filters.ContractCallApprovedWithMint(
      null,
      null,
      null,
      destChain.swapExecutorAddress,
      payloadHash
    );
    gatewayContract.once(eventFilter, (...args) => {
      const commandId = args[0];
      const txHash = args[args.length - 1].transactionHash;
      listenerApi.dispatch(setStep(2));
      listenerApi.dispatch(setCommandId(commandId));
      listenerApi.dispatch(setDestApprovalTx(txHash));
    });
  },
});

swapStatusStartListening({
  actionCreator: setDestApprovalTx,
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState();
    const destChain = state.swapInputs.destChain;
    const traceId = state.swapStatus.traceId;
    if (!destChain) return;

    const destProvider = getProvider(destChain);
    const swapContract = new ethers.Contract(
      destChain.swapExecutorAddress,
      swapExecutorAbi,
      destProvider
    );
    const swapSuccessEvent = swapContract.filters.SwapSuccess(traceId);
    const swapFailedEvent = swapContract.filters.SwapFailed(traceId);
    swapContract.once(swapSuccessEvent, (...args) => {
      const txHash = args[args.length - 1].transactionHash;
      listenerApi.dispatch(setStep(3));
      listenerApi.dispatch(setDestSwapTx(txHash));
      listenerApi.dispatch(setSwapFailed(false));
    });
    swapContract.once(swapFailedEvent, (...args) => {
      const txHash = args[args.length - 1].transactionHash;
      listenerApi.dispatch(setStep(3));
      listenerApi.dispatch(setDestSwapTx(txHash));
      listenerApi.dispatch(setSwapFailed(true));
      const refundAddress = args[3];
      listenerApi.dispatch(setRefundAddress(refundAddress));
    });
  },
});
