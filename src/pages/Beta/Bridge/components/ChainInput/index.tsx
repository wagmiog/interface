import { Chain } from "../../types/chain";
import { ComponentStyle } from "../../types/component";
import React, { FunctionComponent, useEffect } from "react";
import { useNetwork } from "wagmi";
import { chains } from "../../constants/config";
import {
  selectDestChain,
  selectSrcChain,
  setDestChain,
  setSrcChain,
} from "../../slices/swapInputSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";
import { Text, Button } from "@pangolindex/components"
import { SelectParams } from "../../styleds"

interface ChainInputProps extends ComponentStyle {
  selectedChain?: Chain;
  isSrcChain?: boolean;
}

const ChainInput: FunctionComponent<ChainInputProps> = ({
  selectedChain,
  isSrcChain = false,
}) => {
  const [{ data }] = useNetwork();
  const srcChain = useAppSelector(selectSrcChain);
  const destChain = useAppSelector(selectDestChain);
  const dispatch = useAppDispatch();
  const destChainId = destChain?.id
  const dataChainId = data.chain?.id
  useEffect(() => {
    if (!isSrcChain) return;
    if (srcChain) return;

    const chain = chains.find((chain) => chain.id === data.chain?.id);
    if (chain) {
      dispatch(setSrcChain(chain));
      if (chain?.id === destChain?.id) {
        const _destChain = chains.find((_chain) => _chain.id !== chain.id);
        if (_destChain) {
          dispatch(setDestChain(_destChain));
        }
      }
    }
  }, [dataChainId, destChainId, dispatch, isSrcChain, srcChain, data.chain, destChain]);

  return (
    <Button variant="plain">
      <SelectParams>
        <div>
          {selectedChain && (
            <img
              src={selectedChain.icon}
              width={20}
              height={20}
              alt="chain icon"
            />
          )}
        </div>
        <Text fontSize={15} fontWeight={500} lineHeight="42px" color="text1">
          {selectedChain?.name || "Select Chain"}
        </Text>
      </SelectParams>
    </Button>
  );
};

export default ChainInput;
