import React, { FunctionComponent } from "react";
import { ComponentStyle } from "../../types/component";
import { Token } from "../../types/token";
import { selectBalancesByChainId } from "../../slices/balanceSlice";
import { ethers } from "ethers";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectSrcChain } from "../../slices/swapInputSlice";
import { LoadingIndicator } from "../../components/common";
import { TokenInputModalKey } from "../modals/TokenInputModal";

interface TokenBalanceProps extends ComponentStyle {
  modalKey: TokenInputModalKey;
  onClick: (token: Token) => void;
  token: Token;
  active?: boolean;
  showBalance?: boolean;
}

export const TokenBalance: FunctionComponent<TokenBalanceProps> = ({
  token,
  modalKey,
  onClick,
  showBalance = true,
  active = false,
}) => {
  const srcChain = useAppSelector(selectSrcChain);
  const balances = useAppSelector((state) =>
    selectBalancesByChainId(state, srcChain?.id)
  );

  function renderBalance() {
    let content = null;
    if (showBalance) {
      if (balances[token.address]) {
        content = (
          <div>
            {ethers.utils.formatUnits(balances[token.address], token.decimals)}
          </div>
        );
      } else {
        content = <LoadingIndicator width={40} height={18} />;
      }
    }

    return (
      <span>{content}</span>
    );
  }

  return (
    <div>
      <li key={token.address} onClick={() => onClick(token)}>
        <label
          htmlFor={modalKey}
        >
          <div>
            <div>
              {renderBalance()}
              <span>{token.symbol}</span>
            </div>
          </div>
        </label>
      </li>
    </div>
  );
};
