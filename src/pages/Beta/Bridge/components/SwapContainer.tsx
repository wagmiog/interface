import React, { FunctionComponent } from "react";

interface SwapContainerProps {}

const SwapContainer: FunctionComponent<SwapContainerProps> = ({ children }) => {
  return (
    <div>
      <div>{children}</div>
      <div>
        <div>
          <img
            src={"/assets/svg/pattern.svg"}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default SwapContainer;
