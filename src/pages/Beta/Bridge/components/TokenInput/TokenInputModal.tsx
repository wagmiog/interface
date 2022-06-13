import { ComponentStyle } from "../../types/component";
import { Token } from "../../types/token";
import React, { FunctionComponent } from "react";

import TokenBalance from "./TokenBalance";

interface TokenInputModalProps extends ComponentStyle {
  tokens: Token[];
  selectedToken?: Token;
  showBalance?: boolean;
  modalKey: TokenInputModalKey;
  onSelected: (tokenBalance: Token) => void;
}

export enum TokenInputModalKey {
  ModalTokenInput = "modal-token-input",
  ModalTokenOutput = "modal-token-output",
}

const TokenInputModal: FunctionComponent<TokenInputModalProps> = ({
  modalKey,
  onSelected,
  selectedToken,
  showBalance = false,
  tokens = [],
}) => {
  const options = tokens.map((token) => {
    return (
      <TokenBalance
        modalKey={modalKey}
        onClick={onSelected}
        token={token}
        showBalance={showBalance}
        active={token.address === selectedToken?.address}
        key={token.address}
      />
    );
  });
  return (
    <>
      <input type="checkbox" id={modalKey} />
      <label
        htmlFor={modalKey}
      >
        <label
          htmlFor=""
        >
          <div>
            <h1>
              Select Token
            </h1>
            <div>
              <ul>{options}</ul>
            </div>
          </div>

          <div>
            <div>
              <img
                src={"/assets/svg/pattern.svg"}
                alt=""
              />
            </div>
          </div>
        </label>
      </label>
    </>
  );
};

export default TokenInputModal;
