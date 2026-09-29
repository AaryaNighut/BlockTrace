/**
 * Pre-configured Demo Wallets & Transactions for College Demonstration
 * Allows complete application functionality offline without needing Etherscan API keys.
 */

export const DEMO_WALLETS = {
  HIGH_RISK: {
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    label: "High Risk Demo Wallet",
    description: "Demonstrates high tx frequency, large transfers, multiple recipients & rapid sequence",
    totalTx: 48,
    totalReceived: "142.50 ETH",
    totalSent: "139.80 ETH",
    uniqueAddresses: 18,
    largeTxCount: 4,
    isRapidSequence: true,
    hasUnusualPattern: true,
    firstSeen: "2026-08-10",
    lastSeen: "2026-09-29",
    recentActivity: [
      { hash: "0x9a8f...3e21", type: "OUT", amount: "25.0 ETH", counterparty: "0x388C...c400", time: "10 mins ago", status: "Confirmed" },
      { hash: "0x4b1d...8c99", type: "OUT", amount: "18.5 ETH", counterparty: "0x9910...ab12", time: "25 mins ago", status: "Confirmed" },
      { hash: "0x7c3e...1a44", type: "IN",  amount: "45.0 ETH", counterparty: "0x1f98...918b", time: "1 hour ago",  status: "Confirmed" },
      { hash: "0x2e0a...7f55", type: "OUT", amount: "12.0 ETH", counterparty: "0x55bb...9011", time: "2 hours ago", status: "Confirmed" },
      { hash: "0x8d99...6b22", type: "OUT", amount: "14.2 ETH", counterparty: "0x77aa...3344", time: "3 hours ago", status: "Confirmed" },
    ]
  },

  MEDIUM_RISK: {
    address: "0x388c81500594100674661924840de2651475c400",
    label: "Medium Risk Demo Wallet",
    description: "Moderate activity with occasional high-value transfers and varied counterparties",
    totalTx: 14,
    totalReceived: "28.40 ETH",
    totalSent: "22.10 ETH",
    uniqueAddresses: 11,
    largeTxCount: 1,
    isRapidSequence: false,
    hasUnusualPattern: false,
    firstSeen: "2026-07-01",
    lastSeen: "2026-09-28",
    recentActivity: [
      { hash: "0x5c8e...2f11", type: "IN",  amount: "12.5 ETH", counterparty: "0x742d...f44e", time: "5 hours ago", status: "Confirmed" },
      { hash: "0x1a2b...3c4d", type: "OUT", amount: "4.2 ETH",  counterparty: "0xfe33...0011", time: "1 day ago",   status: "Confirmed" },
      { hash: "0x9d8c...7b6a", type: "OUT", amount: "1.5 ETH",  counterparty: "0x1122...3344", time: "3 days ago",  status: "Confirmed" },
      { hash: "0x3f4e...5d6c", type: "IN",  amount: "3.0 ETH",  counterparty: "0xaa99...8877", time: "5 days ago",  status: "Confirmed" },
    ]
  },

  LOW_RISK: {
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    label: "Low Risk Demo Wallet",
    description: "Standard personal wallet with minimal transactions and consistent counterparties",
    totalTx: 6,
    totalReceived: "4.50 ETH",
    totalSent: "2.10 ETH",
    uniqueAddresses: 3,
    largeTxCount: 0,
    isRapidSequence: false,
    hasUnusualPattern: false,
    firstSeen: "2026-05-15",
    lastSeen: "2026-09-20",
    recentActivity: [
      { hash: "0x3a4b...5c6d", type: "OUT", amount: "0.5 ETH", counterparty: "0x8899...1122", time: "9 days ago",  status: "Confirmed" },
      { hash: "0x7e8f...9a0b", type: "IN",  amount: "2.0 ETH", counterparty: "0x4455...6677", time: "14 days ago", status: "Confirmed" },
      { hash: "0x1c2d...3e4f", type: "OUT", amount: "1.6 ETH", counterparty: "0x8899...1122", time: "20 days ago", status: "Confirmed" },
    ]
  }
};

export const DEMO_TRANSACTIONS = {
  "0x9a8f3e21b0a9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3": {
    hash: "0x9a8f3e21b0a9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3",
    sender: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    receiver: "0x388C81500594100674661924840dE2651475c400",
    amount: "25.00 ETH",
    gasUsed: "145000",
    gasPrice: "22 Gwei",
    blockNumber: 19482710,
    timestamp: "2026-09-29 18:30:15 UTC",
    status: "Success (Confirmed)",
    nonce: 104,
    risk: {
      score: 75,
      level: "HIGH RISK",
      explanation: "Transaction involves an extraordinarily large ETH amount (25 ETH) sent to a secondary wallet in rapid sequence with high gas limits."
    }
  },

  "0x5c8e2f11a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3": {
    hash: "0x5c8e2f11a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3",
    sender: "0x388C81500594100674661924840dE2651475c400",
    receiver: "0xfe3381500594100674661924840dE2651475c400",
    amount: "4.20 ETH",
    gasUsed: "45000",
    gasPrice: "18 Gwei",
    blockNumber: 19481200,
    timestamp: "2026-09-28 14:15:00 UTC",
    status: "Success (Confirmed)",
    nonce: 14,
    risk: {
      score: 40,
      level: "MEDIUM RISK",
      explanation: "Moderate value ETH transfer to an infrequent counterparty."
    }
  },

  "0x3a4b5c6d0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d": {
    hash: "0x3a4b5c6d0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d",
    sender: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    receiver: "0x889981500594100674661924840dE2651475c400",
    amount: "0.50 ETH",
    gasUsed: "21000",
    gasPrice: "15 Gwei",
    blockNumber: 19475000,
    timestamp: "2026-09-20 10:00:00 UTC",
    status: "Success (Confirmed)",
    nonce: 5,
    risk: {
      score: 15,
      level: "LOW RISK",
      explanation: "Standard peer-to-peer ETH transfer with low gas consumption and normal counterparty history."
    }
  }
};

export const INITIAL_INVESTIGATIONS = [
  {
    id: 1,
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    riskScore: 78,
    riskLevel: "HIGH RISK",
    primaryReason: "High transaction frequency & large transfers (>10 ETH)",
    timestamp: Date.now() - 86400000 * 2, // 2 days ago
    investigator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    txHash: "0xabc123def4567890abc123def4567890abc123def4567890abc123def4567890",
    status: "Confirmed On-Chain"
  },
  {
    id: 2,
    walletAddress: "0x388C81500594100674661924840dE2651475c400",
    riskScore: 40,
    riskLevel: "MEDIUM RISK",
    primaryReason: "Moderate interaction with multiple unverified addresses",
    timestamp: Date.now() - 86400000 * 5, // 5 days ago
    investigator: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    txHash: "0xdef4567890abc123def4567890abc123def4567890abc123def4567890abc123",
    status: "Confirmed On-Chain"
  },
  {
    id: 3,
    walletAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    riskScore: 15,
    riskLevel: "LOW RISK",
    primaryReason: "Standard low-volume transfers",
    timestamp: Date.now() - 86400000 * 8, // 8 days ago
    investigator: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    txHash: "0x7890abc123def4567890abc123def4567890abc123def4567890abc123def456",
    status: "Confirmed On-Chain"
  }
];
