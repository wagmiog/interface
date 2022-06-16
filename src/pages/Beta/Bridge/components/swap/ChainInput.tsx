import { SquidChain } from "../../types/chain";
import { ComponentStyle } from "../../types/component";
import React, { FunctionComponent } from "react";
import { ChainInputModalKey } from "../../components/modals";
import { Text, Button } from "@pangolindex/components"
import { SelectParams } from "../../styleds"

interface ChainInputProps extends ComponentStyle {
  selectedChain?: SquidChain;
  label: string;
  modalKey: ChainInputModalKey;
  isSrcChain?: boolean;
}

export const ChainInput: FunctionComponent<ChainInputProps> = ({
  selectedChain,
  modalKey,
}) => {
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
