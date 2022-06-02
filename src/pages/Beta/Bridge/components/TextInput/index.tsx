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
    <div>
      <label>
        <DebounceInput
          type="text"
          placeholder="your_eth_alias.eth (+Enter)"
          value={aliasAddress}
          debounceTimeout={500}
          onChange={(e) => setAliasAddress(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </label>
      {validState.error && (
        <span>
          {validState.error}
        </span>
      )}
    </div>
  );
};

export default TextInput;
