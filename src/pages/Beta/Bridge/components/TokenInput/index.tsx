import { ComponentStyle } from "../../types/component";
import { Token } from "../../types/token";
import cn from "classnames";
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

    <div
      className={cn(
        "flex items-center px-3 py-2 text-xs border-2 border-[#282B3D] rounded-xl text-[#93BEFF] cursor-pointer",
        {
          "border-[#6700DD]": selectedToken,
        }
      )}
      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
    >
      <label
        className="flex items-center justify-between w-full cursor-pointer"
        htmlFor={modalKey}
      >
        <div className="flex items-center">
          {selectedToken && (
            <img
              src={selectedToken.logoURI || "/ic-unknown.svg"}
              width={20}
              height={20}
              alt="chain icon"
              className="!rounded-full"
            />
          )}
        </div>
        <div className="flex items-center ml-2">
          <span className="uppercase">
            {selectedToken?.symbol || "Select token"}
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

export default TokenInput;
