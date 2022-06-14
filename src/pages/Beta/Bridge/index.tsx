import React, { useEffect, useCallback, useState } from "react";
import { QuestionAnswer } from "./TabulationBox";
import AmountInput from "./components/AmountInput";
import ChainInput from "./components/ChainInput";
// import InputContainer from "./components/InputContainer";
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
import TokenInputModal from "./components/TokenInput/TokenInputModal";
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
import { useNetwork, useAccount } from "wagmi";
import { PageWrapper, Ibridge } from './styleds'
import Modal from 'src/components/Modal'
import ConnectButton from "./components/Header/ConnectButton";
import { Text } from "@pangolindex/components"

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
  const [{ data: account }] = useAccount();
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
      <QuestionAnswer />
      <Ibridge>
        <Text fontSize={30} fontWeight={500} lineHeight="42px" color="text1">
          Cross Chain
        </Text>
        <div>
          <Text fontSize={15} fontWeight={500} lineHeight="42px" color="text1">From</Text>
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
        </div>

        <div>
          <Text fontSize={15} fontWeight={500} lineHeight="42px" color="text1" >To</Text>
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
                  selectedToken={destToken}
                />
              </div>
            </div>
          </div>

          <div>
            <AddressInput />
          </div>
        </div>
        <div>
          <SwapEstimator amount={amount} />
          <SwapRoute />
        </div>
        <div>
          {!account ? (
            <ConnectButton />
          ) : (
            <>
              {isRequiredApproval ? (
                <ApproveButton />
              ) : (
                <SwapButton amount={amount} amountValidation={amountValidation} />
              )}
            </>
          )}
        </div>
      </Ibridge>
      <Modal isOpen={tokenInput} onDismiss={wrappedOnDismiss} maxHeight={250} minHeight={30} isBeta={true}>
        <TokenInputModal
          tokens={srcTokens}
          showBalance={true}
          onSelected={updateSrcToken}
        />
      </Modal>
      <Modal isOpen={tokenOutput} onDismiss={wrappedOnDismiss} maxHeight={250} minHeight={30} isBeta={true}>
        <TokenInputModal
          tokens={destTokens}
          showBalance={false}
          onSelected={updateDestToken}
        />
      </Modal>
      <Modal isOpen={chainInput} onDismiss={wrappedOnDismiss} maxHeight={250} minHeight={30} isBeta={true}>
        <ChainInputModal
          onSelected={updateSrcChain}
          chains={chains}
        />
      </Modal>
      <Modal isOpen={chainOutput} onDismiss={wrappedOnDismiss} maxHeight={250} minHeight={30} isBeta={true}>
        <ChainInputModal
          onSelected={updateDestChain}
          chains={chains}
        />
      </Modal>
    </PageWrapper>
  );
};

export default Bridge;
