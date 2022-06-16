import { ComponentStyle } from "../../types/component";
import { Token } from "../../types/token";
import React, { FunctionComponent } from "react";
import { TokenInputModalKey } from "../modals";

interface TokenInputProps extends ComponentStyle {
  modalKey: TokenInputModalKey;
  selectedToken?: Token;
  label: string;
}

export const TokenInput: FunctionComponent<TokenInputProps> = ({
  modalKey,
  selectedToken,
}) => {
  return (
    <label
      htmlFor={modalKey}
      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
    >
      <div>
        <div>
          {selectedToken && (
            <></>
          )}
        </div>
        <div>
          <span>
            {selectedToken?.symbol || "Select token"}
          </span>
        </div>
      </div>
    </label>
  );
};
