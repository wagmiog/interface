import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "src/state";
import { ChainId } from "../types/chain";

export interface Balance {
  address: string;
  amount: string;
}

export type BalanceState = Record<ChainId, Record<string, string>>;

const initialState: BalanceState = {
  [ChainId.AVALANCHE]: {
    "0x43F4600b552089655645f8c16D86A5a9Fa296bc3": "0",
    "0x46Cc87ea84586C03bB2109ED9B33F998d40B7623": "0",
    "0x50a70aBb7bd6EbBcC46Df7C0d033C568F563cA27": "0",
    "0xBD9919D79ADE4a280Ff357e9E8206141bdbbCcdf": "0"
  },
  [ChainId.ETHEREUM]: {
    "0x7Aa125543B9D4a361f58aC1Ff3Bea86eAF6D948B": "0",
    "0x136c8635c146d4286f0309075bcce4a7f21b6e80": "0",
    "0x321C017c08b681b1a34909eb159ed128772a5Bbe": "0",
    "0x1487F3faefE78792CDC48D87FF32aaC6650fd85f": "0"
  },
  [ChainId.MOONBEAM]: {
    "0x8a6614F33EC72FB70084B22b2EFfb643424e9Cc9": "0",
    "0x62fB3eD3468275E3676456a49122F6F45803B217": "0",
    "0xD34007Bb8A54B2FBb1D6647c5AbA04D507ABD21d": "0",
    "0xa1cF442E73045F1ea9960499FC8771454a01019D": "0"
  },
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