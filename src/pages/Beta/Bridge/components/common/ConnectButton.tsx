import React, { FunctionComponent } from "react";


import { ComponentStyle } from "../../types/component";
import { useConnect } from "wagmi";


export const ConnectButton: FunctionComponent<ComponentStyle> = () => {
  
  const { connect, connectors } = useConnect();

  function handleOnMetamaskSwitch() {
    const metamaskConnector = connectors[0];
    connect(metamaskConnector);
  }

  return (
    <label onClick={handleOnMetamaskSwitch}>
      Connect Your Wallet
    </label>
  );
};
