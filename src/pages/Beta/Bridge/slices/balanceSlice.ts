import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "src/state";
import { ChainId } from "../types/chain";

export interface Balance {
  address: string;
  amount: string;
}

export type BalanceState = Record<ChainId, Record<string, string>>;

const initialState: BalanceState = {
  [ChainId.AVALANCHE]: {},
  [ChainId.ETHEREUM]: {},
  [ChainId.MOONBEAM]: {},
};

export const balanceSlice = createSlice({
  name: "balances",
  initialState: initialState,
  reducers: {
    setBalances: (
      state: BalanceState,
      action: PayloadAction<{ chainId: ChainId; balances: Balance[] }>
    ) => {
      for (const balance of action.payload.balances) {
        state[action.payload.chainId][balance.address] = balance.amount;
      }
    },
    clear: (state: BalanceState) => {
      state[ChainId.MOONBEAM] = {};
      state[ChainId.ETHEREUM] = {};
      state[ChainId.AVALANCHE] = {};
    },
  },
});

export const { setBalances, clear } = balanceSlice.actions;

export const selectBalancesByChainId = (
  state: RootState,
  chainId?: ChainId
) => {
  //ATTENTION ICI var state renvoit pas la meme chose que dans le vrai site
  console.log("state", state)
  if (!chainId) return {};
  return state.balances[chainId];
};

export default balanceSlice.reducer;
