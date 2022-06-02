import { useAppSelector } from "../hooks/useAppSelector";
import React, { FunctionComponent, useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { selectDestChain, selectSrcChain } from "../slices/swapInputSlice";
import { ComponentStyle } from "../types/component";
import { getTxLink } from "../utils/explorer";
import { selectRefundAddress, selectSwapFailed } from "../slices/swapStatusSlice";
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { shortenAddress } from "../utils/formatter";

interface SwapProgressProps extends ComponentStyle {
  step: number;
  currentStep: number;
  txHash?: string;
}

const SwapProgress: FunctionComponent<SwapProgressProps> = ({
  step,
  currentStep,
  txHash,
}) => {
  const srcChain = useAppSelector(selectSrcChain);
  const destChain = useAppSelector(selectDestChain);
  const swapFailed = useAppSelector(selectSwapFailed);
  const swapRefundAddress = useAppSelector(selectRefundAddress);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (step === 0) {
      if (currentStep <= step) {
        setTitle("Transaction Confirmation");
      } else {
        setTitle("Transaction has been confirmed");
      }
    } else if (step === 1) {
      if (currentStep <= step) {
        setTitle("Transaction Relay");
      } else if (!destChain || !txHash) {
        setTitle("Relayed transaction");
      } else {
        setTitle(`Relayed tx to ${destChain.name}`);
      }
    } else if (step === 2) {
      if (currentStep <= step) {
        setTitle("Swapping...");
      } else {
        if (swapFailed) {
          setTitle(`Swap has been failed`);
        } else {
          setTitle("Swap has been completed");
        }
      }
    }
  }, [
    currentStep,
    destChain,
    srcChain,
    step,
    swapFailed,
    swapRefundAddress,
    txHash,
  ]);

  const showSwapFailedUI = swapFailed && step === 2;

  return (
    <div>
      <div>Step {step + 1}</div>
      <div>
        {showSwapFailedUI && (
          <ExclamationCircleIcon
            width={24}
            height={24}
          />
        )}

        <span>
          {title}
        </span>
        {txHash && currentStep > step && srcChain && destChain && (
          <a
            target="_blank"
            rel="noreferrer"
            href={getTxLink(step === 0 ? srcChain.id : destChain.id, txHash)}
          >
            {txHash.slice(0, 5)}...{txHash.slice(-5)}
          </a>
        )}
        {step === currentStep && (
          <ReactLoading
            width={20}
            height={20}
            type="spin"
            color="rgb(156 163 175)"
          />
        )}
      </div>
      {showSwapFailedUI && swapRefundAddress && (
        <span>
          Refunded to {shortenAddress(swapRefundAddress)}
        </span>
      )}
    </div>
  );
};

export default SwapProgress;
