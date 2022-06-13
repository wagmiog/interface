import React, { useEffect, useCallback, useState } from "react";
import { QuestionAnswer } from "./TabulationBox";
import AmountInput from "./components/AmountInput";
import ChainInput from "./components/ChainInput";
import InputContainer from "./components/InputContainer";
import SwapButton from "./components/SwapButton";
// import SwapContainer from "./components/SwapContainer";
import TokenInput from "./components/TokenInput";
import { useAppDispatch, useAppSelector } from "./hooks/useAppSelector";
import {
  selectAmount,
  selectDestChain,
  selectDestToken,
  selectSrcChain,
  selectSrcToken,
  setDestChain,
  setDestToken,
  setSrcChain,
  setSrcToken,
} from "./slices/swapInputSlice";
import useAmountValidator from "./hooks/useAmountValidator";
import useApproveChecker from "./hooks/useApproveChecker";
import ApproveButton from "./components/ApproveButton";
import { resetSwapStatus } from "./slices/swapStatusSlice";
import SwapEstimator from "./components/SwapEstimator";
import TokenInputModal, { TokenInputModalKey } from "./components/TokenInput/TokenInputModal";
import ChainInputModal, { ChainInputModalKey } from "./components/ChainInput/ChainInputModal";
import AddressInput from "./components/AddressInput";
import SwapRoute from "./components/SwapRoute";
import { chains } from "./constants/config";
import useTokens from "./hooks/useTokens";
import {
  selectDestTokenAtSrcChain,
  selectSrcTokenAtDestChain,
} from "./slices/tokenSlice";
import { Chain } from "./types/chain";
import { Token } from "./types/token";
import { useNetwork } from "wagmi";
import { PageWrapper, Ibridge } from './styleds'
import Modal from 'src/components/Modal'
import Header from "./components/Header";

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


  const srcTokenAtDestChain = useAppSelector(selectSrcTokenAtDestChain);
  const destTokenAtSrcChain = useAppSelector(selectDestTokenAtSrcChain);
  const srcTokens = useTokens(srcChain);
  const destTokens = useTokens(destChain);
  const [{ data }, switchNetwork] = useNetwork();
  const [tokenInput, setTokenInput] = useState<boolean>(false)
  const [tokenOutput, setTokenOutput] = useState<boolean>(false)
  const [chainInput, setChainInput] = useState<boolean>(false)
  const [chainOutput, setChainOutput] = useState<boolean>(false)

  const updateSrcToken = useCallback(
    async (token: Token) => {
      if (token.symbol === destToken?.symbol && srcTokenAtDestChain) {
        dispatch(setSrcToken(destTokenAtSrcChain));
        dispatch(setDestToken(srcTokenAtDestChain));
      } else {
        dispatch(setSrcToken(token));
      }
    },
    [destTokenAtSrcChain, dispatch, srcTokenAtDestChain, destToken]
  );

  const updateDestToken = useCallback(
    async (token: Token) => {
      if (token.symbol === destToken?.symbol && srcTokenAtDestChain) {
        dispatch(setSrcToken(destTokenAtSrcChain));
        dispatch(setDestToken(srcTokenAtDestChain));
      } else {
        dispatch(setDestToken(token));
      }
    },
    [destTokenAtSrcChain, dispatch, srcTokenAtDestChain, destToken]
  );

  const updateSrcChain = useCallback(
    async (chain: Chain) => {
      if (!switchNetwork) return;
      const { data: _chain } = await switchNetwork(chain.id);
      if (_chain?.id !== chain.id) return;

      if (chain.id === destChain?.id && srcChain) {
        dispatch(setSrcChain(destChain));
        dispatch(setDestChain(srcChain));
      } else {
        dispatch(setSrcChain(chain));
      }
    },
    [destChain, dispatch, srcChain, switchNetwork]
  );

  const updateDestChain = useCallback(
    async (chain: Chain) => {
      if (srcChain && destChain && chain.id === srcChain?.id) {
        if (!switchNetwork) return;
        const { data: _chain } = await switchNetwork(destChain.id);
        if (_chain?.id !== destChain?.id) return;

        dispatch(setSrcChain(destChain));
        dispatch(setDestChain(srcChain));
      } else {
        dispatch(setDestChain(chain));
      }
    },
    [destChain, dispatch, srcChain, switchNetwork]
  );
  useEffect(() => {
    const switchWalletNetworkIfNeeded = async () => {
      if (!switchNetwork) return;
      if (!srcChain) return;
      if (data.chain?.id === srcChain?.id) return;
      return await switchNetwork(srcChain.id);
    };

    switchWalletNetworkIfNeeded();
    // eslint-disable-next-line
  }, [data.chain?.id, srcChain, switchNetwork]);

  function wrappedOnDismiss() {
    setTokenInput(false)
    setChainInput(false)
    setChainOutput(false)
    setTokenOutput(false)
  }
  return (
    <PageWrapper>
      <Header /> 
      <QuestionAnswer />
      <Ibridge>
        <h1>
          Cross Chain Swap
        </h1>
        <div>
          <div>From</div>
          <InputContainer>
            <div>
              <div>
                <div onClick={() => setChainInput(!chainInput)}>
                  <ChainInput
                    selectedChain={srcChain}
                    label="From"
                    modalKey={ChainInputModalKey.ModalChainFrom}
                    isSrcChain={true}
                  />
                </div>
                <div onClick={() => setTokenInput(!tokenInput)}>
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
                <div onClick={() => setChainOutput(!chainOutput)}>
                  <ChainInput
                    selectedChain={destChain}
                    label="To"
                    modalKey={ChainInputModalKey.ModalChainTo}
                  />
                </div>
                <div onClick={() => setTokenOutput(!tokenOutput)}>
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
      </Ibridge>

      {/* ICI */}
      <Modal isOpen={tokenInput} onDismiss={wrappedOnDismiss} maxHeight={250} minHeight={30} isBeta={true}>
        <TokenInputModal
          modalKey={TokenInputModalKey.ModalTokenInput}
          selectedToken={srcToken}
          tokens={srcTokens}
          showBalance={true}
          onSelected={updateSrcToken}
        />
      </Modal>
      <Modal isOpen={tokenOutput} onDismiss={wrappedOnDismiss} maxHeight={250} minHeight={30} isBeta={true}>
      <TokenInputModal
        modalKey={TokenInputModalKey.ModalTokenOutput}
        selectedToken={destToken}
        tokens={destTokens}
        showBalance={false}
        onSelected={updateDestToken}
      />
      </Modal>
      <Modal isOpen={chainInput} onDismiss={wrappedOnDismiss} maxHeight={250} minHeight={30} isBeta={true}>
        <ChainInputModal
          modalKey={ChainInputModalKey.ModalChainFrom}
          onSelected={updateSrcChain}
          chains={chains}
        />
      </Modal>
      <Modal isOpen={chainOutput} onDismiss={wrappedOnDismiss} maxHeight={250} minHeight={30} isBeta={true}>
      <ChainInputModal
        modalKey={ChainInputModalKey.ModalChainTo}
        onSelected={updateDestChain}
        chains={chains}
      />
      </Modal>
    </PageWrapper>
  );
};

export default Bridge;
