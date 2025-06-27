import { useState, useEffect } from 'react'
import { useAccount, useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { getContract } from '../utils/contract'

interface BuyCoffeeFormProps {
  onNewMemo: (memo: any) => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export default function BuyCoffeeForm({ onNewMemo, onSuccess, onError }: BuyCoffeeFormProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [coffeeAmount, setCoffeeAmount] = useState('0.001')
  const [error, setError] = useState<string | null>(null)
  
  const { address } = useAccount()
  const { chain } = useNetwork()
  const contract = getContract()



  // Prepare the contract write with current form values
  const { config, error: prepareError } = usePrepareContractWrite({
    address: contract.address as `0x${string}`,
    abi: contract.abi,
    functionName: 'buyCoffee',
    args: [name, message],
    value: parseEther(coffeeAmount),
    enabled: Boolean(name && message && coffeeAmount && chain?.id === 1337),
    chainId: 1337, // Explicitly set Ganache chain ID
  })

  const { 
    write: buyCoffee, 
    data: txData, 
    isLoading: isWriting, 
    error: writeError,
    isSuccess: writeSuccess 
  } = useContractWrite(config)

  // Handle prepare error
  useEffect(() => {
    if (prepareError) {
      onError(`Preparation failed: ${prepareError.message}`)
    }
  }, [prepareError, onError])

  // Handle write error
  useEffect(() => {
    if (writeError) {
      onError(`Transaction failed: ${writeError.message}`)
    }
  }, [writeError, onError])

  // Handle write success
  useEffect(() => {
    if (writeSuccess && txData) {
      setError(null)
    }
  }, [writeSuccess, txData])

  const { isLoading: isTxLoading, isSuccess, error: txError } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: (data) => {
      // Add the new memo to the list
      onNewMemo({
        from: address,
        timestamp: Date.now(),
        name,
        message
      })
      
      // Reset form
      setName('')
      setMessage('')
      setError(null)
      
      onSuccess('Coffee purchased successfully! ☕')
    },
    onError: (error) => {
      onError(`Transaction confirmation failed: ${error.message}`)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !message.trim()) {
      onError('Please fill in both name and message!')
      return
    }
    
    if (parseFloat(coffeeAmount) <= 0) {
      onError('Please enter a valid amount!')
      return
    }

    if (chain?.id !== 1337) {
      onError('Please switch to Ganache network (Chain ID: 1337) in MetaMask')
      return
    }

    setError(null) // Clear previous errors
    
    if (!buyCoffee) {
      onError('Transaction not prepared. Please check your inputs and network connection.')
      return
    }
    
    try {
      buyCoffee()
    } catch (error) {
      onError(`Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const isLoading = (isWriting || isTxLoading) && !isSuccess

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        ☕ Buy Me a Coffee
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-brown"
            placeholder="Enter your name"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-brown"
            placeholder="Leave a nice message..."
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coffee Amount (ETH)
          </label>
          <select
            value={coffeeAmount}
            onChange={(e) => setCoffeeAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-brown"
            disabled={isLoading}
          >
            <option value="0.001">☕ Small Coffee - 0.001 ETH</option>
            <option value="0.003">☕ Medium Coffee - 0.003 ETH</option>
            <option value="0.005">☕ Large Coffee - 0.005 ETH</option>
            <option value="0.01">☕ Extra Large - 0.01 ETH</option>
          </select>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="text-red-800">
                <strong>Error:</strong> {error}
              </div>
            </div>
          </div>
        )}


        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Processing...' : `Buy Coffee (${coffeeAmount} ETH)`}
        </button>
      </form>
    </div>
  )
} 