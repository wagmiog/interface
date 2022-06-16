import { ComponentStyle } from "../../types/component";
import React, { FunctionComponent } from "react";

interface MaxButtonProps extends ComponentStyle {
  onclick?: () => void;
  text: string;
}

export const Badge: FunctionComponent<MaxButtonProps> = ({ onclick, text }) => (
  <span>
    <svg
      onClick={onclick}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
    {text}
  </span>
);
