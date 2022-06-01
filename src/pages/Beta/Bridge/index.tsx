import AmountInput from "./components/AmountInput";
import ChainInput from "./components/ChainInput";
import InputContainer from "./components/InputContainer";
import SwapButton from "./components/SwapButton";
import SwapContainer from "./components/SwapContainer";
import TokenInput from "./components/TokenInput";
import { useAppDispatch, useAppSelector } from "./hooks/useAppSelector";
import {
  selectAmount,
  selectDestChain,
  selectDestToken,
  selectSrcChain,
  selectSrcToken,
} from "./slices/swapInputSlice";
import React, { useEffect } from "react";
import useAmountValidator from "./hooks/useAmountValidator";
import useApproveChecker from "./hooks/useApproveChecker";
import ApproveButton from "./components/ApproveButton";
import { resetSwapStatus } from "./slices/swapStatusSlice";
import SwapEstimator from "./components/SwapEstimator";
import { TokenInputModalKey } from "./components/TokenInput/TokenInputModal";
import { ChainInputModalKey } from "./components/ChainInput/ChainInputModal";
import AddressInput from "./components/AddressInput";
import SwapRoute from "./components/SwapRoute";

const Bridge = () => {
  const dispatch = useAppDispatch();
  const amount = useAppSelector(selectAmount);
  const srcChain = useAppSelector(selectSrcChain);
  const srcToken = useAppSelector(selectSrcToken);
  const destChain = useAppSelector(selectDestChain);
  const destToken = useAppSelector(selectDestToken);
  const isRequiredApproval = useApproveChecker();
  const amountValidation = useAmountValidator(amount, srcToken);

  useEffect(() => {
    dispatch(resetSwapStatus());
  }, [dispatch]);

  return (
    <SwapContainer>
      <h1 className="text-3xl font-thin text-center text-white">
        Cross Chain Swap
      </h1>
      <div className="mt-5">
        <div className="mb-2 font-light text-white">From</div>
        <InputContainer>
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <ChainInput
                  selectedChain={srcChain}
                  label="From"
                  modalKey={ChainInputModalKey.ModalChainFrom}
                  isSrcChain={true}
                />
              </div>
              <div>
                <TokenInput
                  label="Send"
                  className="mt-2"
                  modalKey={TokenInputModalKey.ModalTokenInput}
                  selectedToken={srcToken}
                />
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div>
              <AmountInput
                className="mt-4"
                selectedToken={srcToken}
                validState={amountValidation}
              />
            </div>
          </div>
        </InputContainer>
      </div>

      <div className="mt-5">
        <div className="mb-2 font-light text-white">To</div>
        <InputContainer>
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <ChainInput
                  selectedChain={destChain}
                  label="To"
                  modalKey={ChainInputModalKey.ModalChainTo}
                />
              </div>
              <div>
                <TokenInput
                  label="Receive"
                  className="mt-2"
                  modalKey={TokenInputModalKey.ModalTokenOutput}
                  selectedToken={destToken}
                />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <AddressInput />
          </div>
        </InputContainer>
      </div>
      {/* <div className="flex items-center justify-around my-4">
        <ChainInputSwitch />
        <TokenInputSwitch />
      </div> */}
      <div className="mt-10">
        <InputContainer>
          <SwapEstimator amount={amount} />
        </InputContainer>
        <SwapRoute />
      </div>
      <div className="flex flex-col mt-8">
        {isRequiredApproval ? (
          <ApproveButton />
        ) : (
          <SwapButton amount={amount} amountValidation={amountValidation} />
        )}
      </div>
    </SwapContainer>
  );
};

export default Bridge;
