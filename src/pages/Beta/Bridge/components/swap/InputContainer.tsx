import { ComponentStyle } from "../../types/component";
import React from "react";

export const InputContainer: React.FC<ComponentStyle> = ({
  children,
}) => {
  return (
    <div>
      {children}
    </div>
  );
};
