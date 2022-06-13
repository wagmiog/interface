import { chains } from "../../constants/config";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";
import React, { FunctionComponent, useEffect, useState } from "react";
import {
  selectSenderAddress,
  setRecipientAddress,
  setSenderAddress,
} from "../../slices/swapInputSlice";
import { ComponentStyle } from "../../types/component";
import { useConnect, useAccount } from "wagmi";
import { Button } from '@pangolindex/components'

const ConnectButton: FunctionComponent<ComponentStyle> = ({ className }) => {
  const dispatch = useAppDispatch();
  const [{ data }, connect] = useConnect();
  const [{ data: account }] = useAccount();
  const [, setIsUnsupportedChain] = useState(false);
  const senderAddress = useAppSelector(selectSenderAddress);
  const injectedConnector = data.connectors[0];

  useEffect(() => {
    async function checkIfValidChain() {
      const chainId = await account?.connector?.getChainId();
      if (!chainId) {
        return setIsUnsupportedChain(false);
      }

      const supportedChainIds = chains.map((chain) => chain.id);
      setIsUnsupportedChain(!supportedChainIds.includes(chainId));
    }

    if (account?.address !== senderAddress) {
      dispatch(setSenderAddress(account?.address));
      dispatch(setRecipientAddress(account?.address));
    }

    checkIfValidChain();
  }, [account, dispatch, senderAddress, setIsUnsupportedChain]);

  function renderButton() {
    if (data.connected) {
      return (
        <> </>
      );
    } else {
      return (
        <Button
        variant="primary"
          // disabled={!injectedConnector.ready}
          onClick={() => connect(injectedConnector)}
        >
          Connect Wallet
        </Button>
      );
    }
  }
  return <div>{renderButton()}</div>;
};

export default ConnectButton;
