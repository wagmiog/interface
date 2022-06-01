import React, { FunctionComponent } from "react";
import { ComponentStyle } from "../../types/component";
import { useAccount, useBalance } from "wagmi";
import { toFixed } from "../../utils/parser";
import LoadingIndicator from "../../components/LoadingIndicator";

const NativeBalance: FunctionComponent<ComponentStyle> = ({ className }) => {
  const [{ data: account }] = useAccount();
  const [{ data, error, loading }] = useBalance({
    addressOrName: account?.address,
  });

  function renderBalance() {
    if (error) {
      return <p>Cannot fetch balance</p>;
    }
    if (loading) {
      return <LoadingIndicator width={56} height={20} />;
    }
    if (data && account) {
      return (
        <p>
          {toFixed(data.formatted)} {data.symbol}
        </p>
      );
    }
    return ;
  }

  return <div className={`${className}`}>{renderBalance()}</div>;
};

export default NativeBalance;
