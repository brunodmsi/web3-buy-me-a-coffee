import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { mainnet, goerli, localhost } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

// Custom Ganache chain definition
const ganache = {
  id: 1337,
  name: 'Ganache',
  network: 'ganache',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['http://127.0.0.1:7545'] },
    default: { http: ['http://127.0.0.1:7545'] },
  },
  blockExplorers: {
    default: { name: 'Ganache', url: 'http://127.0.0.1:7545' },
  },
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [ganache, localhost, goerli, mainnet],
  [publicProvider()]
)

const config = createConfig({
  autoConnect: false, // Disable auto-connect to prevent hydration issues
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: 'your-project-id', // Replace with your WalletConnect project ID
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
} 