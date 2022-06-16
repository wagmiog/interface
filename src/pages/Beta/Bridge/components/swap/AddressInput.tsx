import { ComponentStyle } from "../../types/component";
import React, { ChangeEvent } from "react";
import { Validation } from "../../hooks/useAmountValidator";
// import { DebounceInput } from "react-debounce-input";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import {
  setRecipientAddress,
} from "../../slices/swapInputSlice";
import { useActiveWeb3React } from 'src/hooks'
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

export const AddressInput: React.FC<AddressInputProps> = ({
  validState,
}) => {
  const { account } = useActiveWeb3React()
  const dispatch = useDispatch();
  const receipientAddress = account;
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
          //@ts-ignore
          placeholder={receipientAddress}
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
