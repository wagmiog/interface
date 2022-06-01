import {
  createListenerMiddleware,
  TypedStartListening,
} from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import {
  setChain,
  setDestApprovalTx,
  setStep,
  setSrcTx,
} from "../slices/swapStatusSlice";
import { ethers } from "ethers";
import { getProvider } from "../utils/provider";
import erc20Abi from "../abi/erc20.json";

export const sendStatusMiddleware = createListenerMiddleware();

type RootStartListening = TypedStartListening<RootState, AppDispatch>;

const sendStatusStartListening =
  sendStatusMiddleware.startListening as RootStartListening;

sendStatusStartListening({
  predicate: (action, currentState, _prevState) => {
    const destTokenAddress =
      currentState.swapInputs.destToken?.address?.toLowerCase();
    const destCrosschainTokenAddress =
      currentState.swapInputs.destChain?.crosschainToken?.toLowerCase();
    return (
      action.type === setSrcTx.type &&
      destTokenAddress === destCrosschainTokenAddress
    );
  },
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    const txHash = state.swapStatus.srcTx;
    const srcChain = state.swapInputs.srcChain;
    const destChain = state.swapInputs.destChain;
    if (!srcChain || !destChain || !txHash) return;
    const srcProvider = getProvider(srcChain);
    const destProvider = getProvider(destChain);

    listenerApi.dispatch(setChain(srcChain.name));

    await srcProvider.waitForTransaction(txHash, 1);
    listenerApi.dispatch(setStep(1));

    // wait for TransferEvent
    const erc20Contract = new ethers.Contract(
      destChain.crosschainToken,
      erc20Abi,
      destProvider
    );
    const eventFilter = erc20Contract.filters.Transfer(
      ethers.constants.AddressZero,
      state.swapInputs.recipientAddress
    );
    erc20Contract.once(eventFilter, (...args) => {
      const txHash = args[args.length - 1].transactionHash;
      listenerApi.dispatch(setStep(2));
      listenerApi.dispatch(setDestApprovalTx(txHash));
    });
  },
});
