import { Chain } from "../../types/chain";
import { ComponentStyle } from "../../types/component";
import React, { FunctionComponent, useEffect } from "react";
import { useNetwork } from "wagmi";
import { chains } from "../../constants/config";
import {
  selectDestChain,
  selectSrcChain,
  setDestChain,
  setSrcChain,
} from "../../slices/swapInputSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";
import { ChainInputModalKey } from "./ChainInputModal";

interface ChainInputProps extends ComponentStyle {
  selectedChain?: Chain;
  label: string;
  modalKey: ChainInputModalKey;
  isSrcChain?: boolean;
}

const ChainInput: FunctionComponent<ChainInputProps> = ({
  className,
  selectedChain,
  modalKey,
  label,
  isSrcChain = false,
}) => {
  const [{ data }] = useNetwork();
  const srcChain = useAppSelector(selectSrcChain);
  const destChain = useAppSelector(selectDestChain);
  const dispatch = useAppDispatch();
  const destChainId = destChain?.id
  const dataChainId = data.chain?.id
  useEffect(() => {
    if (!isSrcChain) return;
    if (srcChain) return;

    const chain = chains.find((chain) => chain.id === data.chain?.id);
    if (chain) {
      dispatch(setSrcChain(chain));
      if (chain?.id === destChain?.id) {
        const _destChain = chains.find((_chain) => _chain.id !== chain.id);
        if (_destChain) {
          dispatch(setDestChain(_destChain));
        }
      }
    }
  }, [dataChainId, destChainId, dispatch, isSrcChain, srcChain, data.chain, destChain]);

  return (
    <div>
      <label
        htmlFor={modalKey}
      >
        <div>
          {selectedChain && (
            <img
              src={selectedChain.icon}
              width={20}
              height={20}
              alt="chain icon"
            />
          )}
        </div>
        <div>
          <span>
            {selectedChain?.name || "Select Chain"}
          </span>
          <img
            src={"/assets/svg/arrow-down.svg"}
            height={20}
            width={20}
            alt=""
          />
        </div>
      </label>
    </div>
  );
};

export default ChainInput;
