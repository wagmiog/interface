import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useAppSelector";
import {
  selectDestChain,
  selectSrcChain,
  setDestChain,
  setSrcChain,
} from "../slices/swapInputSlice";
import { useNetwork } from "wagmi";

const ChainInputSwitch = () => {
  const srcChain = useAppSelector(selectSrcChain);
  const destChain = useAppSelector(selectDestChain);
  const [, switchNetwork] = useNetwork();
  const dispatch = useAppDispatch();

  const switchChain = useCallback(async () => {
    if (srcChain) {
      if (!switchNetwork) return;
      if (!destChain) return;
      const { data: _chain } = await switchNetwork(destChain.id);

      if (_chain?.id === destChain.id) {
        dispatch(setSrcChain(destChain));
        dispatch(setDestChain(srcChain));
      }
    }
  }, [destChain, dispatch, srcChain, switchNetwork]);

  if (srcChain) {
    return (
      <div>
        <h4>Switch Chain</h4>
        <button
          onClick={switchChain}
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

export default ChainInputSwitch;
