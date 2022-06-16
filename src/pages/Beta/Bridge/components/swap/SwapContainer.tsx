import React, { FunctionComponent } from "react";

interface SwapContainerProps {}

export const SwapContainer: FunctionComponent<SwapContainerProps> = ({
  children,
}) => {
  return (
    <div>
      <div>{children}</div>
      <div>
        <div>

        </div>
      </div>
    </div>
  );
};
