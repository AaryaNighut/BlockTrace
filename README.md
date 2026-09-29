# BlockTrace – Cryptocurrency Transaction Tracking & Risk Analysis DApp

> **College Blockchain Technology Mini-Project**  
> A decentralized web application designed to analyze cryptocurrency wallet activity, calculate rule-based risk scores, and store immutable investigation audit records on the Ethereum blockchain using Solidity smart contracts.

---

## 📌 Project Overview

**BlockTrace** allows users to inspect any Ethereum wallet address or transaction hash, analyze transaction behavior, calculate a deterministic risk score (0–100), and register formal investigation snapshots directly to an Ethereum smart contract (`InvestigationRegistry.sol`).

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
| **Blockchain** | Ethereum (Hardhat Local Testnet) |
| **Smart Contract** | Solidity (`v0.8.20`) |
| **Web3 Integration** | Ethers.js (`v6`) + MetaMask Extension |
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
│   │   └── InvestigationRegistry.test.js # Automated unit tests
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
│   │   │   ├── AnalyzeWallet.jsx    # Wallet analyzer form & results
│   │   │   ├── AnalyzeTx.jsx        # Single transaction inspector
│   │   │   ├── History.jsx          # On-chain investigation logs
│   │   │   └── About.jsx            # Project overview & Viva guide
│   │   ├── contracts/
│   │   │   ├── InvestigationRegistry.json # Smart contract ABI
│   │   │   └── contractAddress.json       # Deployed address metadata
│   │   ├── utils/
│   │   │   ├── riskEngine.js        # Deterministic scoring function
│   │   │   ├── demoData.js          # Sample wallets & transactions
│   │   │   └── web3.js              # Ethers.js & MetaMask helpers
│   │   ├── App.jsx                  # Main application wrapper
│   │   ├── main.jsx                 # Vite React entry point
│   │   └── index.css                # Custom cyber styling & Tailwind
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md                        # Documentation & Viva Q&A Guide
```

---

## ⚙️ Installation & Setup

### 1. Clone / Open Project Directory
Navigate into the root folder:
```bash
cd blocktrace
```

### 2. Install Blockchain Dependencies
```bash
cd blockchain
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## 🚀 How to Run the Project Locally

### Step 1: Run Smart Contract Unit Tests
Ensure the Solidity contract compiles and passes all checks:
```bash
cd blockchain
npx hardhat test
```

### Step 2: Start Local Hardhat Ethereum Node
Start a local blockchain testnet running on `http://127.0.0.1:8545`:
```bash
cd blockchain
npx hardhat node
```
*(Keep this terminal running! Hardhat will output 20 test accounts with private keys).*

### Step 3: Deploy Smart Contract to Local Network
In a **new terminal window**, deploy `InvestigationRegistry.sol`:
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```
*This automatically exports the contract address and ABI into `frontend/src/contracts/`.*

### Step 4: Start React Frontend
In another terminal window:
```bash
cd frontend
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🦊 How to Connect MetaMask

1. Install the [MetaMask Extension](https://metamask.io/) in your browser.
2. Add the **Hardhat Local Network** to MetaMask:
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`
3. Import a Hardhat Test Account into MetaMask using one of the private keys printed by `npx hardhat node` (e.g. Account #0: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`).
4. Click **"Connect MetaMask"** in the BlockTrace top bar.

---

## 🧪 How to Use Demo Mode (College Viva Presentation)

BlockTrace includes pre-configured sample datasets so you can demonstrate the complete DApp **without needing external API keys**:

1. Click **"Analyze Wallet"** on the sidebar.
2. Under **"Educational Demo Mode"**, click any of the 3 pre-built sample wallets:
   - **1. Low Risk Wallet:** Few transfers, low amounts (Score: 15/100)
   - **2. Medium Risk Wallet:** Moderate activity, varied counterparties (Score: 40/100)
   - **3. High Risk Wallet:** High frequency, large transfers, rapid sequences (Score: 78/100)
3. Click **"Analyze Wallet"** to view the risk gauge, triggered heuristics, and transaction breakdown.
4. Click **"Register Investigation on Blockchain"** to trigger a MetaMask transaction and record the audit on your local Ethereum network!

---

## 🧮 Rule-Based Risk Scoring Logic

The risk engine (`src/utils/riskEngine.js`) starts with a **base score of 0** and evaluates 5 rule-based metrics (+20 points per triggered condition, Max = 100):

$$\text{Total Risk Score} = \sum \text{Triggered Indicators} \times 20$$

1. **High Transaction Frequency (+20):** Total transaction count $\ge 25$.
2. **Multiple Counterparty Addresses (+20):** Interacting unique addresses $\ge 10$.
3. **Large Transfer Volume (+20):** High-value transfer detected ($\ge 10\text{ ETH}$).
4. **Rapid Sequence Transfers (+20):** Multiple back-to-back transfers in short sub-minute intervals.
5. **Unusual Pattern Structure (+20):** Zero-value or suspicious fan-out distribution structures.

### Risk Level Categorization:
- **0 – 30:** `LOW RISK` (Green)
- **31 – 60:** `MEDIUM RISK` (Yellow)
- **61 – 100:** `HIGH RISK` (Red)

---

## 🎓 Important Viva Questions & Answers

### Q1: What is the main objective of BlockTrace?
**Answer:** BlockTrace is a decentralized risk intelligence prototype designed to analyze cryptocurrency wallet activity using deterministic rule-based algorithms and store permanent investigation audit snapshots on the Ethereum blockchain.

### Q2: Which smart contract functions are implemented?
**Answer:**
- `registerInvestigation(walletAddress, riskScore, riskLevel, primaryReason)`: Writes investigation metadata on-chain.
- `getInvestigation(investigationId)`: Fetches record by ID.
- `getTotalInvestigations()`: Returns total registered count.
- `getAllInvestigations()`: Returns array of all registered records.

### Q3: Why use rule-based analysis instead of machine learning?
**Answer:** Rule-based scoring provides 100% deterministic, transparent, and explainable results that can easily be audited and defended during viva presentation without black-box model complexities.

### Q4: How does MetaMask interact with the smart contract?
**Answer:** Ethers.js connects to `window.ethereum` to prompt the user's wallet signer. When `registerInvestigation` is invoked, MetaMask creates an Ethereum transaction, prompts for gas approval, and submits it to the local Hardhat testnet node.

---

## 🛡️ Project Limitations & Future Scope

### Current Limitations:
- Designed for local testnet (Hardhat) and demo datasets for presentation simplicity.
- Does not automatically link real-world identity data (KYC) to wallet addresses.

### Future Scope:
- Integration with live Etherscan / Infura RPC endpoints for real-time mainnet wallet scanning.
- Multi-chain support for Polygon, Arbitrum, and Solana.
- Machine learning-assisted clustering for advanced graph pattern detection.

---

## 📝 License
This project is created for educational purposes as part of the college Blockchain Technology curriculum.
