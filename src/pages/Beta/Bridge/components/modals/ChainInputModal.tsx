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
          <div className="flex flex-col items-end flex-1">
            <span className="ml-2">{chain.name}</span>
          </div>
        </label>
      </li>
    );
  });
  return (
    <>
      <input type="checkbox" id={modalKey} className="modal-toggle" />
      <label
        className="cursor-pointer select-none modal modal-bottom sm:modal-middle"
        htmlFor={modalKey}
      >
        <label
          className="flex flex-col modal-box bg-gradient-to-b to-[#191E31] from-[#192431]"
          htmlFor=""
        >
          <div className="z-50">
            <h1 className="text-3xl font-thin text-center text-white">
              Select Chain
            </h1>
            <div className="bg-[#181A25] rounded-xl text-white my-8">
              <ul className="menu min-h-[400px]">{options}</ul>
            </div>
          </div>
          <div className="absolute top-0 left-0 z-0 w-full h-full">
            <div className="relative w-full h-full">
            </div>
          </div>
        </label>
      </label>
    </>
  );
};
