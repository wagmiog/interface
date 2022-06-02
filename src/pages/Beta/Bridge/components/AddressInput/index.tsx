import { ComponentStyle } from "../../types/component";
import React, { ChangeEvent } from "react";
import { Validation } from "../../hooks/useAmountValidator";
import { DebounceInput } from "react-debounce-input";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { setRecipientAddress } from "../../slices/swapInputSlice";

interface AddressInputProps extends ComponentStyle {
  validState?: Validation;
}

const AddressInput: React.FC<AddressInputProps> = ({
  className,
  validState,
}) => {
  const [{ data: account }] = useAccount();
  const dispatch = useDispatch();

  const updateDestinationAddress = (address: string) => {
    const isAddress = ethers.utils.isAddress(address);
    if (isAddress) {
      dispatch(setRecipientAddress(address));
    }
  };

  return (
    <div>
      <label>
        Destination Address
      </label>
      <div>
        <DebounceInput
          placeholder={account?.address}
          debounceTimeout={300}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            updateDestinationAddress(e.target.value);
          }}
        />
      </div>
      <div>
        {validState?.error && (
          <span >{validState?.error}</span>
        )}
      </div>
    </div>
  );
};

export default AddressInput;
