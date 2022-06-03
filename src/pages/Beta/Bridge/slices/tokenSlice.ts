import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Token } from "../types/token";
import { RootState } from "src/state";

export const tokenApi: any = createApi({
  reducerPath: "tokens",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getTokens: builder.query<Token[], void>({
      query: () => `tokens.json`,
    }),
  }),
});

export const { useGetTokensQuery } = tokenApi;

export const selectSrcTokenAtDestChain = (state: RootState) =>
  tokenApi.endpoints.getTokens
    .select()(state)
    .data?.find(
      (token: any) =>
        token.symbol === state.swapInputs.srcToken?.symbol &&
        token.chainId === state.swapInputs?.destChain?.id
    );

export const selectCrosschainTokenAtDestChain = (state: RootState) =>
  tokenApi.endpoints.getTokens
    .select()(state)
    .data?.find(
      (token: any) =>
        token.address.toLowerCase() ===
          state.swapInputs?.destChain?.crosschainToken.toLowerCase() &&
        token.chainId === state.swapInputs?.destChain?.id
    );

export const selectDestTokenAtSrcChain = (state: RootState) =>
  tokenApi.endpoints.getTokens
    .select()(state)
    .data?.find(
      (token: any) =>
        token.symbol === state.swapInputs.destToken?.symbol &&
        token.chainId === state.swapInputs.srcChain?.id
    );

export const selectCrosschainTokenAtSrcChain = (state: RootState) =>
  tokenApi.endpoints.getTokens
    .select()(state)
    .data?.find(
      (token: any) =>
        token.address.toLowerCase() ===
          state.swapInputs.srcChain?.crosschainToken.toLowerCase() &&
        token.chainId === state.swapInputs.srcChain?.id
    );

type TokenData = {
  data?: Token[];
};

export const selectTokensByChainId =
  (chainId?: number) =>
  ({ data }: TokenData) => ({
    tokens: chainId ? data?.filter((token) => token.chainId === chainId) : [],
  });
