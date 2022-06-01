import { ComponentStyle } from "../../types/component";
import React, { FunctionComponent, useCallback, useState } from "react";
import cn from "classnames";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";
import {
  resetSwapInputs,
  selectDestChain,
  selectSrcChain,
  selectSrcToken,
} from "../../slices/swapInputSlice";
import { resetDropInputs, selectAliasAddresses } from "../../slices/dropInputSlice";
import useTokens from "../../hooks/useTokens";
import { Validation } from "../../hooks/useAmountValidator";
import { createDropPayload } from "../../utils/contract";
import { useAccount, useSigner } from "wagmi";
import { ethers, utils } from "ethers";
import {
  resetSwapStatus,
  selectSwapStatusSrcTx,
  setSrcTx,
} from "../../slices/swapStatusSlice";
// import { useRouter } from "next/router";
import distributionENSExecutableAbi from "../../abi/distributionENSExecutable.json";
import { selectEstimateAmountState } from "../../slices/swapEstimatorSlice";
import { useGetTransferFeeQuery } from "../../slices/transferFeeSlice";
import useDropValidator from "../../hooks/useDropValidator";

interface SwapButtonProps extends ComponentStyle {
  amount: string;
  aliasAddresses: string[] | undefined;
  amountValidation: Validation;
}

const DropButton: FunctionComponent<SwapButtonProps> = ({
  className,
  amount,
  amountValidation,
}) => {
  const srcChain = useAppSelector(selectSrcChain);
  const srcToken = useAppSelector(selectSrcToken);
  const aliasAddressArr = useAppSelector(selectAliasAddresses);
  const destChain = useAppSelector(selectDestChain);
  const swapEstimatorState = useAppSelector(selectEstimateAmountState);
  const dropTx = useAppSelector(selectSwapStatusSrcTx);
  // const { push } = useRouter();
  const [{ data: account }] = useAccount();
  const [{ data: signer }] = useSigner();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const dropDisable = useDropValidator(
    amount,
    aliasAddressArr,
    amountValidation
  );
  const tokens = useTokens(destChain);
  const { data: fee } = useGetTransferFeeQuery(
    {
      srcChain,
      destChain,
      srcToken,
    },
    { skip: !srcChain || !srcToken }
  );

  const swap = useCallback(async () => {
    if (!srcChain) return;
    if (!srcToken) return;
    if (!account) return;
    if (!signer) return;
    if (!fee) return;

    const srcTokenDestChain = tokens.find(
      (token: any) => token.symbol === srcToken.symbol
    );
    if (!srcTokenDestChain) return;

    setLoading(true);

    const { payload } = createDropPayload(
      destChain.ensRegistryAddress,
      aliasAddressArr as string[]
    );

    const sendAmount = ethers.utils
      .parseUnits(amount, srcToken.decimals)
      .toString();

    const contract = new ethers.Contract(
      srcChain.distributionENSExecutableAddress,
      distributionENSExecutableAbi.abi,
      signer
    );
    const tx = await contract
      .sendToMany(
        destChain.name,
        destChain.distributionENSExecutableAddress,
        payload,
        destChain.ensRegistryAddress,
        srcToken?.symbol,
        sendAmount,
        { value: utils.parseEther("0.1") } //temporary
      )
      .catch((e: any) => setLoading(false));

    if (tx) {
      dispatch(setSrcTx({ txHash: tx.hash, payloadHash: "", traceId: "" }));
    }
    setLoading(false);
  }, [
    account,
    aliasAddressArr,
    amount,
    destChain,
    dispatch,
    fee,
    signer,
    srcChain,
    srcToken,
    tokens,
  ]);

  const reset = useCallback(() => {
    dispatch(resetDropInputs());
    dispatch(resetSwapStatus());
    dispatch(resetSwapInputs());
    // push("/airdrop");
  }, [dispatch]);

  return (
    <>
      <button
        disabled={dropDisable || loading || swapEstimatorState.loading}
        className={cn(
          `btn text-white bg-black disabled:bg-opacity-30 transition-all ease-in ${className}`,
          { loading }
        )}
        onClick={dropTx ? reset : swap}
      >
        {dropTx ? "Reset" : "Drop"}
      </button>
      <br />
      {dropTx && (
        <button
          className={cn(
            `btn text-white bg-black disabled:bg-opacity-30 transition-all ease-in ${className}`,
            { loading }
          )}
          onClick={() =>
            window.open(`https://testnet.axelarscan.io/gmp/${dropTx}`)
          }
        >
          Check Status
        </button>
      )}
    </>
  );
};

export default DropButton;
