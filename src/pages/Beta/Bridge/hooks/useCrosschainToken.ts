import { useEffect, useState } from "react";
import { selectSrcToken } from "../slices/swapInputSlice";
import { Chain } from "../types/chain";
import { Token } from "../types/token";
import { useAppSelector } from "./useAppSelector";
import useTokens from "./useTokens";

const useCrosschainToken = (chain?: Chain) => {
  const srcToken = useAppSelector(selectSrcToken);
  const tokens = useTokens(chain);
  const [crosschainToken, setCrosschainToken] = useState<Token>();
  const chainToken = chain?.crosschainToken

  useEffect(() => {
    const _crosschainToken = tokens.find(
      (token: any) =>
        token.address.toLowerCase() === chain?.crosschainToken.toLowerCase()
    );
    setCrosschainToken(_crosschainToken);
  }, [chainToken, srcToken, tokens, chain]);

  return crosschainToken;
};

export default useCrosschainToken;
