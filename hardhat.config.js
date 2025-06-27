require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    // Hardhat local network
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    // Ganache local network
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      // Let Hardhat auto-discover Ganache accounts
    },
    // Add other networks as needed
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
}; 