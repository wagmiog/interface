import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { RootState } from "src/state";
import { FeeRequest, FeeResponse } from "../types/api";
import { selectCrosschainTokenAtSrcChain } from "./tokenSlice";

export const transferFeeApi: any = createApi({
  reducerPath: "transferFee",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getTransferFee: builder.query<string, FeeRequest>({
      query: ({ srcChain, destChain, srcToken }) => {
        const params = new URLSearchParams({
          sourceChain: srcChain?.name || "",
          destinationChain: destChain.name,
          commonKey: srcToken?.commonKey || "uusd",
        });
        return `api/fee/?${params.toString()}`;
      },
      transformResponse: (response: FeeResponse, meta, arg) => {
        if (response.data) {
          return response.data;
        } else {
          throw new Error(response.error);
        }
      },
    }),
  }),
});

export const { useGetTransferFeeQuery } = transferFeeApi;

export const fetchTransferFee = (state: RootState) => {
  const srcToken = selectCrosschainTokenAtSrcChain(state);
  return transferFeeApi.endpoints.getTransferFee.initiate({
    destChain: state.swapInputs.destChain,
    srcChain: state.swapInputs.srcChain,
    srcToken,
  });
};