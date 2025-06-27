import { useEffect } from 'react'
import { useContractRead } from 'wagmi'
import { getContract } from '../utils/contract'

interface Memo {
  from: string
  timestamp: number
  name: string
  message: string
}

interface MemosListProps {
  memos: Memo[]
  setMemos: (memos: Memo[]) => void
}

export default function MemosList({ memos, setMemos }: MemosListProps) {
  const contract = getContract()

  const { data: contractMemos, isLoading } = useContractRead({
    address: contract.address as `0x${string}`,
    abi: contract.abi,
    functionName: 'getMemos',
    watch: true,
  })

  useEffect(() => {
    if (contractMemos) {
      // Convert the contract data to our memo format
      const formattedMemos = (contractMemos as any[]).map((memo: any) => ({
        from: memo.from,
        timestamp: Number(memo.timestamp) * 1000, // Convert to milliseconds
        name: memo.name,
        message: memo.message
      })).reverse() // Show newest first
      
      setMemos(formattedMemos)
    }
  }, [contractMemos, setMemos])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          💬 Coffee Messages
        </h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coffee-brown mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        💬 Coffee Messages ({memos.length})
      </h3>
      
      {memos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No messages yet. Be the first to buy a coffee! ☕</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {memos.map((memo, index) => (
            <div key={index} className="border-l-4 border-coffee-brown bg-gray-50 p-4 rounded-r-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800">{memo.name}</h4>
                <span className="text-xs text-gray-500">
                  {formatDate(memo.timestamp)}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{memo.message}</p>
              <p className="text-xs text-gray-500">
                From: {formatAddress(memo.from)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 