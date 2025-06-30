// This file will read the contract data from the deployed contract
// You'll need to update this with your actual deployed contract address and ABI

import contractData from '../contract-data.json';

// Cache the contract data
let cachedContractData = contractData;

// Ensure ABI is in the correct format
function ensureAbiFormat(abi: any) {
  if (typeof abi === 'string') {
    return JSON.parse(abi);
  }
  return abi;
}

// Export the current contract data
export const CONTRACT_ADDRESS = cachedContractData.address as `0x${string}`;
export const CONTRACT_ABI = ensureAbiFormat(cachedContractData.abi);

// Function to manually refresh contract data (for development)
export async function refreshContractData() {
  try {
    // For browser environments, fetch the updated file
    if (typeof window !== 'undefined') {
      const response = await fetch('/contract-data.json?' + Date.now());
      const newData = await response.json();
      
      cachedContractData = newData;
      
      console.log('✅ Contract data refreshed:', {
        address: newData.address,
        deploymentBlock: newData.deploymentBlock
      });
      
      return {
        address: newData.address as `0x${string}`,
        abi: ensureAbiFormat(newData.abi),
        deploymentBlock: newData.deploymentBlock
      };
    }
    
    return getContractData();
  } catch (error) {
    console.error('❌ Failed to refresh contract data:', error);
    throw error;
  }
}

// Function to get current contract data
export function getContractData() {
  return {
    address: cachedContractData.address as `0x${string}`,
    abi: ensureAbiFormat(cachedContractData.abi),
    deploymentBlock: cachedContractData.deploymentBlock
  };
}

// Check if contract data might be stale (for development warning)
export async function checkContractDataFreshness() {
  try {
    if (typeof window === 'undefined') return true; // Skip on server
    
    const response = await fetch('/contract-data.json?' + Date.now());
    const currentData = await response.json();
    
    const isStale = cachedContractData.address !== currentData.address;
    
    if (isStale) {
      console.warn('⚠️ Contract data may be stale. Current:', cachedContractData.address, 'Latest:', currentData.address);
    }
    
    return !isStale;
  } catch (error) {
    console.warn('Could not check contract data freshness:', error);
    return true; // Assume it's fine if we can't check
  }
}

// Main function to get contract info (updated to use dynamic data)
export function getContract() {
  return {
    address: cachedContractData.address as `0x${string}`,
    abi: ensureAbiFormat(cachedContractData.abi)
  };
} 