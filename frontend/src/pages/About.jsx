import React from 'react';
import { 
  Info, 
  ShieldCheck, 
  Code, 
  AlertTriangle, 
  Cpu, 
  Database, 
  BookOpen, 
  CheckCircle2,
  Globe,
  Sparkles,
  Layers
} from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="cyber-card p-6 md:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          Academic Documentation & Methodology
        </div>
        <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          About <span className="cyber-gradient-text">BlockTrace</span>
        </h2>
        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
          BlockTrace is a full-stack educational blockchain application designed for cryptocurrency transaction tracking, rule-based risk evaluation, and on-chain investigation audit registration via Ethereum smart contracts.
        </p>
      </div>

      {/* Critical Academic Disclaimer Box */}
      <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-base text-amber-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          Important Academic & Compliance Disclaimer
        </div>
        <p className="text-xs text-amber-200/90 leading-relaxed">
          “This system does NOT prove or claim that a wallet address belongs to a scammer or criminal entity. It strictly identifies potentially unusual activity patterns based on deterministic rule-based indicators (+20 points per triggered heuristic). This platform is an educational prototype built for demonstration purposes.”
        </p>
      </div>

      {/* Grid of Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Objectives & Modes */}
        <div className="cyber-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Dual-Mode Capability
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Educational Demo Mode:</strong> 100% offline-compatible for college presentations without requiring external API keys.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Globe className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Live Ethereum Mainnet Mode:</strong> Queries live transaction history for any public address via Etherscan API V2 and parses Wei into ETH.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Layers className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                <strong>On-Chain Audit Trail:</strong> Writes investigation metadata to <code className="text-cyan-300 font-mono">InvestigationRegistry.sol</code> on your local Hardhat node.
              </span>
            </li>
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="cyber-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Technology Architecture
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Frontend Framework:</span>
              <span className="text-cyan-300 font-semibold">React.js (v18) + Vite</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Styling System:</span>
              <span className="text-cyan-300 font-semibold">Tailwind CSS (Dark Cyber)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Smart Contract:</span>
              <span className="text-cyan-300 font-semibold">Solidity v0.8.20</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Development Network:</span>
              <span className="text-cyan-300 font-semibold">Hardhat Node (31337)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Live Blockchain API:</span>
              <span className="text-cyan-300 font-semibold">Etherscan API V2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Viva Q&A Quick Reference */}
      <div className="cyber-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          Viva Presentation Cheat Sheet
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-400 block">Q1: How is the Risk Score calculated?</span>
            <p className="text-slate-300 leading-relaxed">
              Answer: The score starts at 0 and evaluates 5 rule-based metrics (+20 points each): total tx count (&ge;25), multiple unique counterparty addresses (&ge;10), large transfer volume (&ge;10 ETH), rapid transfer sequences (sub-minute), and unusual fan-out structures. Scores range 0-30 (Low), 31-60 (Medium), 61-100 (High).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-400 block">Q2: Why store investigation records on Ethereum?</span>
            <p className="text-slate-300 leading-relaxed">
              Answer: Storing investigation metadata on an Ethereum smart contract ensures immutability, transparency, and auditability. Once written via <code className="text-cyan-300">registerInvestigation()</code>, the record cannot be tampered with or retroactively altered.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-400 block">Q3: How does the DApp interact with MetaMask?</span>
            <p className="text-slate-300 leading-relaxed">
              Answer: Ethers.js uses <code className="text-cyan-300">window.ethereum</code> as a web3 provider. MetaMask prompts the user to sign the transaction, which is broadcast to our local Hardhat testnet (Chain ID 31337).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
