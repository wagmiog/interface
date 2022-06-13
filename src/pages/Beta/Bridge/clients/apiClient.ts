// import { BETA_MENU_LINK } from 'src/constants'

export function fetchBalance(
  senderAddress: string,
  spenderAddresses: string[],
  tokenAddresses: string[],
  chainId: number
) {
  return fetch("http://localhost:3000/#/beta/bridge/api/balance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      walletAddress: senderAddress,
      spenderAddresses,
      tokenAddresses,
      chainId,
    }),
  }).then((res) => res.json());
}