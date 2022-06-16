import { ComponentStyle } from "../../types/component";
import { Token } from "../../types/token";
import React, { FunctionComponent } from "react";
import { TokenBalance } from "../swap";
import styled from 'styled-components'
import { Text } from "@pangolindex/components"

const ModalCenter = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  align-items: center;
`

const ModalChain = styled.div`
display: flex;
gap: 20px;
padding-top: 10px;
cursor: pointer;
`

interface TokenInputModalProps extends ComponentStyle {
  tokens: Token[];
  selectedToken?: Token;
  showBalance?: boolean;
  onSelected: (tokenBalance: Token) => void;
  wrappedOnDismiss: () => void;

}

export enum TokenInputModalKey {
  ModalTokenInput = "modal-token-input",
  ModalTokenOutput = "modal-token-output",
}

export const TokenInputModal: FunctionComponent<TokenInputModalProps> = ({
  onSelected,
  selectedToken,
  showBalance = false,
  tokens = [],
  wrappedOnDismiss
}) => {
  const options = tokens.map((token) => {
    return (
      <ModalChain key={token.address}>
        <TokenBalance
          onClick={onSelected}
          token={token}
          showBalance={showBalance}
          active={token.address === selectedToken?.address}
          key={token.address}
        />
      </ModalChain>
    );
  });
  return (
    <ModalCenter>
      <div>
        <Text fontSize={30} fontWeight={500} lineHeight="42px" color="text1">
          Select Token
        </Text>
        <div onClick={() => wrappedOnDismiss()}>
          <ul>{options}</ul>
        </div>
      </div>
    </ModalCenter>
  );
};
