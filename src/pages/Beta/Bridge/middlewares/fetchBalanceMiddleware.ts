import {
  createListenerMiddleware,
  TypedStartListening,
} from "@reduxjs/toolkit";
import { tokenApi } from "../slices/tokenSlice";
import { AppDispatch, RootState } from "../store";
import { Chain } from "../types/chain";
import { Token } from "../types/token";
import { setBalances } from "../slices/balanceSlice";
import { setSenderAddress, setSrcChain } from "../slices/swapInputSlice";
import { fetchBalance } from "../clients/apiClient";
import { setAllowances } from "../slices/tokenApprovalSlice";

export const fetchBalanceMiddleware = createListenerMiddleware();

type FetchBalanceStartListening = TypedStartListening<RootState, AppDispatch>;

const fetchBalanceStartListening =
  fetchBalanceMiddleware.startListening as FetchBalanceStartListening;

fetchBalanceStartListening({
  // returns true when both tokens and srcChain are existed, otherwise returns false.
  predicate: (action, currentState, _) => {
    if (
      action.type === "tokens/executeQuery/fulfilled" ||
      action.type === setSrcChain().type ||
      action.type === setSenderAddress().type
    ) {
      const { data } = tokenApi.endpoints.getTokens.select()(currentState);
      const srcChain = currentState.swapInputs.srcChain;
      const senderAddress = currentState.swapInputs.senderAddress;
      return !!data && !!srcChain && !!senderAddress;
    }
    return false;
  },
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState();
    const srcChain = state.swapInputs.srcChain as Chain;
    const { data } = tokenApi.endpoints.getTokens.select()(state);
    const senderAddress = state.swapInputs.senderAddress as string;
    const tokenAddresses = (data as Token[])
      .filter((token) => token.chainId === srcChain.id)
      .map((token) => token.address);

    const tokenInfos = await fetchBalance(
      senderAddress,
      [
        srcChain.swapExecutorAddress,
        srcChain.distributionENSExecutableAddress,
        srcChain.gatewayAddress,
      ],
      tokenAddresses,
      srcChain.id
    ).then((res: any) => res.data.tokenInfos);

    listenerApi.dispatch(
      setBalances({
        chainId: srcChain.id,
        balances: tokenInfos,
      })
    );
    listenerApi.dispatch(
      setAllowances({
        chainId: srcChain.id,
        tokenApprovals: tokenInfos,
      })
    );
  },
});
