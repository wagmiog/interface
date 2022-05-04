import React, { useState, useEffect } from 'react'
import { useActiveWeb3React } from 'src/hooks'
// import { useETHBalances } from '@pangolindex/components'
import { useChainId } from 'src/hooks'
import { useETHBalances } from 'src/state/wallet/hooks'
import { connect, keyStores, WalletConnection } from 'near-api-js'
import { Button } from '@pangolindex/components'

const BridgeUI = () => {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()
  const userEthBalance = useETHBalances(chainId, account ? [account] : [])?.[account ?? '']



  const [login, setLogin] = useState<boolean>()
  const [accountNear, setAccountNear] = useState('')
  const [accountBalance, setAccountBalance] = useState('')

  const init = async() => {
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();
    const config = {
      networkId: "testnet",
      keyStore,
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org',
      helperUrl: 'https://helper.testnet.near.org',
      explorerUrl: 'https://explorer.testnet.near.org',
    };
    // @ts-ignore
    const near = await connect(config)
    const wallet = new WalletConnection(near, 'png')
    wallet.requestSignIn("dev-1650966900941-97217298551664")
  }


  useEffect(() => {
    const init = async() => {
      const keyStore = new keyStores.BrowserLocalStorageKeyStore();
      const config = {
        networkId: "testnet",
        keyStore,
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
      };
      // @ts-ignore
      const near = await connect(config)
      const wallet = new WalletConnection(near, 'png')
      setAccountNear(wallet.getAccountId())
      setLogin(wallet.isSignedIn())
      if (login && accountNear) {
        const ac = await near.account('helix.testnet');
        const ts = await ac.getAccountBalance()
        setAccountBalance(ts.available)
      }
    }
    init()
    
  }, [login, accountNear])
  
  const logout = async() => {
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();
  
    const config = {
      networkId: "testnet",
      keyStore,
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org',
      helperUrl: 'https://helper.testnet.near.org',
      explorerUrl: 'https://explorer.testnet.near.org',
    };
    // @ts-ignore
    const near = await connect(config)
    const wallet = new WalletConnection(near, 'png')
    wallet.signOut();
    setAccountNear('')
    setLogin(false)
  }
  // @ts-ignore
  // console.log('accoun', accountNear)
  // console.log('login?', login)
  // console.log('EVM', account)
  // console.log(accountBalance)
  return (
    <>
    <div style={{paddingTop: '50px'}}></div>
     {!login ? (
            <Button variant="primary" height={36} padding="4px 6px" onClick={init}>
              <span style={{ whiteSpace: 'nowrap', color: '#000' }}>Near connect</span>
            </Button>
          ) : (
            <Button variant="primary" height={36} padding="4px 6px" onClick={logout}>
              <span style={{ whiteSpace: 'nowrap', color: '#000' }}>Near logout</span>
            </Button>
          )}
      <p style={{color: 'white'}}>EVM account :{ account }</p>
      <p style={{color: 'white'}}>EVM balance:{ userEthBalance?.toSignificant(4) }</p>
      
      <p style={{color: 'white'}}>NEAR account: { accountNear }</p>
      <p style={{color: 'white'}}>NEAR balance: {accountBalance}</p>
      
    </>
  )
}

export default BridgeUI
