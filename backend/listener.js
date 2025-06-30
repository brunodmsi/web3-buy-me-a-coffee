require('dotenv').config();
const ethers = require('ethers');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// --- Configuration ---
const contractDataPath = path.join(__dirname, '..', 'contract-data.json');
const providerUrl = 'http://127.0.0.1:7545';

// --- Database Configuration ---
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log("🚀 Starting BuyMeACoffee event listener...");

// --- Helper Functions ---
function getContractData() {
  try {
    const rawData = fs.readFileSync(contractDataPath, 'utf8');
    const data = JSON.parse(rawData);
    if (!data.address || !data.abi) {
      throw new Error("Contract address or ABI not found in contract-data.json");
    }
    
    // Handle both string and array formats for ABI (backward compatibility)
    if (typeof data.abi === 'string') {
      data.abi = JSON.parse(data.abi);
    }
    // If it's already an array/object, use it as-is
    
    return data;
  } catch (error) {
    console.error(`❌ Error reading contract data:`, error.message);
    process.exit(1);
  }
}

async function initDatabase() {
  console.log("🐘 Initializing database...");
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS memos (
        id SERIAL PRIMARY KEY,
        sender_address VARCHAR(42) NOT NULL,
        name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL,
        block_number BIGINT NOT NULL,
        tx_hash VARCHAR(66) NOT NULL UNIQUE
      );
    `);
    console.log("✅ Database ready");
  } catch (err) {
    console.error("❌ Database initialization failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

async function insertMemo(event) {
  const client = await pool.connect();
  
  // Access args by array index since event.args is an array, not an object
  const from = event.args[0];        // address
  const timestamp = new Date(Number(event.args[1]) * 1000);  // uint256 timestamp
  const name = event.args[2];        // string
  const message = event.args[3];     // string
  
  // Handle both historical events and live events
  const blockNumber = event.blockNumber || event.log?.blockNumber;
  const txHash = event.transactionHash || event.log?.transactionHash;

  const query = `
    INSERT INTO memos (sender_address, name, message, timestamp, block_number, tx_hash)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (tx_hash) DO NOTHING;
  `;
  try {
    const res = await client.query(query, [from, name, message, timestamp, blockNumber, txHash]);
    if (res.rowCount > 0) {
      console.log(`💾 New memo from ${name}: "${message}"`);
    }
  } catch (err) {
    console.error("❌ Error storing memo:", err.message);
  } finally {
    client.release();
  }
}

// --- Main Logic ---
async function main() {
  await initDatabase();

  const { address: contractAddress, abi: contractAbi, deploymentBlock } = getContractData();
  
  console.log(`🔌 Connecting to Ganache at ${providerUrl}...`);
  const provider = new ethers.JsonRpcProvider(providerUrl);

  console.log(`🎧 Listening to contract: ${contractAddress}`);
  const buyMeACoffee = new ethers.Contract(contractAddress, contractAbi, provider);

  // Process past events
  console.log("🔍 Processing past events...");
  const pastEvents = await buyMeACoffee.queryFilter('NewMemo', deploymentBlock || 0, 'latest');
  console.log(`📝 Found ${pastEvents.length} historical memos`);
  
  for (const event of pastEvents) {
    await insertMemo(event);
  }

  // Listen for new events
  console.log("👂 Listening for new memos...");
  buyMeACoffee.on('NewMemo', (_from, _timestamp, _name, _message, event) => {
    console.log("🎉 New coffee purchased!");
    insertMemo(event);
  });

  console.log("✅ Event listener active and ready!");
}

main().catch((error) => {
  console.error("💥 Fatal error:", error.message);
  process.exit(1);
}); 