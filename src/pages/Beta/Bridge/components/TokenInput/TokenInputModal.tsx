import React, { FunctionComponent } from "react";
import { ComponentStyle } from "../../types/component";
import { Token } from "../../types/token";
import TokenBalance from "./TokenBalance";
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
  showBalance?: boolean;
  onSelected: (tokenBalance: Token) => void;
}

export enum TokenInputModalKey {
  ModalTokenInput = "modal-token-input",
  ModalTokenOutput = "modal-token-output",
}

const TokenInputModal: FunctionComponent<TokenInputModalProps> = ({
  onSelected,
  showBalance = false,
  tokens = [],
}) => {
  const options = tokens.map((token) => {
    return (
      <ModalChain>
        <TokenBalance
          onClick={onSelected}
          token={token}
          showBalance={showBalance}
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
        <div>
          <ul>{options}</ul>
        </div>
      </div>
    </ModalCenter>
  );
};

export default TokenInputModal;
