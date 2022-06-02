import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useAppSelector";
import {
  selectDestToken,
  selectSrcToken,
  setDestToken,
  setSrcToken,
} from "../slices/swapInputSlice";
import {
  selectDestTokenAtSrcChain,
  selectSrcTokenAtDestChain,
} from "../slices/tokenSlice";

const TokenInputSwitch = () => {
  const srcToken = useAppSelector(selectSrcToken);
  const destToken = useAppSelector(selectDestToken);
  const destTokenAtSrcChain = useAppSelector(selectDestTokenAtSrcChain);
  const srcTokenAtDestChain = useAppSelector(selectSrcTokenAtDestChain);
  const dispatch = useAppDispatch();

  const switchToken = useCallback(() => {
    if (srcTokenAtDestChain) {
      dispatch(setSrcToken(destTokenAtSrcChain));
      dispatch(setDestToken(srcTokenAtDestChain));
    }
  }, [destTokenAtSrcChain, dispatch, srcTokenAtDestChain]);

  if (srcToken && destToken) {
    return (
      <div>
        <h4>Switch Token</h4>
        <button
          onClick={switchToken}
          >
          <div>
            <img
              src="/assets/svg/double-arrow.svg"
              height={20}
              width={20}
              alt="double-arrow"
            />
          </div>
        </button>
      </div>
    );
  } else {
    return null;
  }
};

export default TokenInputSwitch;
