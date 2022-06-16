import { SquidChain } from "../../types/chain";
import { ComponentStyle } from "../../types/component";
import React, { FunctionComponent } from "react";
import cn from "classnames";
import { ChainInputModalKey } from "../../components/modals";

interface ChainInputProps extends ComponentStyle {
  selectedChain?: SquidChain;
  label: string;
  modalKey: ChainInputModalKey;
  isSrcChain?: boolean;
}

export const ChainInput: FunctionComponent<ChainInputProps> = ({
  selectedChain,
  modalKey,
}) => {
  return (
    <label
      htmlFor={modalKey}
      className={cn(
        "flex items-center px-3 py-2 text-xs border-2 border-[#282B3D] rounded-xl text-[#93BEFF] cursor-pointer",
        {
          "border-[#6700DD]": selectedChain,
        }
      )}
      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
    >
      <div className="flex items-center justify-between w-full cursor-pointer">
        <div className="flex items-center">
          {selectedChain && (
            <></>
          )}
        </div>
        <div className="flex items-center ml-2">
          <span className="uppercase">
            {selectedChain?.name || "Select Chain"}
          </span>
        </div>
      </div>
    </label>
  );
};
