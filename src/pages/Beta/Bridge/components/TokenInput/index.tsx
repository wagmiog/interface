import { ComponentStyle } from "../../types/component";
import { Token } from "../../types/token";
import React, { FunctionComponent } from "react";
import { TokenInputModalKey } from "./TokenInputModal";

interface TokenInputProps extends ComponentStyle {
  modalKey: TokenInputModalKey;
  selectedToken?: Token;
  label: string;
}

const TokenInput: FunctionComponent<TokenInputProps> = ({
  className,
  modalKey,
  selectedToken,
  label,
}) => {
  return (
    // <div className={`form-control ${className}`}>
    //   <label className="border-2 input-group border-zinc-600">
    //     <span className="justify-center w-24">{label}</span>
    //     <label className="flex-1 btn btn-ghost" htmlFor={modalKey}>
    //       {selectedToken && (
    //         <Image
    //           src={selectedToken.logoURI}
    //           width={24}
    //           height={24}
    //           alt="chain icon"
    //           className="rounded-full"
    //         />
    //       )}
    //       <span className="bg-transparent">
    //         {selectedToken?.symbol || "Select token"}
    //       </span>
    //     </label>
    //   </label>
    // </div>

    <div>
      <label
        htmlFor={modalKey}
      >
        <div>
          {selectedToken && (
            <img
              src={selectedToken.logoURI || "/ic-unknown.svg"}
              width={20}
              height={20}
              alt="chain icon"
            />
          )}
        </div>
        <div>
          <span>
            {selectedToken?.symbol || "Select token"}
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

export default TokenInput;
