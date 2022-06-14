import { ComponentStyle } from "../../types/component";
import { Chain } from "../../types/chain";
import React, { FunctionComponent } from "react";
import { Text } from "@pangolindex/components"
import styled from 'styled-components'

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
paddingTop: 10px;
cursor: pointer;
`

interface ChainInputModalProps extends ComponentStyle {
  chains: Chain[];
  onSelected: (chain: Chain) => void;
  wrappedOnDismiss: () => void;
}

export enum ChainInputModalKey {
  ModalChainFrom = "modal-chain-from",
  ModalChainTo = "modal-chain-to",
}

const ChainInputModal: FunctionComponent<ChainInputModalProps> = ({
  chains = [],
  onSelected,
  wrappedOnDismiss,
}) => {
  const options = chains.map((chain) => {
    return (
      <ModalChain key={chain.id} onClick={() => {onSelected(chain)}} >
        <img
          src={chain.icon}
          width={32}
          height={32}
          alt="chain icon"
        />
        <div>
          <span>{chain.name}</span>
        </div>
      </ModalChain>
    );
  });
  return (
    <>
      <ModalCenter>
        <Text fontSize={30} fontWeight={500} lineHeight="42px" color="text1">
          Select Chain
        </Text>
        <div onClick={() => wrappedOnDismiss()}>
          {options}
        </div>
      </ModalCenter>
    </>
  );
};

export default ChainInputModal;
