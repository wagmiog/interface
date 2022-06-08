import { chains } from "../../constants/config";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";
import React, { FunctionComponent, useEffect, useState } from "react";
import {
  selectSenderAddress,
  setRecipientAddress,
  setSenderAddress,
} from "../../slices/swapInputSlice";
import { ChainId } from "../../types/chain";
import { ComponentStyle } from "../../types/component";
import { useConnect, useAccount } from "wagmi";

const ConnectButton: FunctionComponent<ComponentStyle> = ({ className }) => {
  const dispatch = useAppDispatch();
  const [{ data, error }, connect] = useConnect();
  const [{ data: account }, disconnect] = useAccount();
  const [isUnsupportedChain, setIsUnsupportedChain] = useState(false);
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
    if (isUnsupportedChain) {
      return (
        <button
          // disabled={!injectedConnector.ready}
          onClick={() => injectedConnector?.switchChain?.(ChainId.AVALANCHE)}
        >
          Unsupported Chain. Switch?
        </button>
      );
    } else if (data.connected) {
      const trimmedAddress =
        account?.address?.slice(0, 7) + "..." + account?.address?.slice(-7);
      return (
        <div>
          <label tabIndex={0}>
            {trimmedAddress}
          </label>
          <ul
            tabIndex={0}
          >
            <li>
              <div onClick={disconnect}>
                Disconnect
              </div>
            </li>
          </ul>
        </div>
      );
    } else if (error) {
      return (
        <button
          // disabled={!injectedConnector.ready}
          onClick={() => connect(injectedConnector)}
        >
          Failed to connect
        </button>
      );
    } else {
      return (
        <button
          // disabled={!injectedConnector.ready}
          onClick={() => connect(injectedConnector)}
        >
          Connect Wallet
        </button>
      );
    }
  }

  // function handleClick() {
  //   if (data.connected) {
  //     disconnect();
  //   } else {
  //   }
  // }

  return <div>{renderButton()}</div>;
};

export default ConnectButton;