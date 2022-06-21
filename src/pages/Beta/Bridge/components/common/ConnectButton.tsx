import React, { FunctionComponent } from "react";
import { ComponentStyle } from "../../types/component";
import { useConnect } from "wagmi";
import { Button } from "@pangolindex/components"

export const ConnectButton: FunctionComponent<ComponentStyle> = () => {
  
  const { connect, connectors } = useConnect();

  function handleOnMetamaskSwitch() {
    const metamaskConnector = connectors[0];
    connect(metamaskConnector);
  }

  return (
    <Button variant="primary" onClick={handleOnMetamaskSwitch}>
      Connect Your Wallet
    </Button>
  );
};
