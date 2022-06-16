import { SquidChain } from "../../types/chain";
import { ComponentStyle } from "../../types/component";
import React, { FunctionComponent } from "react";
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
      htmlFor={modalKey}>
      <div>
        <div>
          {selectedChain && (
            <></>
          )}
        </div>
        <div>
          <span>
            {selectedChain?.name || "Select Chain"}
          </span>
        </div>
      </div>
    </label>
  );
};
