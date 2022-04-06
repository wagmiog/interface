import {
  ChainId,
  CHAIN_ID_FANTOM,
  CHAIN_ID_AVAX
} from "@certusone/wormhole-sdk";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StateSafeWormholeWrappedInfo } from "../hooks/bridgeHooks/useCheckIfWormholeWrapped";
import { ForeignAssetInfo } from "../hooks/bridgeHooks/useFetchForeignAsset";
import {
  DataWrapper,
  errorDataWrapper,
  fetchDataWrapper,
  getEmptyDataWrapper,
  receiveDataWrapper,
} from "./helpers";

const LAST_STEP = 3;

type Steps = 0 | 1 | 2 | 3;

export interface ParsedTokenAccount {
  publicKey: string;
  mintKey: string;
  amount: string;
  decimals: number;
  uiAmount: number;
  uiAmountString: string;
  symbol?: string;
  name?: string;
  logo?: string;
  isNativeAsset?: boolean;
}

export interface Transaction {
  id: string;
  block: number;
}

export interface TransferState {
  activeStep: Steps;
  sourceChain: ChainId;
  isSourceAssetWormholeWrapped: boolean | undefined;
  originChain: ChainId | undefined;
  originAsset: string | undefined;
  sourceWalletAddress: string | undefined;
  sourceParsedTokenAccount: ParsedTokenAccount | undefined;
  sourceParsedTokenAccounts: DataWrapper<ParsedTokenAccount[]>;
  amount: string;
  targetChain: ChainId;
  targetAddressHex: string | undefined;
  targetAsset: DataWrapper<ForeignAssetInfo>;
  targetParsedTokenAccount: ParsedTokenAccount | undefined;
  transferTx: Transaction | undefined;
  signedVAAHex: string | undefined;
  isSending: boolean;
  isRedeeming: boolean;
  redeemTx: Transaction | undefined;
  isApproving: boolean;
  isRecovery: boolean;
}

const initialState: TransferState = {
  activeStep: 0,
  sourceChain: CHAIN_ID_AVAX,
  isSourceAssetWormholeWrapped: false,
  sourceWalletAddress: undefined,
  sourceParsedTokenAccount: undefined,
  sourceParsedTokenAccounts: getEmptyDataWrapper(),
  originChain: undefined,
  originAsset: undefined,
  amount: "",
  targetChain: CHAIN_ID_FANTOM,
  targetAddressHex: undefined,
  targetAsset: getEmptyDataWrapper(),
  targetParsedTokenAccount: undefined,
  transferTx: undefined,
  signedVAAHex: undefined,
  isSending: false,
  isRedeeming: false,
  redeemTx: undefined,
  isApproving: false,
  isRecovery: false,
};

export const transferSlice = createSlice({
  name: "transfer",
  initialState,
  reducers: {
    incrementStep: (state) => {
      if (state.activeStep < LAST_STEP) state.activeStep++;
    },
    decrementStep: (state) => {
      if (state.activeStep > 0) state.activeStep--;
    },
    setStep: (state, action: PayloadAction<Steps>) => {
      state.activeStep = action.payload;
    },
    setSourceChain: (state, action: PayloadAction<ChainId>) => {
      const prevSourceChain = state.sourceChain;
      state.sourceChain = action.payload;
      state.sourceParsedTokenAccount = undefined;
      state.sourceParsedTokenAccounts = getEmptyDataWrapper();
      // clear targetAsset so that components that fire before useFetchTargetAsset don't get stale data
      state.targetAsset = getEmptyDataWrapper();
      state.targetParsedTokenAccount = undefined;
      state.targetAddressHex = undefined;
      state.isSourceAssetWormholeWrapped = undefined;
      state.originChain = undefined;
      state.originAsset = undefined;
      if (state.targetChain === action.payload) {
        state.targetChain = prevSourceChain;
      }
    },
    setSourceWormholeWrappedInfo: (
      state,
      action: PayloadAction<StateSafeWormholeWrappedInfo>
    ) => {
      state.isSourceAssetWormholeWrapped = action.payload.isWrapped;
      state.originChain = action.payload.chainId;
      state.originAsset = action.payload.assetAddress;
    },
    setSourceWalletAddress: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.sourceWalletAddress = action.payload;
    },
    setSourceParsedTokenAccount: (
      state,
      action: PayloadAction<ParsedTokenAccount | undefined>
    ) => {
      state.sourceParsedTokenAccount = action.payload;
      // clear targetAsset so that components that fire before useFetchTargetAsset don't get stale data
      state.targetAsset = getEmptyDataWrapper();
      state.targetParsedTokenAccount = undefined;
      state.targetAddressHex = undefined;
      state.isSourceAssetWormholeWrapped = undefined;
      state.originChain = undefined;
      state.originAsset = undefined;
    },
    setSourceParsedTokenAccounts: (
      state,
      action: PayloadAction<ParsedTokenAccount[] | undefined>
    ) => {
      state.sourceParsedTokenAccounts = action.payload
        ? receiveDataWrapper(action.payload)
        : getEmptyDataWrapper();
    },
    fetchSourceParsedTokenAccounts: (state) => {
      state.sourceParsedTokenAccounts = fetchDataWrapper();
    },
    errorSourceParsedTokenAccounts: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.sourceParsedTokenAccounts = errorDataWrapper(
        action.payload || "An unknown error occurred."
      );
    },
    receiveSourceParsedTokenAccounts: (
      state,
      action: PayloadAction<ParsedTokenAccount[]>
    ) => {
      state.sourceParsedTokenAccounts = receiveDataWrapper(action.payload);
    },
    setAmount: (state, action: PayloadAction<string>) => {
      state.amount = action.payload;
    },
    setTargetChain: (state, action: PayloadAction<ChainId>) => {
      const prevTargetChain = state.targetChain;
      state.targetChain = action.payload;
      state.targetAddressHex = undefined;
      // clear targetAsset so that components that fire before useFetchTargetAsset don't get stale data
      state.targetAsset = getEmptyDataWrapper();
      state.targetParsedTokenAccount = undefined;
      if (state.sourceChain === action.payload) {
        state.sourceChain = prevTargetChain;
        state.activeStep = 0;
        state.sourceParsedTokenAccount = undefined;
        state.isSourceAssetWormholeWrapped = undefined;
        state.originChain = undefined;
        state.originAsset = undefined;
        state.sourceParsedTokenAccounts = getEmptyDataWrapper();
      }
    },
    setTargetAddressHex: (state, action: PayloadAction<string | undefined>) => {
      state.targetAddressHex = action.payload;
    },
    setTargetAsset: (
      state,
      action: PayloadAction<DataWrapper<ForeignAssetInfo>>
    ) => {
      state.targetAsset = action.payload;
      state.targetParsedTokenAccount = undefined;
    },
    setTargetParsedTokenAccount: (
      state,
      action: PayloadAction<ParsedTokenAccount | undefined>
    ) => {
      state.targetParsedTokenAccount = action.payload;
    },
    setTransferTx: (state, action: PayloadAction<Transaction>) => {
      state.transferTx = action.payload;
    },
    setSignedVAAHex: (state, action: PayloadAction<string>) => {
      state.signedVAAHex = action.payload;
      state.isSending = false;
      state.activeStep = 3;
    },
    setIsSending: (state, action: PayloadAction<boolean>) => {
      state.isSending = action.payload;
    },
    setIsRedeeming: (state, action: PayloadAction<boolean>) => {
      state.isRedeeming = action.payload;
    },
    setRedeemTx: (state, action: PayloadAction<Transaction>) => {
      state.redeemTx = action.payload;
      state.isRedeeming = false;
    },
    setIsApproving: (state, action: PayloadAction<boolean>) => {
      state.isApproving = action.payload;
    },
    reset: (state) => ({
      ...initialState,
      sourceChain: state.sourceChain,
      targetChain: state.targetChain,
    }),
    setRecoveryVaa: (
      state,
      action: PayloadAction<{
        vaa: any;
        parsedPayload: {
          targetChain: ChainId;
          targetAddress: string;
          originChain: ChainId;
          originAddress: string;
          amount: string;
        };
      }>
    ) => {
      const prevTargetChain = state.targetChain;
      state.signedVAAHex = action.payload.vaa;
      state.targetChain = action.payload.parsedPayload.targetChain;
      if (state.sourceChain === action.payload.parsedPayload.targetChain) {
        state.sourceChain = prevTargetChain;
      }
      state.sourceParsedTokenAccount = undefined;
      state.sourceParsedTokenAccounts = getEmptyDataWrapper();
      // clear targetAsset so that components that fire before useFetchTargetAsset don't get stale data
      state.targetAsset = getEmptyDataWrapper();
      state.targetParsedTokenAccount = undefined;
      state.isSourceAssetWormholeWrapped = undefined;
      state.targetAddressHex = action.payload.parsedPayload.targetAddress;
      state.originChain = action.payload.parsedPayload.originChain;
      state.originAsset = action.payload.parsedPayload.originAddress;
      state.amount = action.payload.parsedPayload.amount;
      state.activeStep = 3;
      state.isRecovery = true;
    },
  },
});

export const {
  incrementStep,
  decrementStep,
  setStep,
  setSourceChain,
  setSourceWormholeWrappedInfo,
  setSourceWalletAddress,
  setSourceParsedTokenAccount,
  setSourceParsedTokenAccounts,
  receiveSourceParsedTokenAccounts,
  errorSourceParsedTokenAccounts,
  fetchSourceParsedTokenAccounts,
  setAmount,
  setTargetChain,
  setTargetAddressHex,
  setTargetAsset,
  setTargetParsedTokenAccount,
  setTransferTx,
  setSignedVAAHex,
  setIsSending,
  setIsRedeeming,
  setRedeemTx,
  setIsApproving,
  reset,
  setRecoveryVaa,
} = transferSlice.actions;

export default transferSlice.reducer;
