import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { chains } from "../constants/config";
import type { RootState } from "src/state";
import { SquidChain } from "../types/chain";

interface DropInputState {
  amount: string;
  destChain: SquidChain;
  aliasAddresses: string[];
}

const initialState: DropInputState = {
  amount: "",
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
      state.aliasAddresses = state.aliasAddresses.filter(
        (address: any) => address !== action.payload
      );
    },
    resetDropInputs: (state: any) => initialState,
  },
});

export const {
  setAliasAddresses,
  addAliasAddress,
  removeAliasAddress,
  resetDropInputs,
} = dropInputSlice.actions;

export const selectAliasAddresses = (state: RootState) =>
  state.dropInputs.aliasAddresses;

export default dropInputSlice.reducer;
