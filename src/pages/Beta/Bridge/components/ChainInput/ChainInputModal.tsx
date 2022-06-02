import { ComponentStyle } from "../../types/component";
import { Chain } from "../../types/chain";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectDestChain, selectSrcChain } from "../../slices/swapInputSlice";

interface ChainInputModalProps extends ComponentStyle {
  chains: Chain[];
  onSelected: (chain: Chain) => void;
  modalKey: ChainInputModalKey;
}

export enum ChainInputModalKey {
  ModalChainFrom = "modal-chain-from",
  ModalChainTo = "modal-chain-to",
}

const ChainInputModal: FunctionComponent<ChainInputModalProps> = ({
  chains = [],
  onSelected,
  modalKey,
}) => {
  const srcChain = useAppSelector(selectSrcChain);
  const destChain = useAppSelector(selectDestChain);
  const selectedChain =
    modalKey === ChainInputModalKey.ModalChainFrom ? srcChain : destChain;
  const options = chains.map((chain) => {
    return (
      <li key={chain.id} onClick={() => onSelected(chain)}>
        <label
          htmlFor={modalKey}
          className={cn("capitalize", {
            active: selectedChain?.id === chain.id,
          })}
        >
          <img
            src={chain.icon}
            width={32}
            height={32}
            alt="chain icon"
          />
          <div>
            <span>{chain.name}</span>
          </div>
        </label>
      </li>
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
              Select Chain
            </h1>
            <div >
              <ul >{options}</ul>
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

export default ChainInputModal;
