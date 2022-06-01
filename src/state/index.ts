import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'
import application from './application/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'
import transactions from './transactions/reducer'
import swap from './swap/reducer'
import mint from './mint/reducer'
import lists from './lists/reducer'
import burn from './burn/reducer'
import multicall from './multicall/reducer'
import wyre from './wyre/reducer'
import watchlists from './watchlists/reducer'
import token from './token/reducer'
import pair from './pair/reducer'
import stake from './stake/reducer'
import { pangolinReducers, PANGOLIN_PERSISTED_KEYS } from '@pangolindex/components'
import balanceReducer from "src/pages/Beta/Bridge/slices/balanceSlice";
import swapInputReducer from "src/pages/Beta/Bridge/slices/swapInputSlice";
import dropInputReducer from "src/pages/Beta/Bridge/slices/dropInputSlice";
import tokenApprovalReducer from "src/pages/Beta/Bridge/slices/tokenApprovalSlice";
import swapStatusReducer from "src/pages/Beta/Bridge/slices/swapStatusSlice";
import swapEstimatorReducer from "src/pages/Beta/Bridge/slices/swapEstimatorSlice";
import { tokenApi } from "src/pages/Beta/Bridge/slices/tokenSlice";
import { transferFeeApi } from "src/pages/Beta/Bridge/slices/transferFeeSlice";


const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists', 'watchlists', 'stake', ...PANGOLIN_PERSISTED_KEYS]

const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    swap,
    mint,
    burn,
    multicall,
    wyre,
    lists,
    watchlists,
    token,
    pair,
    stake,
    swapInputs: swapInputReducer,
    dropInputs: dropInputReducer,
    balances: balanceReducer,
    tokenApprovals: tokenApprovalReducer,
    swapStatus: swapStatusReducer,
    swapEstimator: swapEstimatorReducer,
    [tokenApi.reducerPath]: tokenApi.reducer,
    [transferFeeApi.reducerPath]: transferFeeApi.reducer,
    ...pangolinReducers
  },
  middleware: [...getDefaultMiddleware({ thunk: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS })
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
