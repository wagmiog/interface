import { ComponentStyle } from "../../types/component";
import { Token } from "../../types/token";
import React, { FunctionComponent } from "react";
import { Validation } from "../../hooks/useAmountValidator";
import { DebounceInput } from "react-debounce-input";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";
import { selectSrcChain, selectSrcToken } from "../../slices/swapInputSlice";
import { selectBalancesByChainId } from "../../slices/balanceSlice";

import { selectAmount, setAmount } from "../../slices/swapInputSlice";
import { MaxButton } from "../../components/common";
import { useConnect } from "wagmi";
import { ethers } from "ethers";

interface AmountInputProps extends ComponentStyle {
  selectedToken?: Token;
  validState: Validation;
}

export const AmountInput: FunctionComponent<AmountInputProps> = ({
  selectedToken,
  validState,
}) => {
  const amount = useAppSelector(selectAmount);
  const dispatch = useAppDispatch();
  const { isConnected } = useConnect();
  const srcChain = useAppSelector(selectSrcChain);
  const srcToken = useAppSelector(selectSrcToken);

  const balances = useAppSelector((state) =>
    selectBalancesByChainId(state, srcChain?.id)
  );

  function canShowBalance() {
    return (
      isConnected &&
      srcToken &&
      srcChain &&
      balances[srcToken?.address as string] &&
      srcToken.decimals
    );
  }

  function renderTokenBalance() {
    if (canShowBalance()) {
      const balance = ethers.utils.formatUnits(
        balances[srcToken?.address as string],
        srcToken?.decimals
      );
      return <span> {`(${balance} ${srcToken?.symbol})`}</span>;
    }
    return ;
  }

  return (
    <div>
      <label>
        <span>Balance</span>
        {renderTokenBalance()}
      </label>
      <div>
        <div>
          <DebounceInput
            type={"number"}
            value={amount}
            onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
              e.currentTarget.blur()
            }
            debounceTimeout={300}
            onChange={(e) => dispatch(setAmount(e.target.value))}
          />
          {selectedToken && <MaxButton selectedToken={selectedToken} />}
        </div>
      </div>
      <div>
        {validState.error && (
          <span>{validState?.error}</span>
        )}
      </div>
    </div>
  );
};
