import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chain } from "../types/chain";
import { chains } from "../constants/config";
import type { RootState } from "src/state";

interface DropInputState {
  amount: string;
  destChain: Chain;
  aliasAddresses: string[];
}

const initialState: DropInputState = {
  amount: "0",
  aliasAddresses: [],
  destChain: chains[0],
};

export const dropInputSlice = createSlice({
  name: "dropInput",
  initialState,
  reducers: {
    setAliasAddresses: (state: any, action: PayloadAction<string[]>) => {
      state.aliasAddresses = action.payload;
    },
    addAliasAddress: (state: any, action: PayloadAction<string>) => {
      state.aliasAddresses = [...state.aliasAddresses, action.payload];
    },
    removeAliasAddress: (state: any, action: PayloadAction<string>) => {
      // @ts-ignore
      state.aliasAddresses = state.aliasAddresses.filter(address => address !== action.payload);
    },
    resetDropInputs: (state: any) => initialState,
  },
});

export const {
  setAliasAddresses,
  addAliasAddress,
  removeAliasAddress,
  resetDropInputs
} = dropInputSlice.actions;

export const selectAliasAddresses = (state: RootState) => state.dropInputs.aliasAddresses;

export default dropInputSlice.reducer;
