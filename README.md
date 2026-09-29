# BlockTrace – Cryptocurrency Transaction Tracking & Risk Analysis DApp

> **College Blockchain Technology Mini-Project**  
> A full-stack decentralized web application designed to analyze cryptocurrency wallet activity, calculate rule-based risk scores, and store immutable investigation audit records on the Ethereum blockchain using Solidity smart contracts.

---

## ✅ PROJECT STATUS: COMPLETE (100% WORKING)

- **Smart Contract:** `InvestigationRegistry.sol` compiled & deployed (6/6 Hardhat unit tests passing).
- **Frontend Dashboard:** React.js + Vite + Tailwind CSS (Dark Cybersecurity Theme).
- **Dual Analysis Modes:**
  - 🟢 **Educational Demo Mode:** 100% offline-compatible for college presentations (Requires NO API key).
  - 🔵 **Live Ethereum Mode:** Queries live Ethereum Mainnet transaction history via Etherscan API V2.
- **Web3 & MetaMask:** Non-custodial wallet connection to Hardhat local testnet (Chain ID `31337`).
- **Audit Registry:** On-chain record registration and searchable investigation history.

---

## 📌 Project Purpose & Features

1. **Wallet Address Inspection:** Accepts any public 42-character Ethereum address (`0x...`).
2. **Behavioral Risk Engine:** Calculates a transparent, rule-based score from **0 to 100** (+20 points per triggered heuristic).
3. **Risk Categorization:** Classifies activity into **LOW RISK (0-30)**, **MEDIUM RISK (31-60)**, and **HIGH RISK (61-100)** with non-incriminating terminology ("Potentially Unusual Activity", "Risk Indicators Detected").
4. **On-Chain Audit Trail:** Registers investigation snapshots permanently on an Ethereum smart contract (`InvestigationRegistry.sol`).
5. **Single Transaction Inspector:** Inspects transfer amounts, gas usage, sender/receiver counterparty details, and single-tx risk metrics.
6. **Dynamic Random Address Generator:** Generates random valid addresses with dynamic risk score variations for presentation testing.
7. **Verified Mainnet Shortcuts:** Quick-select buttons for high-profile mainnet addresses (Vitalik Buterin, Binance Hot Wallet, Ethereum Foundation, Uniswap Router).

> [!NOTE]  
> **Academic Disclaimer:** This application does **NOT** claim that an address belongs to a scammer or criminal entity. It strictly identifies *potentially unusual transaction patterns* based on transparent, rule-based heuristics.

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
│   │   │   ├── RiskGauge.jsx        # Visual circular score meter SVG
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
├── .gitignore                       # Git ignore configuration (.env ignored)
├── .env.example                     # Environment template
└── README.md                        # Documentation & Viva Q&A Guide
```

---

## ⚙️ Installation & Setup

### Step 1: Open Project Directory
```powershell
cd c:\Users\aarya\Desktop\BCT\blocktrace
```

### Step 2: Install Dependencies
```powershell
# Install blockchain dependencies
cd blockchain
npm install

# Install frontend dependencies
cd ..\frontend
npm install
```

---

## 🌐 Etherscan API Setup (Optional for Live Ethereum Mode)

To analyze real Mainnet wallets via Live Ethereum Mode:
1. Get a free API key at [https://etherscan.io/myapikey](https://etherscan.io/myapikey).
2. Copy `frontend/.env.example` to `frontend/.env`:
   ```powershell
   cp frontend/.env.example frontend/.env
   ```
3. Open `frontend/.env` and paste your key:
   ```env
   VITE_ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY_HERE
   ```

*(Note: Demo Mode works 100% offline without needing any API key!).*

---

## 🚀 How to Run the Complete Project

### Step 3: Run Smart Contract Unit Tests
```powershell
cd c:\Users\aarya\Desktop\BCT\blocktrace\blockchain
npx hardhat test
```
*(Confirms 6/6 tests passing).*

### Step 4: Start Local Hardhat Ethereum Node
Start a local blockchain node on `http://127.0.0.1:8545`:
```powershell
cd c:\Users\aarya\Desktop\BCT\blocktrace\blockchain
npx hardhat node
```
*(Keep this terminal running!).*

### Step 5: Deploy Smart Contract to Local Network
In a **second terminal**, deploy `InvestigationRegistry.sol`:
```powershell
cd c:\Users\aarya\Desktop\BCT\blocktrace\blockchain
npx hardhat run scripts/deploy.js --network localhost
```

### Step 6: Start React Frontend
In a **third terminal**, launch Vite dev server:
```powershell
cd c:\Users\aarya\Desktop\BCT\blocktrace\frontend
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🦊 How to Connect MetaMask

1. Install the **MetaMask** browser extension.
2. Add network: **Hardhat Localhost** (`http://127.0.0.1:8545`, Chain ID `31337`).
3. Import Account #0 Private Key from `npx hardhat node` output:
   `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
4. Click **"Connect MetaMask"** in the BlockTrace top bar.

---

## 🧮 Rule-Based Risk Scoring Logic

The risk engine starts at 0 points and adds **+20 points** for each triggered indicator (Max score = 100):

1. **High Transaction Frequency (+20):** Total transactions $\ge 25$.
2. **Multiple Counterparty Addresses (+20):** Unique addresses $\ge 10$.
3. **Large Transfer Volume (+20):** Single ETH transfer $\ge 10\text{ ETH}$.
4. **Rapid Sequence Transfers (+20):** Sub-minute back-to-back transfer sequence.
5. **Unusual Pattern Structure (+20):** Suspicious distribution or fan-out pattern.

### Risk Level Tiers:
- **0 – 30:** `LOW RISK` (Green)
- **31 – 60:** `MEDIUM RISK` (Yellow)
- **61 – 100:** `HIGH RISK` (Red)

---

## 🎓 Viva Q&A Quick Reference

### Q1: What is the main objective of BlockTrace?
**Answer:** BlockTrace is a decentralized risk intelligence prototype designed to analyze cryptocurrency wallet activity using deterministic rule-based algorithms and store permanent investigation audit snapshots on the Ethereum blockchain.

### Q2: Which smart contract functions are implemented?
**Answer:**
- `registerInvestigation(walletAddress, riskScore, riskLevel, primaryReason)`
- `getInvestigation(investigationId)`
- `getTotalInvestigations()`
- `getAllInvestigations()`
- `getInvestigationsByWallet(walletAddress)`

### Q3: Why use deterministic rule-based scoring instead of ML?
**Answer:** Deterministic rules offer 100% explainability, auditability, and mathematical consistency. Analyzing the same address on the blockchain will always yield the exact same verifiable risk score.

---

## 📤 Pushing to GitHub

```powershell
cd c:\Users\aarya\Desktop\BCT\blocktrace
git remote add origin https://github.com/AaryaNighut/blocktrace.git
git push -u origin main
```
