import React from 'react';
import { Wallet, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatAddress } from '../utils/web3';

export default function Navbar({ 
  activeTab, 
  walletAccount, 
  onConnectWallet, 
  isConnecting, 
  networkError 
}) {
  const pageTitles = {
    'dashboard': { title: 'Dashboard Overview', subtitle: 'Live Blockchain Investigation Activity & Risk Feed' },
    'analyze-wallet': { title: 'Analyze Wallet', subtitle: 'Deterministic Behavioral Risk Assessment for Cryptocurrency Addresses' },
    'analyze-tx': { title: 'Analyze Transaction', subtitle: 'Inspect Gas Usage, Transfer Volumes & Single-Tx Indicators' },
    'history': { title: 'Investigation History', subtitle: 'Immutable On-Chain Records Stored in InvestigationRegistry' },
    'about': { title: 'About BlockTrace', subtitle: 'Project Methodology, Viva Defense & System Architecture' },
  };

  const current = pageTitles[activeTab] || pageTitles['dashboard'];

  return (
    <header className="h-20 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">{current.title}</h2>
        <p className="text-xs text-slate-400 font-medium">{current.subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Network Error Warning */}
        {networkError && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{networkError}</span>
          </div>
        )}

        {/* MetaMask Wallet Button */}
        {walletAccount ? (
          <div className="flex items-center gap-3 bg-slate-950/80 border border-cyan-500/30 rounded-xl px-4 py-2 text-xs font-mono text-cyan-300 shadow-lg shadow-cyan-950/30">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-sans font-medium uppercase tracking-wider">Connected Wallet</span>
              <span className="font-semibold text-slate-100">{formatAddress(walletAccount)}</span>
            </div>
          </div>
        ) : (
          <button
            onClick={onConnectWallet}
            disabled={isConnecting}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95 disabled:opacity-50"
          >
            <Wallet className="w-4 h-4 text-slate-950" />
            <span>{isConnecting ? 'Connecting...' : 'Connect MetaMask'}</span>
          </button>
        )}
      </div>
    </header>
  );
}
