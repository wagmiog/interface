import { chains } from "../../config/constants";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";
import useTokens from "../../hooks/useTokens";
import React, { FunctionComponent, useCallback, useEffect } from "react";
import {
  selectDestChain,
  selectDestToken,
  selectSrcChain,
  selectSrcToken,
  setDestChain,
  setDestToken,
  setSrcChain,
  setSrcToken,
} from "../../slices/swapInputSlice";
import { SquidChain } from "../../types/chain";
import { useNetwork } from "wagmi";
import { ChainInputModalKey, ChainInputModal } from "../../components/modals";
import { TokenInputModal, TokenInputModalKey } from "../../components/modals";
import { Header } from "../../components/layout";

export const PageLayout: FunctionComponent = ({ children }) => {
  const srcChain = useAppSelector(selectSrcChain);
  const srcToken = useAppSelector(selectSrcToken);
  const destChain = useAppSelector(selectDestChain);
  const destToken = useAppSelector(selectDestToken);
  const srcTokens = useTokens(srcChain);
  const destTokens = useTokens(destChain);
  const { switchNetworkAsync, data } = useNetwork();
  const dispatch = useAppDispatch();

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
        } catch (error) {}
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
      } catch (error) {}
    };

    switchWalletNetworkIfNeeded();
  }, [data, srcChain, switchNetworkAsync]);

  return (
    <>
      <div className="flex flex-col w-screen h-screen overflow-x-hidden bg-gray-200">
        <Header />
        <div className="bg-gradient-to-b from-[#0C213A] to-[#03070D] flex-1 items-center justify-center flex flex-col px-4">
          {children}
        </div>
      </div>
      <TokenInputModal
        modalKey={TokenInputModalKey.ModalTokenInput}
        selectedToken={srcToken}
        tokens={srcTokens}
        showBalance={true}
        onSelected={(token) => dispatch(setSrcToken(token))}
      />
      <TokenInputModal
        modalKey={TokenInputModalKey.ModalTokenOutput}
        selectedToken={destToken}
        tokens={destTokens}
        showBalance={false}
        onSelected={(token) => dispatch(setDestToken(token))}
      />
      <ChainInputModal
        modalKey={ChainInputModalKey.ModalChainFrom}
        onSelected={updateSrcChain}
        chains={chains}
      />
      <ChainInputModal
        modalKey={ChainInputModalKey.ModalChainTo}
        onSelected={updateDestChain}
        chains={chains}
      />
    </>
  );
};