import { ComponentStyle } from "../../types/component";
import { SquidChain } from "../../types/chain";
import React, { FunctionComponent } from "react";

interface ChainInputModalProps extends ComponentStyle {
  chains: SquidChain[];
  onSelected: (chain: SquidChain) => void;
  modalKey: ChainInputModalKey;
}

export enum ChainInputModalKey {
  ModalChainFrom = "modal-chain-from",
  ModalChainTo = "modal-chain-to",
}

export const ChainInputModal: FunctionComponent<ChainInputModalProps> = ({
  chains = [],
  onSelected,
  modalKey,
}) => {
  const options = chains.map((chain) => {
    return (
      <li key={chain.id} onClick={() => onSelected(chain)}>
        <label
          htmlFor={modalKey}
        >
          <div>
            <span>{chain.name}</span>
          </div>
        </label>
      </li>
    );
  });
  return (
    <>
      <input type="checkbox" id={modalKey}/>
      <label
        htmlFor={modalKey}
      >
        <label
          htmlFor=""
        >
          <div>
            <h1>
              Select Chain
            </h1>
            <div>
              <ul>{options}</ul>
            </div>
          </div>
          <div>
            <div>
            </div>
          </div>
        </label>
      </label>
    </>
  );
};
