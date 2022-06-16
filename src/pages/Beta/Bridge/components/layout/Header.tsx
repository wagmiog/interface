import React from "react";
import { useAccount, useConnect } from "wagmi";
import { NativeBalance, ConnectButton } from "../../components/common";

export const Header = () => {
  const { data: account } = useAccount();
  const { isConnected } = useConnect();
  return (
    <div>
      <div>

        <div>
          {isConnected && account?.address && <NativeBalance />}
          {isConnected && (
            <></>
          )}
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};
