import React, { useEffect, useState } from "react";
import ConnectButton from "./ConnectButton";
import { useAccount } from "wagmi";
import { chains } from "../../constants/config";
import NativeBalance from "./NativeBalance";

const Header = () => {
  const [{ data: account }] = useAccount();
  const [chainIcon, setChainIcon] = useState<string>();

  useEffect(() => {
    async function setChainIconIfAvailable() {
      const chainId = await account?.connector?.getChainId();
      const chain = chains.find((chain) => chain.id === chainId);
      if (chain) {
        setChainIcon(chain.icon);
      } else {
        setChainIcon(undefined);
      }
    }

    setChainIconIfAvailable();
  }, [account]);

  return (
    <div className="fixed w-full">
      <div className="max-w-screen-xl mx-auto navbar">
        <div className="flex-1">
          {/* <Link href={"/"} passHref>
            <a className="flex text-xl">
              <img
                src="/assets/png/squid-logo.png"
                width={32}
                height={32}
                alt="logo"
              />
              <span className="hidden ml-4 text-2xl font-light text-white sm:flex">
                SquiDex
              </span>
            </a>
          </Link> */}
        </div>
        <div className="flex-none">
          <ul className="items-center p-0 menu menu-horizontal">
            <NativeBalance className="mr-4" />
            {chainIcon && (
              <img
                className="p-1 bg-gray-200 rounded-full"
                src={chainIcon}
                width={32}
                height={32}
                alt="chain icon"
              />
            )}
            <ConnectButton />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
