import { ComponentStyle } from "../types/component";
import React, { FunctionComponent } from "react";

interface MaxButtonProps extends ComponentStyle {
  onclick?: () => void;
  text: string;
}

const Badge: FunctionComponent<MaxButtonProps> = ({ onclick, text }) => (
  <span>
      <svg 
        onClick={onclick} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
      >
          <path />
      </svg>
      {text}
  </span>
);

export default Badge;