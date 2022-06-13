import { ethers } from "ethers";
import { useSigner, useWaitForTransaction } from "wagmi";
import { ComponentStyle } from "../types/component";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useAppSelector";
import { selectSrcChain, selectSrcToken } from "../slices/swapInputSlice";
import { setAllowance } from "../slices/tokenApprovalSlice";
import erc20Abi from "../abi/erc20.json";
// import { useRouter } from "next/router";
import useSpenderAddress from "../hooks/useSpenderAddress";
import { Button } from '@pangolindex/components'

interface ApproveButtonProps extends ComponentStyle {}

const ApproveButton: FunctionComponent<ApproveButtonProps> = ({
  className,
}) => {
  const srcChain = useAppSelector(selectSrcChain);
  const srcToken = useAppSelector(selectSrcToken);
  const dispatch = useAppDispatch();
  const [{ data: signer }] = useSigner();
  // const router = useRouter();
  const spenderAddress = useSpenderAddress();
  const [approveDisable, setApproveDisable] = useState(true);
  const [{ data: txReceipt, loading: txLoading }, wait] =
    useWaitForTransaction();
  const [loading, setLoading] = useState(false);
  const srcTokenAddress = srcToken?.address

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
    // router.pathname,
    spenderAddress,
    srcChain,
    srcToken,
    srcTokenAddress,
    txReceipt,
  ]);

  const approve = useCallback(async () => {
    if (!srcChain) return;
    if (!srcToken) return;
    if (!signer) return;
    if (!spenderAddress) return;

    setLoading(true);
    const contract = new ethers.Contract(srcToken.address, erc20Abi, signer);
    const tx = await contract
      .approve(spenderAddress, ethers.constants.MaxUint256)
      .catch(() => setLoading(false));
    wait({
      hash: tx.hash,
    });
    setLoading(false);
  }, [signer, spenderAddress, srcChain, srcToken, wait]);

  return (
    <Button
      variant="primary"
      isDisabled={approveDisable || loading || txLoading}
      onClick={approve}
    >
      Approve
    </Button>
  );
};

export default ApproveButton;
