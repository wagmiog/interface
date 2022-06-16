import { useEffect, useState } from "react";
import { selectSrcToken } from "../slices/swapInputSlice";
import { Token } from "../types/token";
import { SquidChain } from "../types/chain";
import { useAppSelector } from "./useAppSelector";
import useTokens from "./useTokens";

const useCrosschainToken = (chain?: SquidChain, token?: Token) => {
  const srcToken = useAppSelector(selectSrcToken);
  const tokens = useTokens(chain);
  const [crosschainToken, setCrosschainToken] = useState<Token>();

  useEffect(() => {
    let _crosschainToken;
    if (token) {
      _crosschainToken = tokens.find(
        (_token) => _token.symbol === token.symbol
      );
    } else {
      _crosschainToken = tokens.find(
        (_token) =>
          _token.address.toLowerCase() ===
          chain?.defaultCrosschainToken.toLowerCase()
      );
    }

    setCrosschainToken(_crosschainToken);
  }, [chain, srcToken, token, tokens]);

  return crosschainToken;
};

export default useCrosschainToken;
