import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Token } from "../types/token";
import { RootState } from "src/state";
import { requiredSwapSrc } from "../utils/swap";

export const tokenApi = createApi({
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
      (token) =>
        token.symbol === state.swapInputs.srcToken?.symbol &&
        token.chainId === state.swapInputs?.destChain?.id
    );

export const selectCrosschainTokenAtSrcChain = (state: RootState) => {
  const { srcToken, destToken, destChain } = state.swapInputs;
  if (!srcToken) return null;
  if (!destToken) return null;
  if (!destChain) return null;

  const isRequiredSwapAtSrc = requiredSwapSrc(srcToken);
  if (!isRequiredSwapAtSrc) return srcToken;

  return tokenApi.endpoints.getTokens
    .select()(state)
    .data?.find((token) => {
      const isSrcChain = token.chainId === state.swapInputs?.srcChain?.id;
      return (
        isSrcChain &&
        token.address.toLowerCase() ===
          state.swapInputs?.srcChain?.defaultCrosschainToken.toLowerCase()
      );
    });
};
export const selectCrosschainTokenAtDestChain = (state: RootState) => {
  const { srcToken, destToken, destChain } = state.swapInputs;
  if (!srcToken) return null;
  if (!destToken) return null;
  if (!destChain) return null;

  const isRequiredSwapAtSrc = requiredSwapSrc(srcToken);

  return tokenApi.endpoints.getTokens
    .select()(state)
    .data?.find((token) => {
      const isDestChain = token.chainId === state.swapInputs?.destChain?.id;
      if (isRequiredSwapAtSrc) {
        return (
          isDestChain &&
          token.address.toLowerCase() ===
            state.swapInputs?.destChain?.defaultCrosschainToken.toLowerCase()
        );
      } else {
        return isDestChain && token.symbol === srcToken.symbol;
      }
    });
};

export const selectDestTokenAtSrcChain = (state: RootState) =>
  tokenApi.endpoints.getTokens
    .select()(state)
    .data?.find(
      (token) =>
        token.symbol === state.swapInputs.destToken?.symbol &&
        token.chainId === state.swapInputs.srcChain?.id
    );

export const selectTokensByChainId = (state: RootState, chainId?: number) => {
  return tokenApi.endpoints.getTokens
    .select()(state)
    .data?.filter((token) => token.chainId === chainId);
};

type TokenData = {
  data?: Token[];
};

export const selectTokensByChainIdHook =
  (chainId?: number) =>
  ({ data }: TokenData) => ({
    tokens: chainId ? data?.filter((token) => token.chainId === chainId) : [],
  });
