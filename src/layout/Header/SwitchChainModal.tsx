import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Box, Text } from '@pangolindex/components'
import Modal from '../../components/Modal'
import { RowBetween } from 'src/components/Row'
import { CHAINS } from 'src/constants/chains'
import { StyledEthereumLogo } from 'src/components/CurrencyLogo'
import { ChainId } from '@pangolindex/sdk'


type IStatus = {
    hideChainModal: () => void;
    chainModal: boolean;
}

export const RenderChangeChainModal: React.FC<IStatus> = ({hideChainModal, chainModal}) => {
    const theme = useContext(ThemeContext)

    const switchNetwork = async (chainId: ChainId) => {
        try {
            //@ts-ignore
            await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x2B67' }]
            })
        } catch (error) {
            //@ts-ignore
            if (error.code === 4902) {
            try {
                //@ts-ignore
                await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                    chainId: '0x2B67',
                    chainName: CHAINS[chainId].name,
                    rpcUrls: ['https://api.trywagmi.xyz/rpc'],
                    nativeCurrency: {
                        name: 'WGM',
                        symbol: 'WGM',
                        decimals: 18
                    },
                    blockExplorerUrls: ['https://snowtrace.io']
                    }
                ]
                })
            } catch (error) {
                //@ts-ignore
                alert(error.message)
            }
            }
        }
    }
    return (
      <Modal isOpen={chainModal} onDismiss={hideChainModal} isBeta={true} overlayBG={theme.modalBG2} maxHeight={20} minHeight={20} maxWidth={600}>
          <Box>
            <Text fontSize={24} fontWeight={500} color="text10" p={45}>
              Select chain
            </Text>
            <RowBetween style={{gap: "30px"}}>
                <Box borderRadius={7} bgColor={"bg8"} p={10} style={{marginLeft: "8%"}} onClick={() => switchNetwork(43114)}>
                    <span style={{display: "flex", gap: "15px", verticalAlign: "middle", minWidth: "220px"}}>
                        <StyledEthereumLogo src={CHAINS[43114].logo} size={'30px'} />
                        <Text fontWeight={500} lineHeight={2} color={"text10"} fontSize={16}>Avalanche Network</Text>
                    </span>
                </Box>
                <Box borderRadius={7} bgColor={"bg8"} p={10} onClick={() => switchNetwork(11111)}>
                    <span style={{display: "flex", gap: "15px", verticalAlign: "middle", minWidth: "220px"}}>
                        <StyledEthereumLogo src={CHAINS[11111].logo} size={'30px'} />
                        <Text fontWeight={500} color={"text10"} fontSize={16}>Wagmi Network</Text>
                    </span>
                </Box>
            </RowBetween>
          </Box>
      </Modal>
    )
  }