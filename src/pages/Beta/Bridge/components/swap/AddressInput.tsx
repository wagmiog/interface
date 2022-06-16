import { ComponentStyle } from "../../types/component";
import React, { ChangeEvent } from "react";
import { Validation } from "../../hooks/useAmountValidator";
import { DebounceInput } from "react-debounce-input";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import {
  selectSenderAddress,
  setRecipientAddress,
} from "../../slices/swapInputSlice";
import { useAppSelector } from "../../hooks/useAppSelector";

interface AddressInputProps extends ComponentStyle {
  validState?: Validation;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  validState,
}) => {
  const dispatch = useDispatch();
  const receipientAddress = useAppSelector(selectSenderAddress);

  const updateDestinationAddress = (address: string) => {
    const isAddress = ethers.utils.isAddress(address);
    if (isAddress) {
      dispatch(setRecipientAddress(address));
    }
  };
  console.log("receipientAddress", receipientAddress)
  return (
    <div>
      <label>
        Destination Address
      </label>
      <div>
        <DebounceInput
          placeholder={receipientAddress}
          debounceTimeout={300}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            updateDestinationAddress(e.target.value);
          }}
        />
      </div>
      <div>
        {validState?.error && (
          <span>{validState?.error}</span>
        )}
      </div>
    </div>
  );
};
