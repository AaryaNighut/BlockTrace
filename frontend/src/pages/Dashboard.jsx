import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  ExternalLink,
  Zap,
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import StatCard from '../components/StatCard';
import RiskBadge from '../components/RiskBadge';
import Modal from '../components/Modal';
import { formatAddress, formatTimestamp } from '../utils/web3';
import { DEMO_WALLETS } from '../utils/demoData';

export default function Dashboard({ 
  investigations = [], 
  onSelectWalletToAnalyze,
  setActiveTab 
}) {
  const [selectedInv, setSelectedInv] = useState(null);

  // Compute stat totals
  const total = investigations.length;
  const highCount = investigations.filter(i => (i.riskLevel || '').includes('HIGH')).length;
  const medCount = investigations.filter(i => (i.riskLevel || '').includes('MEDIUM') || (i.riskLevel || '').includes('MED')).length;
  const lowCount = investigations.filter(i => (i.riskLevel || '').includes('LOW')).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="cyber-card p-6 md:p-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            Blockchain Transaction Intelligence & On-Chain Audit
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight leading-snug">
            Decentralized Cryptocurrency <br className="hidden md:inline" />
            <span className="cyber-gradient-text">Risk Analysis & Registry</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            BlockTrace monitors cryptocurrency addresses and transaction structures using deterministic rule-based algorithms. Register investigation audit records directly to the Ethereum blockchain.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => setActiveTab('analyze-wallet')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Analyze Wallet Address</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-xs transition"
            >
              <span>View On-Chain Registry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Total Investigations" 
          value={total} 
          subtitle="Registered Records"
          icon={Activity}
          color="cyan"
        />
        <StatCard 
          title="High Risk Flagged" 
          value={highCount} 
          subtitle="Score 61 - 100"
          icon={ShieldAlert}
          color="rose"
        />
        <StatCard 
          title="Medium Risk Flagged" 
          value={medCount} 
          subtitle="Score 31 - 60"
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard 
          title="Low Risk Flagged" 
          value={lowCount} 
          subtitle="Score 0 - 30"
          icon={ShieldCheck}
          color="emerald"
        />
      </div>

      {/* Demo Wallets Quick Launcher */}
      <div className="cyber-card p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Quick Demo Wallet Launcher
            </h3>
            <p className="text-xs text-slate-400">Click any sample wallet below to test the risk engine instantly (Educational Demo Mode)</p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
            Offline Compatible
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(DEMO_WALLETS).map(([key, item]) => (
            <div
              key={key}
              onClick={() => onSelectWalletToAnalyze(item.address)}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900/60 cursor-pointer transition group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition">
                  {item.label}
                </span>
                <RiskBadge 
                  riskLevel={key === 'HIGH_RISK' ? 'HIGH RISK' : key === 'MEDIUM_RISK' ? 'MEDIUM RISK' : 'LOW RISK'} 
                />
              </div>
              <p className="font-mono text-[11px] text-slate-400 truncate mb-2">{item.address}</p>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-cyan-400 font-semibold group-hover:translate-x-0.5 transition">
                <span>Test Analysis Engine</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts & Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simple Activity Chart */}
        <div className="lg:col-span-2 cyber-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Risk Classification Breakdown
              </h3>
              <p className="text-xs text-slate-400">Distribution of registered wallet risk scores</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-rose-400"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High</span>
              <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium</span>
              <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low</span>
            </div>
          </div>

          {/* Simple Visual Bar Graph */}
          <div className="space-y-5 py-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-rose-400">High Risk Threshold (61 - 100)</span>
                <span className="text-slate-300 font-mono">{highCount} Wallets ({total ? Math.round((highCount/total)*100) : 0}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-rose-600 to-red-500 transition-all duration-700" 
                  style={{ width: `${total ? (highCount/total)*100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-amber-400">Medium Risk Threshold (31 - 60)</span>
                <span className="text-slate-300 font-mono">{medCount} Wallets ({total ? Math.round((medCount/total)*100) : 0}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-600 to-yellow-500 transition-all duration-700" 
                  style={{ width: `${total ? (medCount/total)*100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-emerald-400">Low Risk Threshold (0 - 30)</span>
                <span className="text-slate-300 font-mono">{lowCount} Wallets ({total ? Math.round((lowCount/total)*100) : 0}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-700" 
                  style={{ width: `${total ? (lowCount/total)*100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Viva Quick Defense Box */}
        <div className="cyber-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-2">Viva Presentation Tip</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When explaining BlockTrace to your examiner, highlight that the platform uses a <strong>5-rule deterministic scoring formula</strong> (+20 points per trigger) and logs formal investigation hashes on the Ethereum testnet via Solidity.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-1 font-mono">
            <div>✓ Non-custodial MetaMask integration</div>
            <div>✓ Immutable on-chain registry</div>
            <div>✓ Offline Demo Mode ready</div>
          </div>
        </div>
      </div>

      {/* Recent Investigations Feed */}
      <div className="cyber-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">Recent Investigations</h3>
            <p className="text-xs text-slate-400">Latest investigation records stored on-chain or loaded from memory</p>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Target Wallet</th>
                <th className="px-6 py-3.5">Risk Score</th>
                <th className="px-6 py-3.5">Risk Classification</th>
                <th className="px-6 py-3.5">Primary Reason</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {investigations.slice(0, 5).map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono font-medium text-slate-200">
                    {formatAddress(inv.walletAddress)}
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-100">
                    {inv.riskScore} <span className="text-[10px] text-slate-500">/100</span>
                  </td>
                  <td className="px-6 py-4">
                    <RiskBadge riskLevel={inv.riskLevel} />
                  </td>
                  <td className="px-6 py-4 text-slate-400 max-w-xs truncate">
                    {inv.primaryReason || 'Standard pattern evaluation'}
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-mono">
                    {formatTimestamp(inv.timestamp)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedInv(inv)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-medium transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Investigation Details Modal */}
      <Modal
        isOpen={Boolean(selectedInv)}
        onClose={() => setSelectedInv(null)}
        title="Investigation Record Details"
      >
        {selectedInv && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Investigation ID:</span>
              <span className="font-mono font-bold text-cyan-400">INV-{String(selectedInv.id).padStart(3, '0')}</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Wallet Address:</span>
                <span className="font-mono text-slate-200 font-semibold">{selectedInv.walletAddress}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Risk Score:</span>
                <span className="font-mono text-slate-200 font-semibold">{selectedInv.riskScore} / 100</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Risk Level:</span>
                <RiskBadge riskLevel={selectedInv.riskLevel} />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Timestamp:</span>
                <span className="font-mono text-slate-200">{formatTimestamp(selectedInv.timestamp)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Investigator:</span>
                <span className="font-mono text-slate-200">{formatAddress(selectedInv.investigator)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-semibold">{selectedInv.status || 'Confirmed On-Chain'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold">Primary Risk Indicators:</span>
              <p className="text-slate-300 leading-relaxed">{selectedInv.primaryReason}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
