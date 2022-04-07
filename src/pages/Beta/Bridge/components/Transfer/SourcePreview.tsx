import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  selectSourceWalletAddress,
  selectTransferAmount,
  selectTransferSourceChain,
  selectTransferSourceParsedTokenAccount,
} from "src/store/selectors";
import { CHAINS_BY_ID } from "src/utils/bridgeUtils/consts";
import SmartAddress from "../SmartAddress";

const useStyles = makeStyles((theme) => ({
  description: {
    textAlign: "center",
  },
}));

export default function SourcePreview() {
  const classes = useStyles();
  const sourceChain = useSelector(selectTransferSourceChain);
  const sourceParsedTokenAccount = useSelector(
    selectTransferSourceParsedTokenAccount
  );
  const sourceWalletAddress = useSelector(selectSourceWalletAddress);
  const sourceAmount = useSelector(selectTransferAmount);

  const explainerContent =
    sourceChain && sourceParsedTokenAccount ? (
      <>
        <span style={{color: 'white'}}>You will transfer {sourceAmount}</span>
        <SmartAddress
          chainId={sourceChain}
          parsedTokenAccount={sourceParsedTokenAccount}
        />
        {sourceWalletAddress ? (
          <>
            <span style={{color: 'white'}}>from</span>
            <SmartAddress chainId={sourceChain} address={sourceWalletAddress} />
          </>
        ) : null}
        <span>on {CHAINS_BY_ID[sourceChain].name}</span>
      </>
    ) : (
      ""
    );

  return (
    <>
      <Typography
        style={{color: 'white'}}
        component="div"
        variant="subtitle2"
        className={classes.description}
      >
        {explainerContent}
      </Typography>
    </>
  );
}
