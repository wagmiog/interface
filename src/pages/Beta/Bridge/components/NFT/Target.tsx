import React, { useCallback, useMemo } from "react";
import {
  hexToNativeString,
  isEVMChain,
} from "@certusone/wormhole-sdk";
import { makeStyles, TextField, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import useIsWalletReady from "src/hooks/bridgeHooks/useIsWalletReady";
import useSyncTargetAddress from "src/hooks/bridgeHooks/useSyncTargetAddress";
import { GasEstimateSummary } from "src/hooks/bridgeHooks/useTransactionFees";
import { incrementStep, setTargetChain } from "src/store/nftSlice";
import {
  selectNFTIsTargetComplete,
  selectNFTShouldLockFields,
  selectNFTSourceChain,
  selectNFTTargetAddressHex,
  selectNFTTargetAsset,
  selectNFTTargetChain,
  selectNFTTargetError,
} from "src/store/selectors";
import { CHAINS_BY_ID, CHAINS_WITH_NFT_SUPPORT } from "src/utils/bridgeUtils/consts";
import ButtonWithLoader from "../ButtonWithLoader";
import ChainSelect from "../ChainSelect";
import KeyAndBalance from "../KeyAndBalance";
import LowBalanceWarning from "../LowBalanceWarning";

import StepDescription from "../StepDescription";

const useStyles = makeStyles((theme) => ({
  transferField: {
    marginTop: theme.spacing(5),
  },
  alert: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function Target() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const sourceChain = useSelector(selectNFTSourceChain);
  const chains = useMemo(
    () => CHAINS_WITH_NFT_SUPPORT.filter((c) => c.id !== sourceChain),
    [sourceChain]
  );
  const targetChain = useSelector(selectNFTTargetChain);
  const targetAddressHex = useSelector(selectNFTTargetAddressHex);
  const targetAsset = useSelector(selectNFTTargetAsset);
  let tokenId;
  const readableTargetAddress =
    hexToNativeString(targetAddressHex, targetChain) || "";
  const error = useSelector(selectNFTTargetError);
  const isTargetComplete = useSelector(selectNFTIsTargetComplete);
  const shouldLockFields = useSelector(selectNFTShouldLockFields);
  const { statusMessage } = useIsWalletReady(targetChain);
  useSyncTargetAddress(!shouldLockFields, true);
  const handleTargetChange = useCallback(
    (event) => {
      dispatch(setTargetChain(event.target.value));
    },
    [dispatch]
  );
  const handleNextClick = useCallback(() => {
    dispatch(incrementStep());
  }, [dispatch]);
  return (
    <>
      <StepDescription>Select a recipient chain and address.</StepDescription>
      <ChainSelect
        select
        fullWidth
        variant="outlined"
        value={targetChain}
        onChange={handleTargetChange}
        chains={chains}
      />
      <KeyAndBalance chainId={targetChain} />
      <TextField
        label="Recipient Address"
        fullWidth
        variant="outlined"
        className={classes.transferField}
        value={readableTargetAddress}
        disabled={true}
      />
      {targetAsset !== ethers.constants.AddressZero ? (
        <>
          <TextField
            label="Token Address"
            fullWidth
            variant="outlined"
            className={classes.transferField}
            value={targetAsset || ""}
            disabled={true}
          />
          {isEVMChain(targetChain) ? (
            <TextField
              variant="outlined"
              label="TokenId"
              fullWidth
              className={classes.transferField}
              value={tokenId || ""}
              disabled={true}
            />
          ) : null}
        </>
      ) : null}
      <Alert severity="info" variant="outlined" className={classes.alert}>
        <Typography>
          You will have to pay transaction fees on{" "}
          {CHAINS_BY_ID[targetChain].name} to redeem your NFT.
        </Typography>
        {isEVMChain(targetChain) && (
          <GasEstimateSummary methodType="nft" chainId={targetChain} />
        )}
      </Alert>
      <LowBalanceWarning chainId={targetChain} />
      <ButtonWithLoader
        disabled={!isTargetComplete} //|| !associatedAccountExists}
        onClick={handleNextClick}
        showLoader={false}
        error={statusMessage || error}
      >
        Next
      </ButtonWithLoader>
    </>
  );
}

export default Target;
