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
        <h4 className="mb-2 text-sm text-center text-white">Switch Token</h4>
        <button
          onClick={switchToken}
          className="bg-[#181A25] rounded-full p-5 mx-auto block"
          style={{
            boxShadow:
              "inset 0px 2px 2px rgba(41, 53, 74, 0.4), inset 0px -2px 2px #0D131D",
          }}
        >
          <div className="flex !space-x-2">
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
