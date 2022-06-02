import { ethers } from "ethers";
import { useCallback } from "react";
import {
  selectAmount,
  selectDestChain,
  selectDestToken,
  selectRecipientAddress,
  selectSrcChain,
  selectSrcToken,
} from "../slices/swapInputSlice";
import { useAppSelector } from "./useAppSelector";
import useCrosschainToken from "./useCrosschainToken";
import squidSwapExecutableAbi from "../abi/squidSwapExecutable.json";
import { useAccount, useSigner } from "wagmi";
import { v4 as uuidv4 } from "uuid";
import { createPayloadHash, createTradeData } from "../utils/contract";
import gatewayAbi from "../abi/axelarGateway.json";

const AMOUNT_INPUT_POS = 196; // length of tradeData (32) + token in (32) + amount in (32) + router (32) + length of data (32) + 36

const useSwap = () => {
  const srcChain = useAppSelector(selectSrcChain);
  const srcToken = useAppSelector(selectSrcToken);
  const destChain = useAppSelector(selectDestChain);
  const destToken = useAppSelector(selectDestToken);
  const recipientAddress = useAppSelector(selectRecipientAddress);
  const amount = useAppSelector(selectAmount);
  const [{ data: account }] = useAccount();
  const srcCrosschainToken = useCrosschainToken(srcChain);
  const destCrosschainToken = useCrosschainToken(destChain);
  const [{ data: signer }] = useSigner();
  const getContract = useCallback(() => {
    if (!srcChain) return;
    return new ethers.Contract(
      srcChain?.swapExecutorAddress,
      squidSwapExecutableAbi,
      signer
    );
  }, [signer, srcChain]);

  const swapSrcAndDest = useCallback(async () => {
    const contract = getContract();
    if (!contract) return;
    if (!srcChain) return;
    if (!srcToken) return;
    if (!srcCrosschainToken) return;
    if (!destCrosschainToken) return;
    if (!signer) return;
    if (!destToken) return;
    if (!account) return;
    if (!recipientAddress) return;

    const traceId = ethers.utils.id(uuidv4());
    const sendAmount = ethers.utils
      .parseUnits(amount, srcToken?.decimals)
      .toString();

    const srcTradeData = createTradeData(
      [
        srcToken.address,
        srcChain.wrappedNativeToken,
        srcCrosschainToken.address,
      ],
      srcChain,
      srcChain.swapExecutorAddress,
      sendAmount
    );
    const destTradeData = createTradeData(
      [
        destCrosschainToken.address,
        destChain.wrappedNativeToken,
        destToken.address,
      ],
      destChain,
      recipientAddress,
      0
    );
    const payloadHash = createPayloadHash(
      destTradeData,
      traceId,
      recipientAddress,
      AMOUNT_INPUT_POS
    );

    const tx = await contract.tradeSendTrade(
      destChain.name,
      srcCrosschainToken.symbol,
      srcTradeData,
      destTradeData,
      traceId,
      recipientAddress,
      AMOUNT_INPUT_POS,
      {
        value: ethers.utils.parseEther("0.01"),
      }
    );

    return { tx, traceId, payloadHash };
  }, [
    account,
    amount,
    destChain,
    destCrosschainToken,
    destToken,
    getContract,
    recipientAddress,
    signer,
    srcChain,
    srcCrosschainToken,
    srcToken,
  ]);

  const swapOnlyDest = useCallback(async () => {
    const contract = getContract();
    if (!contract) return;
    if (!srcChain) return;
    if (!srcToken) return;
    if (!srcCrosschainToken) return;
    if (!destCrosschainToken) return;
    if (!signer) return;
    if (!destToken) return;
    if (!recipientAddress) return;

    const traceId = ethers.utils.id(uuidv4());
    const sendAmount = ethers.utils
      .parseUnits(amount, srcToken?.decimals)
      .toString();

    const tradeData = createTradeData(
      [
        destCrosschainToken?.address,
        destChain.wrappedNativeToken,
        destToken.address,
      ],
      destChain,
      recipientAddress,
      0 // will be overrided
    );
    const payloadHash = createPayloadHash(
      tradeData,
      traceId,
      recipientAddress,
      AMOUNT_INPUT_POS
    );

    const tx = await contract.sendTrade(
      destChain.name,
      srcToken?.symbol,
      sendAmount,
      tradeData,
      traceId,
      recipientAddress,
      AMOUNT_INPUT_POS,
      {
        value: ethers.utils.parseEther("0.01"),
      }
    );
    return { tx, payloadHash, traceId };
  }, [
    amount,
    destChain,
    destCrosschainToken,
    destToken,
    getContract,
    recipientAddress,
    signer,
    srcChain,
    srcCrosschainToken,
    srcToken,
  ]);

  const swapOnlySrc = useCallback(async () => {
    const contract = getContract();
    if (!contract) return;
    if (!srcChain) return;
    if (!srcToken) return;
    if (!srcCrosschainToken) return;
    if (!recipientAddress) return;

    const sendAmount = ethers.utils
      .parseUnits(amount, srcToken?.decimals)
      .toString();

    const srcTradeData = createTradeData(
      [
        srcToken.address,
        srcChain.wrappedNativeToken,
        srcCrosschainToken.address,
      ],
      srcChain,
      srcChain.swapExecutorAddress,
      sendAmount
    );

    const tx = await contract.tradeSend(
      destChain.name,
      recipientAddress,
      srcCrosschainToken.symbol,
      srcTradeData
    );

    return { tx, traceId: "", payloadHash: "" };
  }, [
    amount,
    destChain.name,
    getContract,
    recipientAddress,
    srcChain,
    srcCrosschainToken,
    srcToken,
  ]);

  const sendToken = useCallback(async () => {
    if (!srcChain) return;
    if (!signer) return;
    if (!srcToken) return;
    if (!amount) return;
    if (!recipientAddress) return;
    const gatewayContract = new ethers.Contract(
      srcChain?.gatewayAddress,
      gatewayAbi,
      signer
      );
      const sendAmount = ethers.utils
      .parseUnits(amount, srcToken?.decimals)
      .toString();
      
      const tx = await gatewayContract.sendToken(
        destChain.name,
        recipientAddress,
        srcCrosschainToken?.symbol,
        sendAmount
        );
        
    return { tx, traceId: "", payloadHash: "" };
  }, [
    amount,
    destChain.name,
    recipientAddress,
    signer,
    srcChain,
    srcToken,
    srcCrosschainToken,
  ]);

  return { swapSrcAndDest, swapOnlyDest, swapOnlySrc, sendToken };
};

export default useSwap;
