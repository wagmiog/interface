import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import 'inter-ui'
import React, { StrictMode, useContext, useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { NetworkContextName, PangolinProvider } from '@pangolindex/components'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import './i18n'
import App from './pages/App'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import store from './state'
import UserUpdater from './state/user/updater'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import getLibrary from './utils/getLibrary'
import { ThemeContext } from 'styled-components'
import { useIsBetaUI } from './hooks/useLocation'
import { useActiveWeb3React } from './hooks'
import Package from '../package.json'
import { fetchMinichefData } from './state/stake/hooks'
import { Provider as EvmProvider } from "wagmi";
import { providers } from "ethers";
import { chains } from "./pages/Beta/Bridge/constants/config";
import { connectors } from "./pages/Beta/Bridge/clients/walletClient";

type ProviderInput = {
  chainId?: number;
};

export const provider = ({ chainId }: ProviderInput) => {
  const chain = chains.find((chain) => chain.id === chainId);
  if (chain) {
    return new providers.JsonRpcProvider(chain.rpcUrls[0]);
  } else {
    return new providers.JsonRpcProvider(chains[0].rpcUrls[0]);
  }
};

try {
  Sentry.init({
    dsn: 'https://ff9ffce9712f415f8ad4c2a80123c984@o1080468.ingest.sentry.io/6086371',
    integrations: [new Integrations.BrowserTracing()],
    release: `pangolin-interface@${Package.version}`, //manual for now
    tracesSampleRate: 0.4,
    allowUrls: ['https://app.pangolin.exchange', 'https://beta-app.pangolin.exchange'],
    enabled: process.env.NODE_ENV === 'production',
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Blocked a frame with origin "https://app.pangolin.exchange" from accessing a cross-origin frame.'
    ]
  })
} catch (error) {
  console.log(error)
}

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)
if ('ethereum' in window) {
  ; (window.ethereum as any).autoRefreshOnNetworkChange = false
}

const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string') {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID)
  ReactGA.set({
    customBrowserType: !isMobile ? 'desktop' : 'web3' in window || 'ethereum' in window ? 'mobileWeb3' : 'mobileRegular'
  })
} else {
  ReactGA.initialize('test', { testMode: true, debug: true })
}

window.addEventListener('error', error => {
  ReactGA.exception({
    description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
    fatal: true
  })
})

const queryClient = new QueryClient()

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

const prefetchImportantQueries = async (account: string) => {
  // pre-fetch minichef query
  await queryClient.prefetchQuery(['get-minichef-farms-v2', account], fetchMinichefData(account))
}

const ComponentThemeProvider = () => {
  const isBeta = useIsBetaUI()
  const theme = useContext(ThemeContext)

  const { library, chainId, account } = useActiveWeb3React()

  useEffect(() => {
    prefetchImportantQueries(account || '')
  }, [account])

  useEffect(() => {
    if (window.pendo && account) {
      window.pendo.initialize({
        visitor: {
          id: account
        },

        account: {
          id: account
        }
      })
    }
  }, [account])

  return (
    <PangolinProvider library={library} chainId={chainId} account={account ?? undefined} theme={theme as any}>
      <FixedGlobalStyle isBeta={isBeta} />
      <ThemedGlobalStyle isBeta={isBeta} />
      <HashRouter>
        <App />
      </HashRouter>
    </PangolinProvider>
  )
}

ReactDOM.render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <EvmProvider autoConnect provider={provider} connectors={connectors}>
            <QueryClientProvider client={queryClient}>
              <Updaters />
              <ThemeProvider>
                <ComponentThemeProvider />
              </ThemeProvider>
            </QueryClientProvider>
          </EvmProvider>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
)
