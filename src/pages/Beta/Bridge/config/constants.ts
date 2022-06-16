import { ChainId, ChainName, SquidChain } from "../types/chain";

export const chains: SquidChain[] = [
  {
    id: ChainId.ETHEREUM,
    name: ChainName.ETHEREUM,
    network: "ropsten",
    icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    rpcUrls: {
      default: "https://ropsten.infura.io/v3/510b6d5b3c56497b8070626a54f565a9",
    },
    multicallAddress: "0x53c43764255c17bd724f74c4ef150724ac50a3ed",
    gatewayAddress: "0xBC6fcce7c5487d43830a219CA6E7B83238B41e71",
    swapExecutorAddress: "0x14e55b9517D59eB5d250D8d048c94992739CA38E",
    routerAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    defaultCrosschainToken: "0x1487F3faefE78792CDC48D87FF32aaC6650fd85f",
    wrappedNativeToken: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
    distributionENSExecutableAddress:
      "0xb123d4aA48fC5012293cf4BFD3659277468e27Cf",
    ensRegistryAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
  {
    id: ChainId.MOONBEAM,
    name: ChainName.MOONBEAM,
    network: "moonbase-alphanet",
    icon: "https://assets.coingecko.com/coins/images/22459/small/glmr.png?1641880985",
    rpcUrls: {
      default: "https://rpc.api.moonbase.moonbeam.network",
    },
    multicallAddress: "0x4E2cfca20580747AdBA58cd677A998f8B261Fc21",
    gatewayAddress: "0x5769D84DD62a6fD969856c75c7D321b84d455929",
    swapExecutorAddress: "0x8fE4B6135B80a4640B7E8a0e12da01c31176F60e",
    routerAddress: "0xF75F62464fb6ae6E7088b76457E164EeCfB07dB4",
    defaultCrosschainToken: "0xd34007bb8a54b2fbb1d6647c5aba04d507abd21d",
    wrappedNativeToken: "0x372d0695E75563D9180F8CE31c9924D7e8aaac47",
    distributionENSExecutableAddress:
      "0xD05180187165eED557c90AB907D1C0B1dd35bDD6",
    ensRegistryAddress: "",
    nativeCurrency: {
      name: "Moonbeam",
      symbol: "GLMR",
      decimals: 18,
    },
    testnet: true,
  },
  {
    id: ChainId.AVALANCHE,
    name: ChainName.AVALANCHE,
    network: "Avalanche FUJI C-Chain",
    icon: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
    rpcUrls: {
      default: "https://api.avax-test.network/ext/bc/C/rpc",
    },
    multicallAddress: "0x3D015943d2780fE97FE3f69C97edA2CCC094f78c",
    gatewayAddress: "0xC249632c2D40b9001FE907806902f63038B737Ab",
    swapExecutorAddress: "0xebDF3AAc44eE77b1b194965dEA863d77BB9EB131",
    routerAddress: "0x2D99ABD9008Dc933ff5c0CD271B88309593aB921",
    defaultCrosschainToken: "0x43F4600b552089655645f8c16D86A5a9Fa296bc3",
    wrappedNativeToken: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
    distributionENSExecutableAddress:
      "0xf6Da84C51b5C82039E9E3c64ccb3F1b05d7EF1Be",
    ensRegistryAddress: "0xa7eebb2926d22d34588497769889cbc2be0a5d97", // own deployed code, need to confirm
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
    },
    testnet: true,
  },
];

export const AXELAR_LCD = "https://axelartest-lcd.quickapi.com";
export const AXELAR_SCAN = "https://testnet.axelarscan.io";
export const AXELAR_SCAN_GMP = "https://testnet.api.gmp.axelarscan.io";