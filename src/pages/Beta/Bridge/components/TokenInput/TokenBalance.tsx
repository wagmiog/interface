import React, { FunctionComponent } from "react";
import { ComponentStyle } from "../../types/component";
import { Token } from "../../types/token";
import { selectBalancesByChainId } from "../../slices/balanceSlice";
import { ethers } from "ethers";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectSrcChain } from "../../slices/swapInputSlice";
import LoadingIndicator from "../../components/LoadingIndicator";
import { TokenInputModalKey } from "./TokenInputModal";

interface TokenBalanceProps extends ComponentStyle {
  modalKey: TokenInputModalKey;
  onClick: (token: Token) => void;
  token: Token;
  active?: boolean;
  showBalance?: boolean;
}

const TokenBalance: FunctionComponent<TokenBalanceProps> = ({
  token,
  className,
  modalKey,
  onClick,
  showBalance = true,
  active = false,
}) => {
  const srcChain = useAppSelector(selectSrcChain);
  const balances = useAppSelector((state) =>
    selectBalancesByChainId(state, srcChain?.id)
  );
  //ATTENTION ICI balances = rien
  console.log('balance', balances)
  function renderBalance() {
    let content = null;
    if (showBalance) {
      if (balances[token.address]) {
        content = (
          <p>
            {ethers.utils.formatUnits(balances[token.address], token.decimals)}
          </p>
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
          <img
            src={token.logoURI || "/ic-unknown.svg"}
            width={32}
            height={32}
            alt={token.name}
          />{" "}
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

export default TokenBalance;
