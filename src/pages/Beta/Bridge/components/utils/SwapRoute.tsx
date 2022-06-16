import { ethers } from "ethers";
import { useAppSelector } from "../../hooks/useAppSelector";
import useCrosschainToken from "../../hooks/useCrosschainToken";
import React, { FunctionComponent } from "react";
import { selectEstimateAmountState } from "../../slices/swapEstimatorSlice";
import {
  selectAmount,
  selectDestChain,
  selectDestToken,
  selectSrcChain,
  selectSrcToken,
} from "../../slices/swapInputSlice";
import { SquidChain } from "../../types/chain";
import { ComponentStyle } from "../../types/component";
import { Token } from "../../types/token";
import useSwapChecker, { SWAP_TYPE } from "../../hooks/useSwapChecker";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { toFixed } from "../../utils/parser";
import { Text } from '@pangolindex/components'

export const SwapRoute: FunctionComponent<ComponentStyle> = () => {
  const { swapSrcAmount, swapDestAmount, sendDestAmount, error } =
    useAppSelector(selectEstimateAmountState);
  const srcChain = useAppSelector(selectSrcChain);
  const destChain = useAppSelector(selectDestChain);
  const srcToken = useAppSelector(selectSrcToken);
  const destToken = useAppSelector(selectDestToken);
  const amount = useAppSelector(selectAmount);
  const swapType = useSwapChecker();
  const defaultSrcCrosschainToken = useCrosschainToken(destChain);
  const defaultDestCrosschainToken = useCrosschainToken(srcChain);
  const srcTokenAtDest = useCrosschainToken(destChain, srcToken);

  if (
    !srcToken ||
    !srcChain ||
    !defaultSrcCrosschainToken ||
    !defaultDestCrosschainToken ||
    !destToken ||
    !swapSrcAmount ||
    !sendDestAmount ||
    !swapType ||
    !destToken ||
    !amount ||
    error
  ) {
    return null;
  }

  const shouldUseDefaultCrosschainToken = [
    SWAP_TYPE.SWAP_SEND,
    SWAP_TYPE.SWAP_SEND_SWAP,
  ].includes(swapType);
  const srcCrosschainToken = shouldUseDefaultCrosschainToken
    ? defaultSrcCrosschainToken
    : srcToken;
  const destCrosschainToken = shouldUseDefaultCrosschainToken
    ? defaultDestCrosschainToken
    : srcTokenAtDest;

  if (!destCrosschainToken) return null;

  function createRoute(chain: SquidChain, token: Token, amount: string) {
    return (
      <div key={token.address} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={chain.icon} width={24} height={24} alt={chain.name} />
        <Text fontSize={10} fontWeight={500} lineHeight="42px" color="text1">
          {toFixed(ethers.utils.formatUnits(amount, token.decimals))}
        </Text>
        <Text fontSize={10} fontWeight={500} lineHeight="42px" color="text1">{token.symbol}</Text>
      </div>
    );
  }

  const RouteSrcBeforeSwap = createRoute(
    srcChain,
    srcToken,
    ethers.utils.parseUnits(amount, srcToken.decimals).toString()
  );
  const RouteSrcAfterSwap = createRoute(
    srcChain,
    srcCrosschainToken,
    swapSrcAmount
  );
  const RouteDestBeforeSwap = createRoute(
    destChain,
    destCrosschainToken,
    sendDestAmount
  );
  const RouteDestAfterSwap = createRoute(
    destChain,
    destToken,
    swapDestAmount || "0"
  );

  function calculateRoutes() {
    if (swapType === SWAP_TYPE.SEND) {
      return [RouteSrcBeforeSwap, RouteDestBeforeSwap];
    } else if (swapType === SWAP_TYPE.SEND_SWAP) {
      return [RouteSrcBeforeSwap, RouteDestBeforeSwap, RouteDestAfterSwap];
    } else if (swapType === SWAP_TYPE.SWAP_SEND) {
      return [RouteSrcBeforeSwap, RouteSrcAfterSwap, RouteDestBeforeSwap];
    } else if (swapType === SWAP_TYPE.SWAP_SEND_SWAP) {
      return [
        RouteSrcBeforeSwap,
        RouteSrcAfterSwap,
        RouteDestBeforeSwap,
        RouteDestAfterSwap,
      ];
    }
    return;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px' }}>
      {calculateRoutes()?.map((route, i) => {
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && (
              <ChevronRightIcon
                width={15}
                height={15}
                color="#FFF"
              />
            )}
            {route}
          </div>
        );
      })}
    </div>
  );
};
