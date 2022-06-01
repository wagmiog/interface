import React, { FunctionComponent } from "react";

interface SwapContainerProps {}

const SwapContainer: FunctionComponent<SwapContainerProps> = ({ children }) => {
  return (
    <div className="z-50 flex flex-col p-4 py-6 m-8 shadow-xl card rounded-3xl bg-base-900 w-[550px] bg-gradient-to-b to-[#191E31] from-[#192431] relative">
      <div className="z-10 flex flex-col p-4">{children}</div>
      <div className="absolute top-0 left-0 z-0 w-full h-full">
        <div className="relative w-full h-full">
          <img
            className="scale-110 rotate-3"
            src={"/assets/svg/pattern.svg"}
          />
        </div>
      </div>
    </div>
  );
};

export default SwapContainer;
