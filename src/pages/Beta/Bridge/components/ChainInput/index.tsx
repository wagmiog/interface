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
        style={{ display: 'flex', alignItems: "start", gap: 15 }}
      >
        <div>
          {selectedChain?.name || "Select Chain"}
        </div>
        <div>
          {selectedChain && (
            <img
              src={selectedChain.icon}
              width={30}
              height={30}
              alt="chain icon"
            />
          )}
        </div>
      </label>
    </div>
  );
};

export default ChainInput;
