# BlockTrace – Cryptocurrency Transaction Tracking & Risk Analysis DApp

> **College Blockchain Technology Mini-Project**  
> A decentralized web application designed to analyze cryptocurrency wallet activity, calculate rule-based risk scores, and store immutable investigation audit records on the Ethereum blockchain using Solidity smart contracts.

---

## 🌐 REAL ETHEREUM WALLET ANALYSIS (NEW FEATURE)

BlockTrace now supports both **Offline Demo Mode** and **Live Ethereum Mainnet Mode** via the Etherscan API V2.

### 🔑 How to Set Up Live Ethereum Mode with Etherscan API:

1. **Get a Free Etherscan API Key:**
   - Sign up for a free account at [https://etherscan.io/myapikey](https://etherscan.io/myapikey).
   - Create a new API key token.

2. **Create Your `.env` File:**
   - In the `frontend/` folder, copy `.env.example` to `.env`:
     ```powershell
     cp frontend/.env.example frontend/.env
     ```
   - Open `frontend/.env` and paste your API key:
     ```env
     VITE_ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY_HERE
     ```

3. **Analyze Any Public Ethereum Wallet Address:**
   - Start the frontend (`npm run dev`).
   - Navigate to **"Analyze Wallet"** on the sidebar.
   - Click the mode toggle: **`[ Live Ethereum ]`**.
   - Enter any valid public Ethereum address (e.g., `0x742d35Cc6634C0532925a3b844Bc454e4438f44e` or `vitalik.eth` address `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`).
   - Click **"Analyze Wallet"**.
   - BlockTrace fetches live mainnet transaction history, parses Wei values to ETH, computes unique counterparties & transfer magnitude, and calculates the risk score (0–100).

> [!IMPORTANT]  
> **Offline Demo Mode:** If no API key is provided, **Demo Mode remains 100% functional** without requiring any setup or external API key!

---

## 📌 Project Overview

BlockTrace allows users to inspect any Ethereum wallet address or transaction hash, analyze transaction behavior, calculate a deterministic risk score (0–100), and register formal investigation snapshots directly to an Ethereum smart contract (`InvestigationRegistry.sol`).

### Core Purpose
- **Behavioral Risk Evaluation:** Analyzes transaction count, counterparty volume, transfer amounts, transaction velocity, and pattern anomalies.
- **On-Chain Audit Trail:** Registers investigation snapshots permanently on the Ethereum blockchain.
- **Educational Scope:** Built specifically for college demonstration with a built-in **Offline Demo Mode** (no external APIs required).

> [!NOTE]  
> **Academic Disclaimer:** This application does **NOT** claim that an address belongs to a scammer or criminal entity. It identifies *potentially unusual activity patterns* based on transparent, rule-based heuristics.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React.js (v18) + Vite |
| **Styling & UI** | Tailwind CSS (Dark Cybersecurity Theme) + Lucide Icons |
| **Blockchain Network** | Ethereum (Hardhat Local Testnet, Chain ID 31337) |
| **Smart Contract** | Solidity (`v0.8.20`) |
| **Web3 Integration** | Ethers.js (`v6`) + MetaMask Extension |
| **Live Blockchain API** | Etherscan API V2 (Ethereum Mainnet) |
| **Testing** | Hardhat / Chai Unit Tests |

---

## 📁 Project Structure

```
blocktrace/
│
├── blockchain/                      # Smart Contract & Hardhat Layer
│   ├── contracts/
│   │   └── InvestigationRegistry.sol # Solidity smart contract
│   ├── scripts/
│   │   └── deploy.js                # Deployment script & ABI exporter
│   ├── test/
│   │   └── InvestigationRegistry.test.js # Automated unit tests (6 passing)
│   ├── hardhat.config.js            # Hardhat network configuration
│   └── package.json
│
├── frontend/                        # React Dashboard Layer
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   │   ├── Navbar.jsx           # Topbar with MetaMask status
│   │   │   ├── StatCard.jsx         # Summary metrics widget
│   │   │   ├── RiskBadge.jsx        # Risk level pill badge
│   │   │   ├── RiskGauge.jsx        # Visual circular score meter
│   │   │   └── Modal.jsx            # Reusable popup dialog
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Analytics dashboard overview
│   │   │   ├── AnalyzeWallet.jsx    # Dual-mode wallet analyzer form & results
│   │   │   ├── AnalyzeTx.jsx        # Single transaction inspector
│   │   │   ├── History.jsx          # On-chain investigation logs
│   │   │   └── About.jsx            # Project overview & Viva guide
│   │   ├── contracts/
│   │   │   ├── InvestigationRegistry.json # Smart contract ABI
│   │   │   └── contractAddress.json       # Deployed address metadata
│   │   ├── utils/
│   │   │   ├── riskEngine.js        # Deterministic scoring function
│   │   │   ├── etherscan.js         # Etherscan API V2 live fetcher
│   │   │   ├── demoData.js          # Sample wallets & transactions
│   │   │   └── web3.js              # Ethers.js & MetaMask helpers
│   │   ├── App.jsx                  # Main application wrapper
│   │   ├── main.jsx                 # Vite React entry point
│   │   └── index.css                # Custom cyber styling & Tailwind
│   ├── .env.example                 # Environment template
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── .env.example                     # Environment template
└── README.md                        # Documentation & Viva Q&A Guide
```

---

## ⚙️ Installation & Step-by-Step Instructions

### Step 1: Open Project Directory
```powershell
cd c:\Users\aarya\Desktop\BCT\blocktrace
```

### Step 2: Install Blockchain & Frontend Dependencies
```powershell
# 1. Install blockchain dependencies
cd blockchain
npm install

# 2. Install frontend dependencies
cd ..\frontend
npm install
```

---

## 🚀 How to Run the Complete Project

### Step 3: Run Smart Contract Unit Tests
Verify that the smart contract logic passes all tests:
```powershell
cd c:\Users\aarya\Desktop\BCT\blocktrace\blockchain
npx hardhat test
```
*(All 6 unit tests pass).*

### Step 4: Start Local Hardhat Ethereum Node
Start a local blockchain testnet running on `http://127.0.0.1:8545`:
```powershell
cd c:\Users\aarya\Desktop\BCT\blocktrace\blockchain
npx hardhat node
```
*(Keep this terminal window running!).*

### Step 5: Deploy Smart Contract to Local Network
In a **second terminal window**, deploy `InvestigationRegistry.sol`:
```powershell
cd c:\Users\aarya\Desktop\BCT\blocktrace\blockchain
npx hardhat run scripts/deploy.js --network localhost
```
*This deploys the contract to local network and exports contract ABI & address to `frontend/src/contracts/`.*

### Step 6: Start React Frontend
In a **third terminal window**, start Vite dev server:
```powershell
cd c:\Users\aarya\Desktop\BCT\blocktrace\frontend
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🦊 How to Connect MetaMask

1. Install the **MetaMask** browser extension.
2. Add the **Hardhat Localhost** network to MetaMask:
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`
3. Import Account #0 Private Key from your `npx hardhat node` terminal output:
   `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
4. Click **"Connect MetaMask"** in the BlockTrace navbar.

---

## 🧮 Rule-Based Risk Scoring Logic

The risk engine starts at 0 points and adds **+20 points** for each triggered indicator (Max score = 100):

1. **High Transaction Frequency (+20):** Total transactions $\ge 25$.
2. **Multiple Counterparty Addresses (+20):** Unique addresses $\ge 10$.
3. **Large Transfer Volume (+20):** ETH transfer $\ge 10\text{ ETH}$.
4. **Rapid Sequence Transfers (+20):** Sub-minute back-to-back transfer sequence.
5. **Unusual Pattern Structure (+20):** Suspicious distribution or fan-out pattern.

### Risk Level Tiers:
- **0 – 30:** `LOW RISK` (Green)
- **31 – 60:** `MEDIUM RISK` (Yellow)
- **61 – 100:** `HIGH RISK` (Red)
