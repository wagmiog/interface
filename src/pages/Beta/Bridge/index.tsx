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
import PageLayout from "./components/PageLayout";
// import { providers } from "ethers";
// import { chains } from "./constants/config";
// import { Provider } from "react-redux";
// import { store } from "./store";
// import { Provider as EvmProvider } from "wagmi";
// import { connectors } from "./clients/walletClient";

// type ProviderInput = {
//   chainId?: number;
// };

// export const provider = ({ chainId }: ProviderInput) => {
//   const chain = chains.find((chain) => chain.id === chainId);
//   if (chain) {
//     return new providers.JsonRpcProvider(chain.rpcUrls[0]);
//   } else {
//     return new providers.JsonRpcProvider(chains[0].rpcUrls[0]);
//   }
// };

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
    <PageLayout>
      <SwapContainer>
        <h1>
          Cross Chain Swap
        </h1>
        <div>
          <div>From</div>
          <InputContainer>
            <div>
              <div>
                <div >
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
                    modalKey={TokenInputModalKey.ModalTokenInput}
                    selectedToken={srcToken}
                  />
                </div>
              </div>
            </div>
            <div>
              <div>
                <AmountInput
                  selectedToken={srcToken}
                  validState={amountValidation}
                />
              </div>
            </div>
          </InputContainer>
        </div>

        <div>
          <div >To</div>
          <InputContainer>
            <div>
              <div>
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
                    modalKey={TokenInputModalKey.ModalTokenOutput}
                    selectedToken={destToken}
                  />
                </div>
              </div>
            </div>

            <div>
              <AddressInput />
            </div>
          </InputContainer>
        </div>
        <div>
          <InputContainer>
            <SwapEstimator amount={amount} />
          </InputContainer>
          <SwapRoute />
        </div>
        <div>
          {isRequiredApproval ? (
            <ApproveButton />
          ) : (
            <SwapButton amount={amount} amountValidation={amountValidation} />
          )}
        </div>
      </SwapContainer>
    </PageLayout>
  );
};

export default Bridge;
