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
          className={`btn btn-error`}
          onClick={() => injectedConnector?.switchChain?.(ChainId.AVALANCHE)}
        >
          Unsupported Chain. Switch?
        </button>
      );
    } else if (data.connected) {
      const trimmedAddress =
        account?.address?.slice(0, 7) + "..." + account?.address?.slice(-7);
      return (
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="m-1 text-white btn btn-ghost">
            {trimmedAddress}
          </label>
          <ul
            tabIndex={0}
            className="p-2 mt-4 shadow menu dropdown-content bg-base-100 rounded-box"
          >
            <li>
              <a onClick={disconnect} className="flex-1">
                Disconnect
              </a>
            </li>
          </ul>
        </div>
      );
    } else if (error) {
      return (
        <button
          // disabled={!injectedConnector.ready}
          className={`btn btn-ghost`}
          onClick={() => connect(injectedConnector)}
        >
          Failed to connect
        </button>
      );
    } else {
      return (
        <button
          // disabled={!injectedConnector.ready}
          className={`btn btn-primary bg-gradient-to-r from-[#760FC8] to-[#7522DE]`}
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

  return <div className={`${className}`}>{renderButton()}</div>;
};

export default ConnectButton;
