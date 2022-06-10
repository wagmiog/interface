import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "src/state";
import { ChainId } from "../types/chain";

export interface TokenApproval {
  address: string;
  approvals: Approval[];
}

export interface Approval {
  spender: string;
  allowance: string;
}

export type TokenApprovalState = Record<
  ChainId,
  Record<string, Record<string, string>>
>;

const initialState: TokenApprovalState = {
  [ChainId.AVALANCHE]: {
    "0x43F4600b552089655645f8c16D86A5a9Fa296bc3": {
      "0x8e20A82f3d20cF9c34c116431e7B24499D6639e5": "0",
      "0xC249632c2D40b9001FE907806902f63038B737Ab": "0",
      "0xf6Da84C51b5C82039E9E3c64ccb3F1b05d7EF1Be": "0",
    }, "0x46Cc87ea84586C03bB2109ED9B33F998d40B7623": {
      "0x8e20A82f3d20cF9c34c116431e7B24499D6639e5": "0",
      "0xC249632c2D40b9001FE907806902f63038B737Ab": "0",
      "0xf6Da84C51b5C82039E9E3c64ccb3F1b05d7EF1Be": "0",
    }, "0x50a70aBb7bd6EbBcC46Df7C0d033C568F563cA27": {
      "0x8e20A82f3d20cF9c34c116431e7B24499D6639e5": "0",
      "0xC249632c2D40b9001FE907806902f63038B737Ab": "0",
      "0xf6Da84C51b5C82039E9E3c64ccb3F1b05d7EF1Be": "0",
    }, "0xBD9919D79ADE4a280Ff357e9E8206141bdbbCcdf": {
      "0x8e20A82f3d20cF9c34c116431e7B24499D6639e5": "0",
      "0xC249632c2D40b9001FE907806902f63038B737Ab": "0",
      "0xf6Da84C51b5C82039E9E3c64ccb3F1b05d7EF1Be": "0",
    }
  },
  [ChainId.ETHEREUM]: {
    "0x7Aa125543B9D4a361f58aC1Ff3Bea86eAF6D948B": {
      "0xAAF36440Fc91AC239E0C086bC44993d2337446F2": "0",
      "0xBC6fcce7c5487d43830a219CA6E7B83238B41e71": "0",
      "0xb123d4aA48fC5012293cf4BFD3659277468e27Cf": "0",
    }, "0x136c8635c146d4286f0309075bcce4a7f21b6e80": {
      "0xAAF36440Fc91AC239E0C086bC44993d2337446F2": "0",
      "0xBC6fcce7c5487d43830a219CA6E7B83238B41e71": "0",
      "0xb123d4aA48fC5012293cf4BFD3659277468e27Cf": "0",
    }, "0x321C017c08b681b1a34909eb159ed128772a5Bbe": {
      "0xAAF36440Fc91AC239E0C086bC44993d2337446F2:": "0",
      "0xBC6fcce7c5487d43830a219CA6E7B83238B41e71": "0",
      "0xb123d4aA48fC5012293cf4BFD3659277468e27Cf": "0",
    }, "0x1487F3faefE78792CDC48D87FF32aaC6650fd85f": {
      "0xAAF36440Fc91AC239E0C086bC44993d2337446F2:": "0",
      "0xBC6fcce7c5487d43830a219CA6E7B83238B41e71": "0",
      "0xb123d4aA48fC5012293cf4BFD3659277468e27Cf": "0",
    }
  },
  [ChainId.MOONBEAM]: {
    "0x8a6614F33EC72FB70084B22b2EFfb643424e9Cc9": {
      "0x5769D84DD62a6fD969856c75c7D321b84d455929": "0",
      "0xD05180187165eED557c90AB907D1C0B1dd35bDD6": "0",
      "0xd8f31EbCE3D553a1c159725D3e1140f56492de3e": "0",
    }, "0x62fB3eD3468275E3676456a49122F6F45803B217": {
      "0xAAF36440Fc91AC239E0C086bC44993d2337446F2": "0",
      "0xBC6fcce7c5487d43830a219CA6E7B83238B41e71": "0",
      "0xb123d4aA48fC5012293cf4BFD3659277468e27Cf": "0",
    }, "0xD34007Bb8A54B2FBb1D6647c5AbA04D507ABD21d": {
      "0xAAF36440Fc91AC239E0C086bC44993d2337446F2:": "0",
      "0xBC6fcce7c5487d43830a219CA6E7B83238B41e71": "0",
      "0xb123d4aA48fC5012293cf4BFD3659277468e27Cf": "0",
    }, "0xa1cF442E73045F1ea9960499FC8771454a01019D": {
      "0xAAF36440Fc91AC239E0C086bC44993d2337446F2:": "0",
      "0xBC6fcce7c5487d43830a219CA6E7B83238B41e71": "0",
      "0xb123d4aA48fC5012293cf4BFD3659277468e27Cf": "0",
    }
  },
};

export const tokenApprovalSlice = createSlice({
  name: "allowances",
  initialState: initialState,
  reducers: {
    setAllowances: (
      state: TokenApprovalState,
      action: PayloadAction<{
        chainId: ChainId;
        tokenApprovals: TokenApproval[];
      }>
    ) => {
      for (const tokenApproval of action.payload.tokenApprovals) {
        for (const approval of tokenApproval.approvals) {
          if (!state[action.payload.chainId][tokenApproval.address])
            state[action.payload.chainId][tokenApproval.address] = {};

          state[action.payload.chainId][tokenApproval.address][
            approval.spender
          ] = approval.allowance;
        }
      }
    },
    setAllowance: (
      state: TokenApprovalState,
      action: PayloadAction<{ chainId: ChainId; tokenApproval: TokenApproval }>
    ) => {
      const payload = action.payload;
      state[payload.chainId][payload.tokenApproval.address][
        payload.tokenApproval.approvals[0].spender
      ] = payload.tokenApproval.approvals[0].allowance;
    },
    clear: (state: TokenApprovalState) => {
      state[ChainId.MOONBEAM] = {};
      state[ChainId.ETHEREUM] = {};
      state[ChainId.AVALANCHE] = {};
    },
  },
});

export const { setAllowances, setAllowance, clear } =
  tokenApprovalSlice.actions;

export const selectTokenApprovalByChainId = (
  state: RootState,
  chainId?: ChainId
) => {
  if (!chainId) return {};
  return state.tokenApprovals[chainId];
};

export default tokenApprovalSlice.reducer;
