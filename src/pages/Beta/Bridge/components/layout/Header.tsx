import React from "react";
import { useAccount, useConnect } from "wagmi";
import { NativeBalance, ConnectButton } from "../../components/common";

export const Header = () => {
  const { data: account } = useAccount();
  const { isConnected } = useConnect();
  return (
    <div className="fixed z-50 w-full border-b border-[#192431] backdrop-blur-sm bg-black/10">
      <div className="h-20 max-w-screen-xl mx-auto navbar">

        <div className="flex items-center ml-auto gap-x-4">
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
