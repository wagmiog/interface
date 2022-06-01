import { chains } from "../constants/config";
import { InjectedConnector } from "wagmi/connectors/injected";

export const connectors = () => {
  return [
    new InjectedConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
  ];
};
