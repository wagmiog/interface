import { ComponentStyle } from "../../types/component";
import React, { ChangeEvent } from "react";
import { Validation } from "../../hooks/useAmountValidator";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { setRecipientAddress } from "../../slices/swapInputSlice";
import { Text } from "@pangolindex/components"
import styled from 'styled-components';

const InputWrapper = styled.input`
  width: 100%;
  border-radius: 8px;
  padding: 10px;
  border: 1px solid transparent;
  display: flex;
  position: relative;
  box-sizing: border-box;
`;

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
      <Text fontSize={15} fontWeight={500} lineHeight="42px" color="text1">
        Destination Address
      </Text>
      <div>
        <InputWrapper
          placeholder={account?.address}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            updateDestinationAddress(e.target.value);
          }}
          disabled
        />
      </div>
      <div>
        {validState?.error && (
          <Text fontSize={15} fontWeight={500} lineHeight="42px" color="text1">{validState?.error}</Text>
        )}
      </div>
    </div>
  );
};

export default AddressInput;
