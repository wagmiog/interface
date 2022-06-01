import { ComponentStyle } from "../../types/component";
import React, { FunctionComponent, useCallback, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";
import { addAliasAddress, selectAliasAddresses } from "../../slices/dropInputSlice";
import useAddressValidator from "../../hooks/useAddressValidator";

interface TextInputProps extends ComponentStyle {
}

const TextInput: FunctionComponent<TextInputProps> = ({
  className,
}) => {
  const [aliasAddress, setAliasAddress] = useState("");
  const validState = useAddressValidator(aliasAddress);
  const aliasaddresses = useAppSelector(selectAliasAddresses)
  const dispatch = useAppDispatch();

  const onKeyDown = useCallback((e) => {
    e.stopPropagation();
    if (validState.error) return;
    if (!aliasAddress) return;
    if (!(e.code === "Enter" || e.code === "NumpadEnter")) return;

    aliasAddress?.length
      && !aliasaddresses?.includes(aliasAddress)
      && dispatch(addAliasAddress(aliasAddress));
    setAliasAddress("");
    
  },[aliasAddress, aliasaddresses, dispatch, validState?.error]);
  
  return (
    <div className={`form-control ${className}`}>
      <label
        className={`input-group rounded-md border-2 border-neutral-content flex ${
          !validState.isValid ? "border-red-300" : "hover:border-slate-300 "
        }`}
      >
        <DebounceInput
          type="text"
          placeholder="your_eth_alias.eth (+Enter)"
          value={aliasAddress}
          debounceTimeout={500}
          onChange={(e) => setAliasAddress(e.target.value)}
          onKeyDown={onKeyDown}
          className={`flex-1 input input-bordered text-white hover:outline-none focus:outline-none active:outline-none border-0 appearance-none`}
        />
      </label>
      {validState.error && (
        <span className="mt-1 text-sm text-right text-red-100">
          {validState.error}
        </span>
      )}
    </div>
  );
};

export default TextInput;
