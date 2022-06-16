import React, { useEffect, useRef } from "react";
import { useConnect } from "wagmi";

export const Web3Modal = () => {
  const { connect, connectors, isConnected } = useConnect();
  const modalRef = useRef<any>();

  function closeModal() {
    if (modalRef?.current?.checked) modalRef.current.checked = false;
  }

  function handleOnMetamaskSwitch() {
    const metamaskConnector = connectors[0];
    connect(metamaskConnector);
  }

  function handleOnWalletConnectSwitch() {
    const walletConnectConnector = connectors[1];
    connect(walletConnectConnector);
  }

  function handleOnCoinbaseWalletSwitch() {
    const coinbaseConnector = connectors[2];
    connect(coinbaseConnector);
  }

  useEffect(() => {
    if (isConnected) closeModal();
  }, [isConnected]);

  function renderConnectors() {
    return (
      <div>
        <h4>Select Wallet</h4>
        <div>
          <button
            onClick={handleOnMetamaskSwitch}
          >
            <span>Metamask</span>
            <div>
            </div>
          </button>
          <button
            onClick={handleOnWalletConnectSwitch}
          >
            <span>Wallet Connect</span>
            <div>
            </div>
          </button>
          <button
            onClick={handleOnCoinbaseWalletSwitch}
          >
            <span>Coinbase Wallet</span>
            <div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <input
        ref={modalRef}
        type="checkbox"
        id="web3-modal"
      />
      <label
        htmlFor="web3-modal"
      >
        <label>
          {renderConnectors()}
        </label>
      </label>
    </div>
  );
};
