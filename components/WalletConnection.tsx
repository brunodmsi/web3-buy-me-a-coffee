import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { useState } from 'react'

export default function WalletConnection() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  })
  const { disconnect } = useDisconnect()
  const [isRequestingAccount, setIsRequestingAccount] = useState(false)

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Force MetaMask to show account selector
  const requestAccountChange = async () => {
    try {
      setIsRequestingAccount(true)
      // Request permissions to force account selection popup
      await (window as any).ethereum?.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      })
    } catch (error) {
      console.error('Failed to request account change:', error)
    } finally {
      setIsRequestingAccount(false)
    }
  }

  // Connect with forced account selection
  const connectWithAccountSelection = async () => {
    try {
      // First disconnect to clear any cached connection
      disconnect()
      
      // Small delay to ensure disconnect completes
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Request fresh permissions (this forces account picker)
      await (window as any).ethereum?.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      })
      
      // Now connect
      connect()
    } catch (error) {
      console.error('Failed to connect with account selection:', error)
      // Fallback to regular connect
      connect()
    }
  }

  if (isConnected) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
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
        <div className="flex gap-3">
          <button 
            onClick={requestAccountChange}
            disabled={isRequestingAccount}
            className="btn-primary flex-1"
          >
            {isRequestingAccount ? 'Switching...' : '🔄 Switch Account'}
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
      <div className="space-y-3">
        <button 
          onClick={() => connect()}
          className="btn-primary w-full"
        >
          🦊 Quick Connect
        </button>
        <button 
          onClick={connectWithAccountSelection}
          className="btn-secondary w-full"
        >
          🔄 Connect & Choose Account
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-3">
        Use "Choose Account" if you want to select a different MetaMask account
      </p>
    </div>
  )
} 