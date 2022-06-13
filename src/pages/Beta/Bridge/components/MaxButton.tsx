import { ComponentStyle } from "../types/component";
import { Token } from "../types/token";
import React, { FunctionComponent } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useAppSelector";
import { selectSrcChain, setAmount } from "../slices/swapInputSlice";
import { selectBalancesByChainId } from "../slices/balanceSlice";
// import LoadingIndicator from "./LoadingIndicator";
import { ethers } from "ethers";
import { Button } from "@pangolindex/components"

interface MaxButtonProps extends ComponentStyle {
  selectedToken?: Token;
}

const MaxButton: FunctionComponent<MaxButtonProps> = ({ selectedToken }) => {
  const dispatch = useAppDispatch();
  const srcChain = useAppSelector(selectSrcChain);
  const balances = useAppSelector((state) =>
    selectBalancesByChainId(state, srcChain?.id)
  );
  let balance = "0";
  if (selectedToken?.address) {
    balance = balances[selectedToken?.address] || "0";
  }
  const maxAmount = ethers.utils.formatUnits(balance, selectedToken?.decimals);

  // function renderBalance() {
  //   if (balance) {
  //     return `Max (${maxAmount} ${selectedToken?.symbol})`;
  //   } else {
  //     return <LoadingIndicator width={50} height={18} />;
  //   }
  // }

  return (
    <Button
      variant="plain"
      color='text1'
      onClick={() => dispatch(setAmount(maxAmount))}
    >
      max
    </Button>
  );
};

export default MaxButton;
