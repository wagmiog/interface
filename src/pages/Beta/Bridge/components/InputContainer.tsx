import { ComponentStyle } from "../types/component";
import React from "react";

const InputContainer: React.FC<ComponentStyle> = ({ children, className }) => {
  return (
    <div
    >
      {children}
    </div>
  );
};

export default InputContainer;
