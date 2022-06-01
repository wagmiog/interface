import React, { FunctionComponent } from "react";
import Skeleton from "react-loading-skeleton";
import { ComponentStyle } from "../types/component";

interface LoadingIndicatorProps extends ComponentStyle {
  width: number;
  height: number;
  baseColor?: string;
  highlightColor?: string;
}

const LoadingIndicator: FunctionComponent<LoadingIndicatorProps> = ({
  width,
  height,
  baseColor = "#444",
  highlightColor = "#666",
}) => {
  return (
    <Skeleton
      baseColor={baseColor}
      highlightColor={highlightColor}
      width={width}
      height={height}
    />
  );
};

export default LoadingIndicator;
