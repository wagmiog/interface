import { ComponentStyle } from "../../types/component";
import { Token } from "../../types/token";
import React, { FunctionComponent } from "react";
import { Text, Button } from "@pangolindex/components"
import { SelectParams } from "../../styleds"

interface TokenInputProps extends ComponentStyle {
  selectedToken?: Token;
}

const TokenInput: FunctionComponent<TokenInputProps> = ({
  selectedToken,
}) => {
  return (
    <Button variant="outline">
      <SelectParams>
        <div>
          {selectedToken && (
            <img
              src={selectedToken.logoURI || "/ic-unknown.svg"}
              width={20}
              height={20}
              alt="chain icon"
            />
          )}
        </div>
        <div>
          <Text fontSize={15} fontWeight={500} lineHeight="42px" color="text1">
            {selectedToken?.symbol || "Select token"}
          </Text>
        </div>
      </SelectParams>
    </Button>
  );
};

export default TokenInput;
