import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AnalyzeWallet from './pages/AnalyzeWallet';
import AnalyzeTx from './pages/AnalyzeTx';
import History from './pages/History';
import About from './pages/About';
import { 
  connectWallet, 
  isMetaMaskInstalled, 
  fetchOnChainInvestigations, 
  switchToHardhatNetwork 
} from './utils/web3';
import { INITIAL_INVESTIGATIONS } from './utils/demoData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [targetWalletForAnalysis, setTargetWalletForAnalysis] = useState('');
  
  // Wallet connection state
  const [walletAccount, setWalletAccount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkError, setNetworkError] = useState('');

  // Investigation records (initialized with demo records, synced with smart contract)
  const [investigations, setInvestigations] = useState(INITIAL_INVESTIGATIONS);

  // Sync on-chain records from local smart contract on mount
  useEffect(() => {
    loadOnChainRecords();
    checkIfWalletAlreadyConnected();

    // Listen for MetaMask account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWalletAccount(accounts[0]);
        } else {
          setWalletAccount('');
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  const loadOnChainRecords = async () => {
    const onChainRecords = await fetchOnChainInvestigations();
    if (onChainRecords && onChainRecords.length > 0) {
      // Merge on-chain records with demo records without duplicating IDs
      const combined = [...onChainRecords];
      INITIAL_INVESTIGATIONS.forEach((demoItem) => {
        if (!combined.some((item) => item.walletAddress.toLowerCase() === demoItem.walletAddress.toLowerCase())) {
          combined.push(demoItem);
        }
      });
      setInvestigations(combined);
    }
  };

  const checkIfWalletAlreadyConnected = async () => {
    if (isMetaMaskInstalled()) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          setWalletAccount(accounts[0]);
        }
      } catch (err) {
        console.warn('Could not check existing wallet connection:', err);
      }
    }
  };

  const handleConnectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      alert('MetaMask is not installed. Please install the MetaMask browser extension to register investigations on Ethereum.');
      return;
    }

    setIsConnecting(true);
    setNetworkError('');

    try {
      const { account } = await connectWallet();
      setWalletAccount(account);
      await switchToHardhatNetwork();
      await loadOnChainRecords();
    } catch (err) {
      console.error('Wallet connection error:', err);
      setNetworkError(err.message || 'Failed to connect MetaMask');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSelectWalletToAnalyze = (address) => {
    setTargetWalletForAnalysis(address);
    setActiveTab('analyze-wallet');
  };

  const handleRegisterSuccess = (newRecord) => {
    setInvestigations((prev) => [newRecord, ...prev]);
  };

  const handleAddSampleInvestigation = () => {
    const sampleAddrs = [
      '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      '0x28C6c06298d514Db089934071355E5743bf21d60',
      '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
    ];
    const randomAddr = sampleAddrs[Math.floor(Math.random() * sampleAddrs.length)];
    const randomScore = Math.floor(25 + Math.random() * 60);
    const riskLevel = randomScore >= 61 ? 'HIGH RISK' : randomScore >= 31 ? 'MEDIUM RISK' : 'LOW RISK';

    const newRecord = {
      id: investigations.length + 1,
      walletAddress: randomAddr,
      riskScore: randomScore,
      riskLevel: riskLevel,
      primaryReason: 'Interactive sample audit record added during presentation',
      timestamp: Date.now(),
      investigator: walletAccount || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (Signer)',
      txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      status: 'Confirmed On-Chain'
    };

    setInvestigations((prev) => [newRecord, ...prev]);
  };

  return (
    <div className="flex min-h-screen bg-[#090d16] text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          activeTab={activeTab}
          walletAccount={walletAccount}
          onConnectWallet={handleConnectWallet}
          isConnecting={isConnecting}
          networkError={networkError}
        />

        <main className="p-6 md:p-8 flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              investigations={investigations}
              onSelectWalletToAnalyze={handleSelectWalletToAnalyze}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'analyze-wallet' && (
            <AnalyzeWallet
              initialWalletAddress={targetWalletForAnalysis}
              onRegisterSuccess={handleRegisterSuccess}
            />
          )}

          {activeTab === 'analyze-tx' && <AnalyzeTx />}

          {activeTab === 'history' && (
            <History
              investigations={investigations}
              onRefresh={loadOnChainRecords}
              onAddSample={handleAddSampleInvestigation}
              onSelectWalletToAnalyze={handleSelectWalletToAnalyze}
            />
          )}

          {activeTab === 'about' && <About />}
        </main>
      </div>
    </div>
  );
}
