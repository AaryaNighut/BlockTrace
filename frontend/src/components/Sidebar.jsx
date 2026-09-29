import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Search, 
  FileText, 
  History, 
  Info,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze-wallet', label: 'Analyze Wallet', icon: Search },
    { id: 'analyze-tx', label: 'Analyze Transaction', icon: FileText },
    { id: 'history', label: 'Investigation History', icon: History },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800/80 flex flex-col justify-between shrink-0 min-h-screen sticky top-0 backdrop-blur-xl z-30">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-bold">
            <ShieldAlert className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
              BlockTrace <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">DApp</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Risk Intelligence Platform</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* College Project Footer Badge */}
      <div className="p-4 m-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          College Mini-Project
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Blockchain Technology prototype using rule-based risk evaluation.
        </p>
        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80">
          <span>Solidity + React</span>
          <span className="font-mono text-cyan-400">Hardhat Local</span>
        </div>
      </div>
    </aside>
  );
}
