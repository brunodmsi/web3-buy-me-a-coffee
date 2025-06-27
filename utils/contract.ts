// This file will read the contract data from the deployed contract
// You'll need to update this with your actual deployed contract address and ABI

export function getContract() {
  // Use the deployed contract address directly
  // Note: In Next.js, we can't read files on client-side, so we hardcode the values
  const CONTRACT_ADDRESS = "0x51F005313F7d84fA14C5B7907e71836884a10bBB" // Deployed to Ganache
  
  // Simplified ABI format for better wagmi compatibility
  const CONTRACT_ABI = [
    {
      "type": "constructor",
      "inputs": []
    },
    {
      "type": "event",
      "name": "NewMemo",
      "inputs": [
        {"name": "from", "type": "address", "indexed": true},
        {"name": "timestamp", "type": "uint256", "indexed": false},
        {"name": "name", "type": "string", "indexed": false},
        {"name": "message", "type": "string", "indexed": false}
      ]
    },
    {
      "type": "function",
      "name": "buyCoffee",
      "stateMutability": "payable",
      "inputs": [
        {"name": "_name", "type": "string"},
        {"name": "_message", "type": "string"}
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "getMemos",
      "stateMutability": "view",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "components": [
            {"name": "from", "type": "address"},
            {"name": "timestamp", "type": "uint256"},
            {"name": "name", "type": "string"},
            {"name": "message", "type": "string"}
          ]
        }
      ]
    },
    {
      "type": "function",
      "name": "withdrawTips",
      "stateMutability": "nonpayable",
      "inputs": [],
      "outputs": []
    }
  ] as const

  return {
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI
  }
} 