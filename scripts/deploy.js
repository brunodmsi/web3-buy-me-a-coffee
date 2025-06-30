const hre = require("hardhat");

async function main() {
  // Get the signers
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Get the contract factory
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  
  // Deploy the contract
  const buyMeACoffee = await BuyMeACoffee.deploy();
  
  // Wait for deployment to finish
  await buyMeACoffee.waitForDeployment();
  
  const contractAddress = await buyMeACoffee.getAddress();
  console.log("BuyMeACoffee deployed to:", contractAddress);
  
  // Save the contract address and ABI to a file for frontend use
  const fs = require('fs');
  const contractData = {
    address: contractAddress,
    abi: JSON.parse(BuyMeACoffee.interface.formatJson()),
    deploymentBlock: (await buyMeACoffee.deploymentTransaction()?.getBlock())?.number
  };
  
  const contractDataJson = JSON.stringify(contractData, null, 2);
  
  // Save to project root for backend
  fs.writeFileSync('./contract-data.json', contractDataJson);
  
  // Save to public folder for frontend DevTools
  if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public');
  }
  fs.writeFileSync('./public/contract-data.json', contractDataJson);
  
  console.log("Contract data saved to contract-data.json and public/contract-data.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 