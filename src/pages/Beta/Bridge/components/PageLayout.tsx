import { chains } from "../constants/config";
import { useAppDispatch, useAppSelector } from "../hooks/useAppSelector";
import useTokens from "../hooks/useTokens";
// import Head from "next/head";
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
} from "../slices/swapInputSlice";
import {
  selectDestTokenAtSrcChain,
  selectSrcTokenAtDestChain,
} from "../slices/tokenSlice";
import { Chain } from "../types/chain";
import { Token } from "../types/token";
import { useNetwork } from "wagmi";
import ChainInputModal, {
  ChainInputModalKey,
} from "./ChainInput/ChainInputModal";
import Header from "./Header";
import TokenInputModal, {
  TokenInputModalKey,
} from "./TokenInput/TokenInputModal";
import { Waves } from "./Waves";

const PageLayout: FunctionComponent = ({ children }) => {
  const srcChain = useAppSelector(selectSrcChain);
  const srcToken = useAppSelector(selectSrcToken);
  const destChain = useAppSelector(selectDestChain);
  const destToken = useAppSelector(selectDestToken);
  const srcTokenAtDestChain = useAppSelector(selectSrcTokenAtDestChain);
  const destTokenAtSrcChain = useAppSelector(selectDestTokenAtSrcChain);
  const srcTokens = useTokens(srcChain);
  const destTokens = useTokens(destChain);
  const [{ data }, switchNetwork] = useNetwork();
  const dispatch = useAppDispatch();

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
  }, [srcChain, switchNetwork, data.chain]);

  return (
    <div>
      {/* <Head>
        <title>SquiDex | The Cross Chain Decentralised Exchange</title>
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <div>
        <Header />
        <div >
          {children}
        </div>
      </div>
      <TokenInputModal
        modalKey={TokenInputModalKey.ModalTokenInput}
        selectedToken={srcToken}
        tokens={srcTokens}
        showBalance={true}
        onSelected={updateSrcToken}
      />
      <TokenInputModal
        modalKey={TokenInputModalKey.ModalTokenOutput}
        selectedToken={destToken}
        tokens={destTokens}
        showBalance={false}
        onSelected={updateDestToken}
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
      <Waves />
    </div>
  );
};

export default PageLayout;
