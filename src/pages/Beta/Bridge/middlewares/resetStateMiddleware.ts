import {
  createListenerMiddleware,
  TypedStartListening,
} from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import { setSrcChain, setSrcToken } from "../slices/swapInputSlice";
import { clear } from "../slices/balanceSlice";

export const resetStateMiddleware = createListenerMiddleware();

type ResetStateStartListening = TypedStartListening<RootState, AppDispatch>;

const resetStateStartListening =
  resetStateMiddleware.startListening as ResetStateStartListening;

resetStateStartListening({
  // returns true when both tokens and srcChain are existed, otherwise returns false.
  predicate: (action, currentState, previousState) => {
    if (previousState.swapInputs.senderAddress) {
      return !currentState.swapInputs.senderAddress;
    }
    return false;
  },
  effect: async (_action, listenerApi) => {
    listenerApi.dispatch(setSrcChain(undefined));
    listenerApi.dispatch(setSrcToken(undefined));
    listenerApi.dispatch(clear());
  },
});
