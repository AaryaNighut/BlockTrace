import React, { useState } from 'react';
import { 
  History as HistoryIcon, 
  Search, 
  RefreshCw, 
  ExternalLink,
  ShieldAlert,
  Filter,
  CheckCircle2,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import Modal from '../components/Modal';
import { formatAddress, formatTimestamp } from '../utils/web3';

export default function History({ 
  investigations = [], 
  onRefresh, 
  onAddSample, 
  onSelectWalletToAnalyze 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [selectedInv, setSelectedInv] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filteredInvestigations = investigations.filter((inv, index) => {
    const searchLower = searchTerm.toLowerCase();
    const formattedId = `INV-${String(inv.id || index + 1).padStart(3, '0')}`.toLowerCase();
    
    const matchesSearch = 
      (inv.walletAddress || '').toLowerCase().includes(searchLower) ||
      (inv.primaryReason || '').toLowerCase().includes(searchLower) ||
      (inv.investigator || '').toLowerCase().includes(searchLower) ||
      (inv.txHash || '').toLowerCase().includes(searchLower) ||
      formattedId.includes(searchLower);
    
    if (riskFilter === 'ALL') return matchesSearch;
    return matchesSearch && (inv.riskLevel || '').toUpperCase().includes(riskFilter);
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header & Controls */}
      <div className="cyber-card p-6 md:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-cyan-400" />
            On-Chain Investigation History
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Immutable investigation audit records registered on-chain in <code className="text-cyan-300 font-mono">InvestigationRegistry.sol</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {onAddSample && (
            <button
              onClick={onAddSample}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Sample Record</span>
            </button>
          )}

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync On-Chain Records</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by wallet, ID, or reason..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/50 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none transition"
          />
        </div>

        {/* Risk Level Filter Pill */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-xs font-semibold">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((filter) => (
            <button
              key={filter}
              onClick={() => setRiskFilter(filter)}
              className={`px-3 py-1.5 rounded-lg transition ${
                riskFilter === filter
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Investigations Table */}
      <div className="cyber-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">ID</th>
                <th className="px-6 py-3.5">Target Wallet Address</th>
                <th className="px-6 py-3.5">Risk Score</th>
                <th className="px-6 py-3.5">Risk Level</th>
                <th className="px-6 py-3.5">Primary Reason</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredInvestigations.length > 0 ? (
                filteredInvestigations.map((inv, index) => {
                  const displayId = typeof inv.id === 'number' && inv.id < 1000 
                    ? `INV-${String(inv.id).padStart(3, '0')}` 
                    : `INV-${String(index + 1).padStart(3, '0')}`;

                  return (
                    <tr key={index} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4 font-mono font-bold text-cyan-400">
                        {displayId}
                      </td>
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
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Confirmed
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedInv({ ...inv, displayId })}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-medium transition"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-500 font-medium">
                    No investigation records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={Boolean(selectedInv)}
        onClose={() => setSelectedInv(null)}
        title="On-Chain Investigation Snapshot"
      >
        {selectedInv && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Record ID:</span>
              <span className="font-mono font-bold text-cyan-400 text-sm">{selectedInv.displayId}</span>
            </div>

            <div className="space-y-2 font-mono">
              <div className="py-1.5 border-b border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-sans">Target Wallet Address</span>
                <span className="text-slate-100 font-semibold text-xs break-all">{selectedInv.walletAddress}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400 font-sans">Risk Score:</span>
                <span className="text-slate-100 font-bold">{selectedInv.riskScore} / 100</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400 font-sans">Classification:</span>
                <RiskBadge riskLevel={selectedInv.riskLevel} />
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400 font-sans">Timestamp:</span>
                <span className="text-slate-300">{formatTimestamp(selectedInv.timestamp)}</span>
              </div>
              <div className="py-1.5 border-b border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-sans">Investigator Address</span>
                <span className="text-slate-300 text-xs break-all">{selectedInv.investigator || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}</span>
              </div>
              {selectedInv.txHash && (
                <div className="py-1.5 border-b border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans">On-Chain Tx Hash</span>
                  <span className="text-cyan-400 text-xs break-all font-semibold">{selectedInv.txHash}</span>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">Primary Triggered Indicators:</span>
              <p className="text-slate-300 leading-relaxed font-sans">{selectedInv.primaryReason}</p>
            </div>

            {onSelectWalletToAnalyze && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    const addr = selectedInv.walletAddress;
                    setSelectedInv(null);
                    onSelectWalletToAnalyze(addr);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <span>Re-Analyze This Wallet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
