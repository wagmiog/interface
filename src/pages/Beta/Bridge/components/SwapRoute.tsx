import { ethers } from "ethers";
import { useAppSelector } from "../hooks/useAppSelector";
import useCrosschainToken from "../hooks/useCrosschainToken";
import React, { FunctionComponent } from "react";
import { selectEstimateAmountState } from "../slices/swapEstimatorSlice";
import {
  selectAmount,
  selectDestChain,
  selectDestToken,
  selectSrcChain,
  selectSrcToken,
} from "../slices/swapInputSlice";
import { Chain } from "../types/chain";
import { ComponentStyle } from "../types/component";
import { Token } from "../types/token";
import useSwapChecker, { SWAP_TYPE } from "../hooks/useSwapChecker";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { toFixed } from "../utils/parser";

const SwapRoute: FunctionComponent<ComponentStyle> = ({ className }) => {
  const { swapSrcAmount, swapDestAmount, sendDestAmount, error } =
    useAppSelector(selectEstimateAmountState);
  const srcChain = useAppSelector(selectSrcChain);
  const destChain = useAppSelector(selectDestChain);
  const srcToken = useAppSelector(selectSrcToken);
  const destToken = useAppSelector(selectDestToken);
  const crosschainTokenAtSrcChain = useCrosschainToken(srcChain);
  const crosschainTokenAtDestChain = useCrosschainToken(destChain);
  const amount = useAppSelector(selectAmount);
  const swapType = useSwapChecker();

  if (
    !srcToken ||
    !srcChain ||
    !crosschainTokenAtSrcChain ||
    !crosschainTokenAtDestChain ||
    !destToken ||
    !swapSrcAmount ||
    !sendDestAmount ||
    error
  ) {
    return null;
  }

  function createRoute(chain: Chain, token: Token, amount: string) {
    return (
      <div key={token.address}>
        <img src={chain.icon} width={24} height={24} alt={chain.name} />
        <span>
          {toFixed(ethers.utils.formatUnits(amount, token.decimals))}
        </span>
        <span>{token.symbol}</span>
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
    crosschainTokenAtSrcChain,
    swapSrcAmount
  );
  const RouteDestBeforeSwap = createRoute(
    destChain,
    crosschainTokenAtDestChain,
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
    return ;
  }

  return (
    <div>
      {calculateRoutes()?.map((route, i) => {
        return (
          <div key={i}>
            {i > 0 && (
              <ChevronRightIcon
                width={18}
                height={18}
              />
            )}
            {route}
          </div>
        );
      })}
    </div>
  );
};

export default SwapRoute;
