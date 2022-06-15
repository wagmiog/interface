// export enum ChainName {
//   ETHEREUM = "ethereum",
//   MOONBEAM = "moonbeam",
//   AVALANCHE = "avalanche",
// }

// export enum ChainId {
//   ETHEREUM = 3,
//   MOONBEAM = 1287,
//   AVALANCHE = 43113,
// }

// export interface Chain {
//   name: ChainName;
//   id: ChainId;
//   icon: string;
//   swapExecutorAddress: string;
//   gatewayAddress: string;
//   routerAddress: string;
//   wrappedNativeToken: string;
//   distributionENSExecutableAddress: string;
//   ensRegistryAddress: string;
//   crosschainToken: string;
//   nativeCurrency?: {
//     name: string;
//     symbol: string;
//     decimals: 18;
//   };
//   multicallAddress: string;
//   rpcUrls: string[];
// }


//MAINNET

export enum ChainName {
  ETHEREUM = "ethereum",
  MOONBEAM = "moonbeam",
  AVALANCHE = "avalanche",
}

export enum ChainId {
  ETHEREUM = 1,
  MOONBEAM = 1284,
  AVALANCHE = 43114,
}

export interface Chain {
  name: ChainName;
  id: ChainId;
  icon: string;
  swapExecutorAddress: string;
  gatewayAddress: string;
  gatewayCallerAddress: string;
  routerAddress: string;
  wrappedNativeToken: string;
  distributionENSExecutableAddress: string;
  ensRegistryAddress: string;
  crosschainToken: string;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: 18;
  };
  multicallAddress: string;
  rpcUrls: string[];
}
