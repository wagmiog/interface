import { Chain } from "../../types/chain";
import { ComponentStyle } from "../../types/component";
import React, { FunctionComponent, useEffect } from "react";
import cn from "classnames";
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
  }, [data.chain?.id, destChain?.id, dispatch, isSrcChain, srcChain]);

  return (
    <div
      className={cn(
        "flex items-center px-3 py-2 text-xs border-2 border-[#282B3D] rounded-xl text-[#93BEFF] cursor-pointer",
        {
          "border-[#6700DD]": selectedChain,
        }
      )}
      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
    >
      <label
        className="flex items-center justify-between w-full cursor-pointer"
        htmlFor={modalKey}
      >
        <div className="flex items-center">
          {selectedChain && (
            <img
              src={selectedChain.icon}
              width={20}
              height={20}
              alt="chain icon"
              className="!rounded-full bg-gray-100"
            />
          )}
        </div>
        <div className="flex items-center ml-2">
          <span className="uppercase">
            {selectedChain?.name || "Select Chain"}
          </span>
          <img
            src={"/assets/svg/arrow-down.svg"}
            height={20}
            width={20}
          />
        </div>
      </label>
    </div>
  );
};

export default ChainInput;
