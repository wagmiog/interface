import { configureStore } from "@reduxjs/toolkit";
import { fetchBalanceMiddleware } from "../middlewares/fetchBalanceMiddleware";
import { resetStateMiddleware } from "../middlewares/resetStateMiddleware";
import balanceReducer from "../slices/balanceSlice";
import swapInputReducer from "../slices/swapInputSlice";
import dropInputReducer from "../slices/dropInputSlice";
import tokenApprovalReducer from "../slices/tokenApprovalSlice";
import swapStatusReducer from "../slices/swapStatusSlice";
import { tokenApi } from "../slices/tokenSlice";
import { swapStatusMiddleware } from "../middlewares/swapStatusMiddleware";
import { destChainMiddleware } from "../middlewares/destChainMiddleware";
import swapEstimatorReducer from "../slices/swapEstimatorSlice";
import { swapEstimatorMiddleware } from "../middlewares/swapEstimatorMiddleware";
import { srcChainMiddleware } from "../middlewares/srcChainMiddleware";
import { transferFeeApi } from "../slices/transferFeeSlice";
import { sendStatusMiddleware } from "../middlewares/sendStatusMiddleware";

export const store = configureStore({
  reducer: {
    swapInputs: swapInputReducer,
    dropInputs: dropInputReducer,
    balances: balanceReducer,
    tokenApprovals: tokenApprovalReducer,
    swapStatus: swapStatusReducer,
    swapEstimator: swapEstimatorReducer,
    [tokenApi.reducerPath]: tokenApi.reducer,
    [transferFeeApi.reducerPath]: transferFeeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      fetchBalanceMiddleware.middleware,
      resetStateMiddleware.middleware,
      swapStatusMiddleware.middleware,
      srcChainMiddleware.middleware,
      destChainMiddleware.middleware,
      swapEstimatorMiddleware.middleware,
      sendStatusMiddleware.middleware,
      tokenApi.middleware,
      transferFeeApi.middleware,
    ]),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
