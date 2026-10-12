# Blockchain Medical Records Mini Project

## Stack
- Solidity smart contract
- Hardhat
- Ganache
- Node.js + Express + ethers
- HTML/CSS/JavaScript + MetaMask

## Requirements
1. Node.js 18+ (Node 20/22 recommended)
2. Ganache
3. MetaMask
4. VS Code (optional)

## Folder Structure
blockchain/   Smart contract + deployment
backend/      Express API
frontend/     Browser UI

## Quick Start (Windows)

### 1. Install dependencies
Open CMD in the project root:

```cmd
setup.bat
```

### 2. Start Ganache
Use Ganache GUI and create a workspace. Default RPC is usually:
http://127.0.0.1:7545

Use the Chain ID displayed by Ganache when configuring MetaMask.

### 3. Deploy
```cmd
cd blockchain
npx hardhat compile
npx hardhat run scripts/deploy.js --network ganache
```

Copy the printed contract address.

Open BOTH:
- blockchain/deployment.json
- frontend/app.js
- backend/server.js

and replace `PASTE_CONTRACT_ADDRESS_HERE` with the deployed address.

### 4. Start backend
```cmd
cd ..\backend
node server.js
```

Backend:
http://localhost:5000

### 5. Open frontend
Open `frontend/index.html` with VS Code Live Server, or use any static web server.

## MetaMask
Add your Ganache network using the RPC URL and Chain ID shown by Ganache. Import a Ganache test account using its test private key.

## Demo
1. Connect MetaMask.
2. Add a medical record hash and type.
3. Confirm transaction.
4. View the record.
5. Grant/revoke doctor access.
6. Check doctor permission.

## Important
This educational project stores record hashes and metadata on-chain. Do NOT upload real patient medical records or real private keys. A production system should encrypt files and store them off-chain, while keeping only hashes/access metadata on-chain.
