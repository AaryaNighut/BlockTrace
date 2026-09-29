import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Wallet,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  FileCheck2,
  Clock,
  Send,
  Loader2,
  Globe,
  Database
} from 'lucide-react';
import { ethers } from 'ethers';
import RiskGauge from '../components/RiskGauge';
import RiskBadge from '../components/RiskBadge';
import Modal from '../components/Modal';
import { calculateRiskScore } from '../utils/riskEngine';
import { DEMO_WALLETS } from '../utils/demoData';
import { fetchRealWalletData } from '../utils/etherscan';
import { registerInvestigationOnChain, formatAddress, formatTimestamp } from '../utils/web3';

export default function AnalyzeWallet({ initialWalletAddress = '', onRegisterSuccess }) {
  // Mode selection: 'demo' or 'live'
  const [analysisMode, setAnalysisMode] = useState('demo');

  const [addressInput, setAddressInput] = useState(initialWalletAddress);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Blockchain registration modal states
  const [isRegistering, setIsRegistering] = useState(false);
  const [regSuccess, setRegSuccess] = useState(null);
  const [regError, setRegError] = useState('');

  useEffect(() => {
    if (initialWalletAddress) {
      setAddressInput(initialWalletAddress);
      handleAnalyze(initialWalletAddress, analysisMode);
    }
  }, [initialWalletAddress]);

  const handleAnalyze = async (targetAddress, modeToUse = analysisMode) => {
    const addr = (targetAddress || addressInput).trim();
    setErrorMsg('');
    setAnalysisResult(null);
    setRegSuccess(null);
    setRegError('');

    if (!addr) {
      setErrorMsg('Invalid Ethereum wallet address.');
      return;
    }

    if (!ethers.isAddress(addr)) {
      setErrorMsg('Invalid Ethereum wallet address.');
      return;
    }

    setIsAnalyzing(true);

    try {
      if (modeToUse === 'live') {
        // Fetch Real Ethereum Mainnet Data
        const realData = await fetchRealWalletData(addr);
        const riskAssessment = calculateRiskScore(realData);

        setAnalysisResult({
          ...realData,
          mode: 'live',
          networkName: 'Ethereum Mainnet',
          dataSourceName: 'Live Blockchain Data (Etherscan API)',
          risk: riskAssessment
        });
      } else {
        // Demo Mode (Offline Compatible)
        await new Promise((res) => setTimeout(res, 500));

        let walletData = Object.values(DEMO_WALLETS).find(
          (w) => w.address.toLowerCase() === addr.toLowerCase()
        );

        if (!walletData) {
          walletData = {
            address: addr,
            label: 'Custom Demo Wallet',
            description: 'Offline pattern risk evaluation',
            totalTx: 18,
            totalReceived: '32.10 ETH',
            totalSent: '28.50 ETH',
            uniqueAddresses: 12,
            largestTx: '12.5 ETH',
            largeTxCount: 2,
            isRapidSequence: true,
            hasUnusualPattern: false,
            firstSeen: '2026-06-12',
            lastSeen: '2026-09-29',
            recentActivity: [
              { hash: '0xa1b2...c3d4', type: 'OUT', amount: '12.5 ETH', counterparty: '0x9910...ab12', time: '2 hours ago', status: 'Confirmed' },
              { hash: '0xe5f6...g7h8', type: 'IN',  amount: '15.0 ETH', counterparty: '0x1f98...918b', time: '6 hours ago', status: 'Confirmed' },
            ]
          };
        }

        const riskAssessment = calculateRiskScore(walletData);

        setAnalysisResult({
          ...walletData,
          mode: 'demo',
          networkName: 'Educational Demo Network',
          dataSourceName: 'Sample Dataset',
          risk: riskAssessment
        });
      }
    } catch (err) {
      console.error('Wallet Analysis Error:', err);
      setErrorMsg(err.message || 'Unable to fetch blockchain data. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuickDemoSelect = (demoKey) => {
    const demo = DEMO_WALLETS[demoKey];
    if (demo) {
      setAddressInput(demo.address);
      setAnalysisMode('demo');
      handleAnalyze(demo.address, 'demo');
    }
  };

  const handleRegisterOnChain = async () => {
    if (!analysisResult) return;

    setIsRegistering(true);
    setRegError('');
    setRegSuccess(null);

    try {
      const primaryReasonStr = analysisResult.risk.reasons.length > 0 
        ? analysisResult.risk.reasons.join('; ')
        : 'Standard pattern evaluation';

      const txReceipt = await registerInvestigationOnChain(
        analysisResult.address,
        analysisResult.risk.score,
        analysisResult.risk.riskLevel,
        primaryReasonStr
      );

      const newRecord = {
        id: Date.now(),
        walletAddress: analysisResult.address,
        riskScore: analysisResult.risk.score,
        riskLevel: analysisResult.risk.riskLevel,
        primaryReason: primaryReasonStr,
        timestamp: Date.now(),
        investigator: 'Connected MetaMask Account',
        txHash: txReceipt.hash,
        blockNumber: txReceipt.blockNumber,
        status: txReceipt.status
      };

      setRegSuccess(txReceipt);
      if (onRegisterSuccess) {
        onRegisterSuccess(newRecord);
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setRegError(err.message || 'Failed to register investigation on Ethereum smart contract');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSimulateRegister = () => {
    if (!analysisResult) return;

    const fakeHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const primaryReasonStr = analysisResult.risk.reasons.length > 0 
      ? analysisResult.risk.reasons.join('; ')
      : 'Standard pattern evaluation';

    const fakeReceipt = {
      hash: fakeHash,
      blockNumber: Math.floor(19480000 + Math.random() * 5000),
      status: 'Confirmed (Demo Mode)'
    };

    const newRecord = {
      id: Date.now(),
      walletAddress: analysisResult.address,
      riskScore: analysisResult.risk.score,
      riskLevel: analysisResult.risk.riskLevel,
      primaryReason: primaryReasonStr,
      timestamp: Date.now(),
      investigator: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (Demo Signer)',
      txHash: fakeHash,
      blockNumber: fakeReceipt.blockNumber,
      status: fakeReceipt.status
    };

    setRegError('');
    setRegSuccess(fakeReceipt);
    if (onRegisterSuccess) {
      onRegisterSuccess(newRecord);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Search Header Form */}
      <div className="cyber-card p-6 md:p-8 rounded-3xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" />
              Analyze Cryptocurrency Wallet
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select analysis mode, enter an Ethereum wallet address, and analyze transaction activity & risk.
            </p>
          </div>

          {/* Mode Switch Toggle */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950 border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setAnalysisMode('demo')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                analysisMode === 'demo'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Demo Mode</span>
            </button>
            <button
              onClick={() => setAnalysisMode('live')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                analysisMode === 'live'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span>Live Ethereum</span>
            </button>
          </div>
        </div>

        {/* Mode Indicator Banner */}
        <div className={`mb-6 p-4 rounded-2xl border text-xs flex items-center justify-between ${
          analysisMode === 'live'
            ? 'bg-blue-950/40 border-blue-500/30 text-blue-200'
            : 'bg-slate-950/70 border-slate-800/80 text-slate-300'
        }`}>
          <div className="flex items-center gap-2">
            {analysisMode === 'live' ? (
              <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <div>
              <span className="font-bold block">
                {analysisMode === 'live' ? 'LIVE ETHEREUM MODE' : 'EDUCATIONAL DEMO MODE'}
              </span>
              <span className="text-[11px] opacity-80">
                {analysisMode === 'live'
                  ? 'Network: Ethereum Mainnet | Data Source: Live Etherscan API'
                  : 'Network: Educational Demo | Data Source: Pre-built Sample Dataset (Requires No API Key)'}
              </span>
            </div>
          </div>

          <span className="hidden sm:inline-block font-mono text-[10px] px-2.5 py-1 rounded bg-slate-900 border border-slate-700">
            {analysisMode === 'live' ? 'Chain ID: 1' : 'Offline Mode'}
          </span>
        </div>

        {/* Demo Quick Select Buttons (Only in Demo Mode) */}
        {analysisMode === 'demo' && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 block font-mono">
              Quick Select Sample Demo Wallets:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleQuickDemoSelect('LOW_RISK')}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between transition"
              >
                <span>1. Low Risk Wallet</span>
                <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono">15/100</span>
              </button>

              <button
                onClick={() => handleQuickDemoSelect('MEDIUM_RISK')}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-amber-950/40 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center justify-between transition"
              >
                <span>2. Medium Risk Wallet</span>
                <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded font-mono">40/100</span>
              </button>

              <button
                onClick={() => handleQuickDemoSelect('HIGH_RISK')}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center justify-between transition"
              >
                <span>3. High Risk Wallet</span>
                <span className="text-[10px] bg-rose-500/20 px-1.5 py-0.5 rounded font-mono">78/100</span>
              </button>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="Enter Wallet Address (e.g. 0x742d35Cc6634C0532925a3b844Bc454e4438f44e)"
                className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-500 rounded-xl px-4 py-3.5 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
              />
            </div>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/20 transition transform active:scale-95 shrink-0 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Fetching Data...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-slate-950" />
                  <span>Analyze Wallet</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>
      </div>

      {/* Loading Spinner Indicator */}
      {isAnalyzing && (
        <div className="cyber-card p-12 rounded-3xl border border-slate-800 text-center space-y-4 animate-fadeIn">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-100">
              {analysisMode === 'live'
                ? 'Fetching Ethereum transaction history...'
                : 'Processing pattern analysis engine...'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Evaluating transaction frequency, unique counterparties, and transfer volume...
            </p>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && !isAnalyzing && (
        <div className="space-y-8 animate-fadeIn">
          {/* Main Risk Summary Card */}
          <div className="cyber-card p-6 md:p-8 rounded-3xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Left: Risk Score Gauge */}
            <div className="flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-6">
              <RiskGauge 
                score={analysisResult.risk.score} 
                riskLevel={analysisResult.risk.riskLevel} 
              />
              <div className="mt-2">
                <RiskBadge 
                  riskLevel={analysisResult.risk.riskLevel} 
                  score={analysisResult.risk.score} 
                />
              </div>
            </div>

            {/* Right: Key Indicators Breakdown */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-100">
                  {analysisResult.mode === 'live' ? 'REAL ETHEREUM WALLET ANALYSIS' : 'DEMO WALLET ANALYSIS'}
                </h3>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                  {analysisResult.networkName}
                </span>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'High Transaction Frequency (>= 25 txs)', active: analysisResult.risk.indicators.highFrequency },
                  { label: 'Multiple Interacting Counterparty Addresses (>= 10)', active: analysisResult.risk.indicators.multipleAddresses },
                  { label: 'Large-Value ETH Transfer Volume (>= 10 ETH)', active: analysisResult.risk.indicators.largeTransfers },
                  { label: 'Rapid Sequence Transfer Behavior', active: analysisResult.risk.indicators.rapidSequence },
                  { label: 'Potentially Unusual Transaction Pattern Structure', active: analysisResult.risk.indicators.unusualPattern },
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      item.active 
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                        : 'bg-slate-950/50 border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.active ? (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span className="font-medium">{item.label}</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold">
                      {item.active ? '+20 Score' : '0 Score'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Explanations Summary */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 block">Risk Indicators Summary:</span>
                {analysisResult.risk.reasons.length > 0 ? (
                  <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
                    {analysisResult.risk.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400">
                    No elevated risk indicators detected. Wallet activity falls within standard baseline parameters.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Wallet Overview & Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="cyber-card p-5 rounded-2xl border border-slate-800">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Total Transactions</span>
              <span className="text-2xl font-bold text-slate-100 font-mono mt-1 block">{analysisResult.totalTx}</span>
            </div>
            <div className="cyber-card p-5 rounded-2xl border border-slate-800">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Total ETH Received</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono mt-1 block">{analysisResult.totalReceived}</span>
            </div>
            <div className="cyber-card p-5 rounded-2xl border border-slate-800">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Total ETH Sent</span>
              <span className="text-2xl font-bold text-rose-400 font-mono mt-1 block">{analysisResult.totalSent}</span>
            </div>
            <div className="cyber-card p-5 rounded-2xl border border-slate-800">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Unique Addresses</span>
              <span className="text-2xl font-bold text-cyan-400 font-mono mt-1 block">{analysisResult.uniqueAddresses}</span>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="cyber-card rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  {analysisResult.mode === 'live' ? 'Real Ethereum Transaction Log' : 'Sample Recent Activity Log'}
                </h3>
                <p className="text-xs text-slate-400">
                  {analysisResult.mode === 'live' ? 'Fetched from Etherscan API' : 'Sample demo activity'}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Tx Hash</th>
                    <th className="px-6 py-3.5">Type</th>
                    <th className="px-6 py-3.5">Amount</th>
                    <th className="px-6 py-3.5">Counterparty</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                  {analysisResult.recentActivity.length > 0 ? (
                    analysisResult.recentActivity.map((tx, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-3.5 text-cyan-400">
                          {analysisResult.mode === 'live' ? (
                            <a
                              href={`https://etherscan.io/tx/${tx.hash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline flex items-center gap-1"
                            >
                              <span>{formatAddress(tx.hash)}</span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          ) : (
                            formatAddress(tx.hash)
                          )}
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.type === 'IN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 font-bold text-slate-200">{tx.amount}</td>
                        <td className="px-6 py-3.5 text-slate-400">{tx.counterparty}</td>
                        <td className="px-6 py-3.5 text-slate-400">{tx.time}</td>
                        <td className="px-6 py-3.5 text-emerald-400">{tx.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-500 font-sans">
                        No transactions recorded for this wallet address.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Card: Register Investigation on Ethereum Smart Contract */}
          <div className="cyber-card p-6 md:p-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-cyan-950/20">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold mb-2">
                <FileCheck2 className="w-3.5 h-3.5" />
                Ethereum Smart Contract Audit
              </div>
              <h3 className="text-xl font-bold text-slate-100">Register Investigation On-Chain</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Store this risk evaluation snapshot permanently on the local Ethereum blockchain via your MetaMask wallet using <code className="text-cyan-300 font-mono">InvestigationRegistry.sol</code>.
              </p>
            </div>

            <button
              onClick={handleRegisterOnChain}
              disabled={isRegistering}
              className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/20 transition transform active:scale-95 shrink-0 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>{isRegistering ? 'Signing via MetaMask...' : 'Register Investigation on Blockchain'}</span>
            </button>
          </div>

          {/* Registration Error Notice */}
          {regError && (
            <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-sm text-rose-400 block">Blockchain Connection Notice</span>
                  <p className="leading-relaxed">{regError}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-rose-500/20 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400">
                  Tip for Viva Presentation: If Hardhat node is not running, click Demo Registration to complete the audit.
                </span>
                <button
                  onClick={handleSimulateRegister}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>Simulate Registration (Demo Mode)</span>
                </button>
              </div>
            </div>
          )}

          {/* Registration Success Modal */}
          <Modal
            isOpen={Boolean(regSuccess)}
            onClose={() => setRegSuccess(null)}
            title="On-Chain Investigation Registered Successfully!"
          >
            {regSuccess && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <div>
                    <span className="font-bold block text-sm">Transaction Confirmed on Ethereum</span>
                    <span className="text-[11px] text-emerald-300/80">Investigation snapshot recorded in Solidity smart contract</span>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Tx Hash:</span>
                    <span className="text-cyan-400 font-semibold">{formatAddress(regSuccess.hash)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Block Number:</span>
                    <span className="text-slate-200">{regSuccess.blockNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-400">{regSuccess.status}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Contract:</span>
                    <span className="text-slate-300">InvestigationRegistry.sol</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setRegSuccess(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}
          </Modal>
        </div>
      )}
    </div>
  );
}
