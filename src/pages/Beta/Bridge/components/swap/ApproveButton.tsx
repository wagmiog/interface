import { ethers } from "ethers";
import { useContractWrite, useSigner, useWaitForTransaction } from "wagmi";
import { ComponentStyle } from "../../types/component";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";
import { selectSrcChain, selectSrcToken } from "../../slices/swapInputSlice";
import { setAllowance } from "../../slices/tokenApprovalSlice";
import erc20Abi from "../../abi/erc20.json";
import useSpenderAddress from "../../hooks/useSpenderAddress";
import { Token } from "../../types/token";
import { SquidChain } from "../../types/chain";

interface ApproveButtonProps extends ComponentStyle {}

export const ApproveButton: FunctionComponent<ApproveButtonProps> = () => {
  const srcChain = useAppSelector(selectSrcChain) as SquidChain;
  const srcToken = useAppSelector(selectSrcToken) as Token;
  const dispatch = useAppDispatch();
  const [approveDisable, setApproveDisable] = useState(true);
  const [loading, setLoading] = useState(false);

  const { data: signer } = useSigner();
  const spenderAddress = useSpenderAddress();
  const contractWrite = useContractWrite(
    {
      addressOrName: (srcToken as Token).address,
      contractInterface: erc20Abi,
      signerOrProvider: signer,
    },
    "approve"
  );
  const { data: txReceipt, isLoading } = useWaitForTransaction({
    hash: contractWrite.data?.hash,
  });

  useEffect(() => {
    setApproveDisable(!srcChain || !srcToken || !signer);
  }, [signer, srcChain, srcToken]);

  useEffect(() => {
    if (txReceipt && srcChain && srcToken && spenderAddress) {
      dispatch(
        setAllowance({
          chainId: srcChain?.id,
          tokenApproval: {
            address: srcToken?.address,
            approvals: [
              {
                spender: spenderAddress,
                allowance: ethers.constants.MaxUint256.toString(),
              },
            ],
          },
        })
      );
    }
  }, [
    dispatch,
    spenderAddress,
    srcChain,
    srcToken,
    txReceipt,
  ]);

  const approve = useCallback(async () => {
    setLoading(true);
    await contractWrite
      .writeAsync({
        args: [spenderAddress, ethers.constants.MaxUint256],
      })
      .catch(() => setLoading(false));

    setLoading(false);
  }, [contractWrite, spenderAddress]);

  return (
    <button
      disabled={approveDisable || loading || isLoading}
      onClick={approve}
    >
      Approve
    </button>
  );
};
