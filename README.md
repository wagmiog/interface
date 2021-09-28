# Pangolin Interface

An open source interface for Pangolin -- a community-driven decentralized exchange for Avalanche and Ethereum assets with fast settlement, low transaction fees, and a democratic distribution -- powered by Avalanche.

- Website: [pangolin.exchange](https://pangolin.exchange/)
- Interface: [app.pangolin.exchange](https://app.pangolin.exchange)
- Telegram: [Pangolin](https://t.me/pangolindex)
- Discord: [Pangolin](https://discord.com/invite/PARrDYYbfw)
- Twitter: [@pangolindex](https://twitter.com/pangolindex)



## Accessing the Pangolin Interface

Visit [app.pangolin.exchange](https://app.pangolin.exchange).

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

### Run Storybook

```bash
yarn storybook
```

### Run Cypress Component Test

```bash
yarn component-test
```

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to your JSON-RPC provider 

Note that the interface only works on testnets where both 
[Pangolin](https://github.com/pangolindex/exchange-contracts) and 
[multicall](https://github.com/makerdao/multicall) are deployed.
The interface will not work on other networks.

### Things to note

`rm-buggy-typefiles`: we need this npm script because as of today while writing this there is issue in storybook -> emotion version, which introduce [global typescript bug](https://github.com/emotion-js/emotion/issues/1800). So while postinstall we are removing the type files till it get fixed in future storybook version.  

`SKIP_PREFLIGHT_CHECK=true`: in .env file we are keeping this variable for now. as create-react-app wrongly throwing babel-loader error if we dont keep this flag. I think this introduced after we added storybook.

## Attribution
This code was adapted from this Uniswap repo: [uniswap-interface](https://github.com/Uniswap/uniswap-interface).
