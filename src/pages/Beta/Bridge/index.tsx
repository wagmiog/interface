import React, { useEffect, useState, useCallback } from "react";
import {
  SwapButton,
  AmountInput,
  TokenInput,
  AddressInput,
  ApproveButton,
  ChainInput,
  SwapContainer,
  SwapEstimator,
} from "./components/swap";
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
import { useNetwork, useConnect } from "wagmi";
import { resetSwapStatus } from "./slices/swapStatusSlice";
import { ChainInputModalKey } from "./components/modals";
import { SwapRoute } from "./components/utils";
import { useNetworkSwitcher } from "./hooks";
import { PageWrapper, Ibridge } from './styleds'
import { QuestionAnswer } from "./TabulationBox";
import Modal from 'src/components/Modal'
import useTokens from "./hooks/useTokens";
import { SquidChain } from "./types/chain";
import { TokenInputModal, ChainInputModal } from "./components/modals"
import { chains } from "./config/constants";
import { ConnectButton } from "./components/common";
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
  const { isConnected } = useConnect();



  const [tokenInput, setTokenInput] = useState<boolean>(false)
  const [chainInput, setChainInput] = useState<boolean>(false)
  const [chainOutput, setChainOutput] = useState<boolean>(false)
  const [tokenOutput, setTokenOutput] = useState<boolean>(false)
  const wrappedOnDismiss = () => {
    setTokenInput(false)
    setChainInput(false)
    setChainOutput(false)
    setTokenOutput(false)
  }
  // Automatically update `srcChai`n and `destChain` whenever connected wallet's network has changed.
  useNetworkSwitcher();

  useEffect(() => {
    dispatch(resetSwapStatus());
  }, [dispatch]);

  const srcTokens = useTokens(srcChain);
  const destTokens = useTokens(destChain);
  const { switchNetworkAsync, data } = useNetwork();

  const updateSrcChain = useCallback(
    async (chain: SquidChain) => {
      if (!switchNetworkAsync) return;
      await switchNetworkAsync(chain.id);
    },
    [switchNetworkAsync]
  );

  const updateDestChain = useCallback(
    async (chain: SquidChain) => {
      if (srcChain && destChain) {
        if (!switchNetworkAsync) return;
        const prevDestChain = { ...(destChain as SquidChain) };
        try {
          if (chain.id === srcChain?.id) {
            await switchNetworkAsync(prevDestChain.id);
            dispatch(setDestChain(chain));
            dispatch(setSrcChain(prevDestChain));
          } else {
            dispatch(setDestChain(chain));
          }
        } catch (error) { }
      }
    },
    [destChain, dispatch, srcChain, switchNetworkAsync]
  );

  useEffect(() => {
    const switchWalletNetworkIfNeeded = async () => {
      if (!switchNetworkAsync) return;
      if (!srcChain) return;
      if (data?.id === srcChain?.id) return;
      try {
        await switchNetworkAsync(srcChain.id);
      } catch (error) { }
    };

    switchWalletNetworkIfNeeded();
  }, [data, srcChain, switchNetworkAsync]);
  return (
    <PageWrapper>
      <QuestionAnswer />
      <Ibridge>
        <SwapContainer>
          <Text fontSize={30} fontWeight={500} lineHeight="42px" color="text1">
            Cross Chain Swap
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
          {!isConnected ? (
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
        </SwapContainer>
      </Ibridge>
      <Modal isOpen={tokenInput} onDismiss={wrappedOnDismiss} maxHeight={250} minHeight={30} isBeta={true}>
        <TokenInputModal
          selectedToken={srcToken}
          tokens={srcTokens}
          showBalance={true}
          onSelected={(token) => dispatch(setSrcToken(token))}
          wrappedOnDismiss={wrappedOnDismiss}
        />
      </Modal>
      <Modal isOpen={tokenOutput} onDismiss={wrappedOnDismiss} maxHeight={250} minHeight={30} isBeta={true}>
        <TokenInputModal
          selectedToken={destToken}
          tokens={destTokens}
          showBalance={false}
          onSelected={(token) => dispatch(setDestToken(token))}
          wrappedOnDismiss={wrappedOnDismiss}
        />
      </Modal>
      <Modal isOpen={chainInput} onDismiss={wrappedOnDismiss} maxHeight={250} minHeight={30} isBeta={true}>
        <ChainInputModal
          onSelected={updateSrcChain}
          chains={chains}
          wrappedOnDismiss={wrappedOnDismiss}
        />
      </Modal>
      <Modal isOpen={chainOutput} onDismiss={wrappedOnDismiss} maxHeight={250} minHeight={30} isBeta={true}>
        <ChainInputModal
          onSelected={updateDestChain}
          chains={chains}
          wrappedOnDismiss={wrappedOnDismiss}
        />
      </Modal>
    </PageWrapper>
  );
};

export default Bridge;
