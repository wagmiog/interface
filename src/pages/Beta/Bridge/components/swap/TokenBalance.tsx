import React, { FunctionComponent } from "react";
import { ComponentStyle } from "../../types/component";
import { Token } from "../../types/token";
import { selectBalancesByChainId } from "../../slices/balanceSlice";
import { ethers } from "ethers";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectSrcChain } from "../../slices/swapInputSlice";
import { LoadingIndicator } from "../../components/common";

interface TokenBalanceProps extends ComponentStyle {
  onClick: (token: Token) => void;
  token: Token;
  active?: boolean;
  showBalance?: boolean;
}

export const TokenBalance: FunctionComponent<TokenBalanceProps> = ({
  token,
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
    <div key={token.address}  onClick={() => onClick(token)} style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          <img
            src={token.logoURI || "/ic-unknown.svg"}
            width={32}
            height={32}
            alt={token.name}
          />
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              {renderBalance()}
              <span>{token.symbol}</span>
            </div>
          </div>
      </div>
  );
};
