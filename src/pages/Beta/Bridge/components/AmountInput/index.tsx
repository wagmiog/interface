import { ComponentStyle } from "../../types/component";
import { Token } from "../../types/token";
import React, { FunctionComponent } from "react";
import { Validation } from "../../hooks/useAmountValidator";
// import { DebounceInput } from "react-debounce-input";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";
import { selectSrcChain, selectSrcToken } from "../../slices/swapInputSlice";
import { selectBalancesByChainId } from "../../slices/balanceSlice";
import { Text } from "@pangolindex/components"
import { selectAmount, setAmount } from "../../slices/swapInputSlice";
import MaxButton from "../MaxButton";
import { useConnect } from "wagmi";
import { ethers } from "ethers";
import { SelectParams } from "../../styleds"
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

interface AmountInputProps extends ComponentStyle {
  selectedToken?: Token;
  validState: Validation;
}

const AmountInput: FunctionComponent<AmountInputProps> = ({
  selectedToken,
  validState,
}) => {
  const amount = useAppSelector(selectAmount);
  const dispatch = useAppDispatch();
  const [connectData] = useConnect();
  const srcChain = useAppSelector(selectSrcChain);
  const srcToken = useAppSelector(selectSrcToken);

  const balances = useAppSelector((state) =>
    selectBalancesByChainId(state, srcChain?.id)
  );

  function canShowBalance() {
    return (
      connectData?.data?.connected &&
      srcToken &&
      srcChain &&
      balances[srcToken?.address as string] &&
      srcToken.decimals
    );
  }

  function renderTokenBalance() {
    if (canShowBalance()) {
      const balance = ethers.utils.formatUnits(
        balances[srcToken?.address as string],
        srcToken?.decimals
      );
      return <Text fontSize={15} fontWeight={500} lineHeight="42px" color="text1"> {`(${balance} ${srcToken?.symbol})`}</Text>;
    }
    return ;
  }

  return (
    <div>
      <SelectParams>
        <Text fontSize={15} fontWeight={500} lineHeight="42px" color="text1">Balance:</Text>
        {renderTokenBalance()}
      </SelectParams>
      <div>
        <div style={{display: 'flex'}}>
          <InputWrapper
            type={"number"}
            value={amount}
            onChange={(e) => dispatch(setAmount(e.target.value))}
          />
          {selectedToken && 
          <div style={{width: '20%'}}>
            <MaxButton selectedToken={selectedToken} />
          </div>
          }
        </div>
      </div>
      <div>
        {validState.error && (
          <span >{validState?.error}</span>
        )}
      </div>
    </div>
  );
};

export default AmountInput;
