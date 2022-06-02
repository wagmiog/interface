import { ethers } from "ethers";
import { useAppSelector } from "../hooks/useAppSelector";
import React, { FunctionComponent, useCallback } from "react";
import { selectEstimateAmountState } from "../slices/swapEstimatorSlice";
import { selectDestToken } from "../slices/swapInputSlice";
import { ComponentStyle } from "../types/component";
import LoadingIndicator from "./LoadingIndicator";

interface SwapEstimatorProps extends ComponentStyle {
  amount: string;
}

const SwapEstimator: FunctionComponent<SwapEstimatorProps> = ({ amount }) => {
  const destToken = useAppSelector(selectDestToken);
  const { loading, error, swapDestAmount, sendDestAmount } = useAppSelector(
    selectEstimateAmountState
  );
  const estimatedAmount = swapDestAmount || sendDestAmount;

  const render = useCallback(() => {
    if (error) {
      return <span>{error}</span>;
    } else if (destToken && estimatedAmount) {
      const textAmount = ethers.utils.formatUnits(
        estimatedAmount,
        destToken?.decimals
      );
      const floatTextAmount = parseFloat(textAmount).toFixed(3);
      return (
        <span>
          {loading ? (
            <LoadingIndicator width={120} height={18} />
          ) : (
            <span>
              {floatTextAmount} {destToken?.symbol}
            </span>
          )}
        </span>
      );
    }
    return ;
  }, [destToken, error, estimatedAmount, loading]);

  return (
    <div>
      <div >Estimated output:</div>
      <div>{render()}</div>
    </div>
  );
};

export default SwapEstimator;
