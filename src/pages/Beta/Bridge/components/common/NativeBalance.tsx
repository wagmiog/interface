import React, { FunctionComponent } from "react";
import { ComponentStyle } from "../../types/component";
import { useAccount, useBalance } from "wagmi";
import { toFixed } from "../../utils/parser";
import { LoadingIndicator } from "../../components/common";

export const NativeBalance: FunctionComponent<ComponentStyle> = () => {
  const account = useAccount();
  const balance = useBalance({
    addressOrName: account.data?.address,
  });

  if (balance?.isLoading) {
    return (
      <div>
        <LoadingIndicator />
      </div>
    );
  }

  if (balance?.error) {
    return <span>Unable to fetch balance</span>;
  }

  if (!balance?.data) return null;

  return (
    <div>
      <div>
        <span>{toFixed(balance.data?.formatted as string)}</span>
        <span>{balance.data?.symbol}</span>
      </div>
    </div>
  );
};
