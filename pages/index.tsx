import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import BuyCoffeeForm from '../components/BuyCoffeeForm'
import MemosList from '../components/MemosList'
import WalletConnection from '../components/WalletConnection'
import Alert from '../components/Alert'

export default function Home() {
  const [memos, setMemos] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [alert, setAlert] = useState<{type: 'success' | 'error' | null, message: string}>({
    type: null,
    message: ''
  })
  const { address, isConnected } = useAccount()

  // Prevent hydration mismatch by only rendering wallet-dependent content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message })
  }

  const closeAlert = () => {
    setAlert({ type: null, message: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Head>
        <title>Buy Me a Coffee - Web3 Edition</title>
        <meta name="description" content="Support me with crypto coffee!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Alert 
        type={alert.type} 
        message={alert.message} 
        onClose={closeAlert} 
      />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-coffee-brown mb-4">
            ☕ Buy Me a Coffee
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Support my work by buying me a coffee with Ethereum! Leave a nice message and it will be displayed below.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Wallet Connection and Coffee Purchase */}
            <div className="space-y-6">
              <WalletConnection />
              
              {mounted && isConnected && (
                <BuyCoffeeForm 
                  onNewMemo={(memo) => setMemos(prev => [memo, ...prev])}
                  onSuccess={(message) => showAlert('success', message)}
                  onError={(message) => showAlert('error', message)}
                />
              )}
            </div>

            {/* Memos Display */}
            <div>
              {mounted ? (
                <MemosList memos={memos} setMemos={setMemos} />
              ) : (
                <div className="card">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    💬 Coffee Messages
                  </h3>
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coffee-brown mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-gray-600">
        <p>Made with ❤️ and ☕ using Next.js and Ethereum</p>
      </footer>
    </div>
  )
} 