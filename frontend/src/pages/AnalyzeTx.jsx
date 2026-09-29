import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRightLeft, 
  Zap, 
  ExternalLink,
  ShieldAlert,
  Clock,
  Box
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import { DEMO_TRANSACTIONS } from '../utils/demoData';
import { calculateTxRiskScore } from '../utils/riskEngine';
import { formatAddress } from '../utils/web3';

export default function AnalyzeTx() {
  const [txHashInput, setTxHashInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [txResult, setTxResult] = useState(null);

  const handleAnalyzeTx = (hashToUse) => {
    const hash = (hashToUse || txHashInput).trim();
    setErrorMsg('');
    setTxResult(null);

    if (!hash) {
      setErrorMsg('Please enter a transaction hash');
      return;
    }

    if (!/^0x[a-fA-F0-9]{64}$/.test(hash) && hash.length < 10) {
      setErrorMsg('Invalid Transaction Hash format (Must be a 66-character 0x-prefixed hex string)');
      return;
    }

    setIsSearching(true);

    setTimeout(() => {
      // Find matching demo transaction or construct fallback demo
      let foundTx = DEMO_TRANSACTIONS[hash] || DEMO_TRANSACTIONS[Object.keys(DEMO_TRANSACTIONS)[0]];
      
      const evaluatedRisk = calculateTxRiskScore({
        amount: foundTx.amount.replace(' ETH', ''),
        gasUsed: foundTx.gasUsed,
        isNewRecipient: true
      });

      setTxResult({
        ...foundTx,
        hash: hash.length > 20 ? hash : foundTx.hash,
        risk: {
          score: evaluatedRisk.score,
          level: evaluatedRisk.riskLevel,
          explanation: foundTx.risk?.explanation || evaluatedRisk.reasons.join('; ')
        }
      });

      setIsSearching(false);
    }, 500);
  };

  const handleQuickTxSelect = (hash) => {
    setTxHashInput(hash);
    handleAnalyzeTx(hash);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Search Form Header */}
      <div className="cyber-card p-6 md:p-8 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          Analyze Single Blockchain Transaction
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          Inspect individual transaction hashes to analyze transfer values, gas consumption parameters, sender/receiver counterparty relationships, and potential anomaly flags.
        </p>

        {/* Demo Transaction Selector */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-3">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Quick Select Demo Transaction Hashes:
          </span>

          <div className="space-y-2">
            {Object.entries(DEMO_TRANSACTIONS).map(([hash, tx], i) => (
              <button
                key={i}
                onClick={() => handleQuickTxSelect(hash)}
                className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-left flex items-center justify-between text-xs transition group"
              >
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-cyan-400 font-bold">{formatAddress(hash)}</span>
                  <span className="text-slate-400 hidden sm:inline">Amount: {tx.amount}</span>
                </div>
                <RiskBadge riskLevel={tx.risk.level} score={tx.risk.score} />
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleAnalyzeTx(); }} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <input
                type="text"
                value={txHashInput}
                onChange={(e) => setTxHashInput(e.target.value)}
                placeholder="Enter Transaction Hash (0x...)"
                className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-500 rounded-xl px-4 py-3.5 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/20 transition transform active:scale-95 shrink-0 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{isSearching ? 'Inspecting...' : 'Analyze Transaction'}</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>
      </div>

      {/* Result Display */}
      {txResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* Risk Level Highlight Card */}
          <div className="cyber-card p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Single Transaction Risk Profile</span>
              <h3 className="text-xl font-bold text-slate-100 mt-1 flex items-center gap-3">
                <span>Evaluated Risk Level:</span>
                <RiskBadge riskLevel={txResult.risk.level} score={txResult.risk.score} />
              </h3>
              <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
                {txResult.risk.explanation}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0 min-w-[140px]">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Risk Score</span>
              <span className="text-3xl font-extrabold text-slate-100 font-mono mt-0.5 block">{txResult.risk.score}</span>
              <span className="text-[10px] text-slate-400 font-mono">out of 100</span>
            </div>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="cyber-card p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-slate-100 pb-3 border-b border-slate-800 flex items-center gap-2">
              <Box className="w-4 h-4 text-cyan-400" />
              On-Chain Transaction Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <span className="text-slate-500 text-[11px] font-sans font-medium block">Transaction Hash</span>
                <span className="text-cyan-400 font-semibold break-all">{txResult.hash}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <span className="text-slate-500 text-[11px] font-sans font-medium block">Transfer Amount</span>
                <span className="text-emerald-400 font-bold text-base">{txResult.amount}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <span className="text-slate-500 text-[11px] font-sans font-medium block">Sender (From)</span>
                <span className="text-slate-200 font-semibold">{txResult.sender}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <span className="text-slate-500 text-[11px] font-sans font-medium block">Receiver (To)</span>
                <span className="text-slate-200 font-semibold">{txResult.receiver}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <span className="text-slate-500 text-[11px] font-sans font-medium block">Gas Consumed</span>
                <span className="text-slate-300">{txResult.gasUsed} units ({txResult.gasPrice || '20 Gwei'})</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <span className="text-slate-500 text-[11px] font-sans font-medium block">Block Number & Nonce</span>
                <span className="text-slate-300">Block #{txResult.blockNumber} (Nonce: {txResult.nonce || 42})</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Timestamp: {txResult.timestamp}
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {txResult.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
