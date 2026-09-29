import React, { useState } from 'react';
import { 
  History as HistoryIcon, 
  Search, 
  RefreshCw, 
  ExternalLink,
  ShieldAlert,
  Filter,
  CheckCircle2
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import Modal from '../components/Modal';
import { formatAddress, formatTimestamp } from '../utils/web3';

export default function History({ investigations = [], onRefresh }) {
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

  const filteredInvestigations = investigations.filter((inv) => {
    const matchesSearch = (inv.walletAddress || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          String(inv.id).includes(searchTerm);
    
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
            Immutable investigation audit records retrieved directly from the <code className="text-cyan-300 font-mono">InvestigationRegistry.sol</code> smart contract.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition shrink-0 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Sync On-Chain Records</span>
        </button>
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
            placeholder="Filter by wallet or ID..."
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
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredInvestigations.length > 0 ? (
                filteredInvestigations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-mono font-bold text-cyan-400">
                      INV-{String(inv.id).padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-200">
                      {inv.walletAddress}
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
                        <CheckCircle2 className="w-3 h-3" />
                        Confirmed
                      </span>
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
                ))
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
              <span className="font-mono font-bold text-cyan-400 text-sm">INV-{String(selectedInv.id).padStart(3, '0')}</span>
            </div>

            <div className="space-y-2 font-mono">
              <div className="py-1.5 border-b border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Target Wallet Address</span>
                <span className="text-slate-100 font-semibold text-xs break-all">{selectedInv.walletAddress}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Risk Score:</span>
                <span className="text-slate-100 font-bold">{selectedInv.riskScore} / 100</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Classification:</span>
                <RiskBadge riskLevel={selectedInv.riskLevel} />
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-300">{formatTimestamp(selectedInv.timestamp)}</span>
              </div>
              <div className="py-1.5 border-b border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Investigator Address</span>
                <span className="text-slate-300 text-xs break-all">{selectedInv.investigator || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">Primary Triggered Indicators:</span>
              <p className="text-slate-300 leading-relaxed">{selectedInv.primaryReason}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
