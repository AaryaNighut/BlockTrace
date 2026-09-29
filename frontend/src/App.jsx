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
            />
          )}

          {activeTab === 'about' && <About />}
        </main>
      </div>
    </div>
  );
}
