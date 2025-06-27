# ☕ Buy Me a Coffee - Web3 Edition

A decentralized "Buy me a coffee" application built with Ethereum smart contracts and Next.js. Users can tip with ETH and leave messages that are stored on the blockchain.

## Features

- 🦊 MetaMask wallet integration
- ☕ Send ETH tips with custom amounts
- 💬 Leave messages stored on blockchain
- 📱 Responsive design with Tailwind CSS
- ⛓️ Real-time updates from smart contract events
- 🔧 Support for both Hardhat and Ganache local development

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Web3**: Wagmi, Viem, Ethers.js
- **Smart Contract**: Solidity
- **Development**: Hardhat or Ganache

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask browser extension
- Git
- **Either**: Hardhat (built-in) **OR** Ganache

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd web3-buy-me-a-coffee
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

## Development Setup Options

### Option 1: Using Hardhat (Recommended)

1. **Compile the contract**
   ```bash
   npm run compile
   ```

2. **Start Hardhat local network**
   ```bash
   npx hardhat node
   ```

3. **Deploy the contract** (in a new terminal)
   ```bash
   npm run deploy
   ```

4. **MetaMask Network Setup**
   - Network Name: `Localhost 8545`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

### Option 2: Using Ganache

1. **Install Ganache**
   ```bash
   # Option A: Ganache GUI
   # Download from: https://trufflesuite.com/ganache/
   
   # Option B: Ganache CLI
   npm install -g ganache-cli
   ```

2. **Start Ganache**
   ```bash
   # Option A: Open Ganache GUI application
   
   # Option B: Ganache CLI
   ganache-cli --port 7545 --chainId 1337
   ```

3. **Compile the contract**
   ```bash
   npm run compile
   ```

4. **Deploy to Ganache**
   ```bash
   npx hardhat run scripts/deploy.js --network ganache
   ```

5. **MetaMask Network Setup for Ganache**
   - Network Name: `Ganache`
   - RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`

6. **Import Ganache Account to MetaMask**
   - Copy a private key from Ganache
   - In MetaMask: Account menu → Import Account → Paste private key

### Start the Frontend

```bash
npm run dev
```

Navigate to `http://localhost:3000`

## Smart Contract Details

### BuyMeACoffee.sol

- **Memo Struct**: Stores sender address, timestamp, name, and message
- **buyCoffee()**: Accepts ETH and stores a memo
- **getMemos()**: Returns all stored memos
- **NewMemo Event**: Emitted when a new coffee is purchased
- **withdrawTips()**: Allows owner to withdraw accumulated tips

## Network Configurations

The project supports multiple network configurations:

### Hardhat Networks
- **localhost**: `http://127.0.0.1:8545` (Chain ID: 31337)

### Ganache Networks
- **ganache**: `http://127.0.0.1:7545` (Chain ID: 1337) - Ganache GUI
- **ganache_cli**: `http://127.0.0.1:8545` (Chain ID: 1337) - Ganache CLI

### Testnet
- **goerli**: Ethereum Goerli testnet

## Deployment Commands

```bash
# Deploy to Hardhat local network
npm run deploy

# Deploy to Ganache
npx hardhat run scripts/deploy.js --network ganache

# Deploy to Ganache CLI (if using port 8545)
npx hardhat run scripts/deploy.js --network ganache_cli

# Deploy to Goerli testnet
npx hardhat run scripts/deploy.js --network goerli
```

## Troubleshooting

### Ganache-Specific Issues

1. **Connection Refused**
   - Ensure Ganache is running on the correct port (7545 for GUI, 8545 for CLI)
   - Check that the RPC URL in MetaMask matches your Ganache setup

2. **Invalid Chain ID**
   - Ganache GUI uses Chain ID 1337
   - Make sure MetaMask network configuration matches

3. **Account Issues**
   - Import Ganache accounts into MetaMask using their private keys
   - Ensure the account has ETH (Ganache provides test ETH automatically)

4. **Contract Deployment Fails**
   - Verify Ganache is running and accessible
   - Check that you're using the correct network flag: `--network ganache`

### General Issues

1. **Transaction Failed**: Make sure you have enough ETH for gas fees
2. **Wallet Not Connected**: Refresh page and reconnect MetaMask
3. **Contract Not Found**: Update contract address in `utils/contract.ts` after deployment

## Environment Variables

```bash
# .env.local example for Ganache
GANACHE_PRIVATE_KEYS=0x123...,0x456...  # Comma-separated private keys from Ganache
NEXT_PUBLIC_CHAIN_ID=1337                # For Ganache
NEXT_PUBLIC_CONTRACT_ADDRESS=            # Updated after deployment
```

## Project Structure

```
web3-buy-me-a-coffee/
├── contracts/           # Solidity smart contracts
├── scripts/            # Deployment scripts
├── components/         # React components
├── pages/             # Next.js pages
├── styles/            # CSS styles
├── utils/             # Utility functions
├── hardhat.config.js  # Hardhat configuration (supports Ganache)
└── package.json       # Dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with both Hardhat and Ganache
5. Submit a pull request

## License

MIT License 