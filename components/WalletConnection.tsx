import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

export default function WalletConnection() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  })
  const { disconnect } = useDisconnect()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected) {
    return (
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Wallet Connected</h3>
            <p className="text-gray-600">{formatAddress(address!)}</p>
          </div>
          <button 
            onClick={() => disconnect()}
            className="btn-secondary"
          >
            Disconnect
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card text-center">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Connect Your Wallet
      </h3>
      <p className="text-gray-600 mb-6">
        Connect your wallet to buy me a coffee and leave a message!
      </p>
      <button 
        onClick={() => connect()}
        className="btn-primary w-full"
      >
        🦊 Connect with MetaMask
      </button>
    </div>
  )
} 