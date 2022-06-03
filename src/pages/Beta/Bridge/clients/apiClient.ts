// import { BETA_MENU_LINK } from 'src/constants'

export async function fetchBalance(
  senderAddress: string,
  spenderAddresses: string[],
  tokenAddresses: string[],
  chainId: number
) {
  return fetch(window.origin + "/api/balance", {
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
