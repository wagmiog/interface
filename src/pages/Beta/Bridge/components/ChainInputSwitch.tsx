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
        <h4 className="mb-2 text-sm text-center text-white">Switch Chain</h4>
        <button
          onClick={switchChain}
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

export default ChainInputSwitch;
