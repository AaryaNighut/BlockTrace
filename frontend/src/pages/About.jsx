import React from 'react';
import { 
  Info, 
  ShieldCheck, 
  Code, 
  AlertTriangle, 
  Cpu, 
  Database, 
  BookOpen, 
  CheckCircle2 
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
          BlockTrace is an educational blockchain-based cryptocurrency transaction tracking and risk analysis DApp designed specifically as a Blockchain Technology mini-project.
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
        {/* Project Objectives */}
        <div className="cyber-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Core Objectives
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Provide an accessible user interface to inspect cryptocurrency address activity metrics.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Apply transparent, rule-based scoring (0-100) based on transaction frequency, counterparty volume, and transfer magnitude.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Enable immutable on-chain investigation record registration via Ethereum smart contracts.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Offer an offline-compatible Demo Mode for seamless academic viva examination.</span>
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
              <span className="text-cyan-300 font-semibold">React.js + Vite</span>
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
              <span className="text-cyan-300 font-semibold">Hardhat Local Node</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Web3 Library:</span>
              <span className="text-cyan-300 font-semibold">Ethers.js (v6) + MetaMask</span>
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
            <p className="text-slate-300">
              Answer: The score starts at 0 and evaluates 5 rule-based metrics (+20 points each): high tx count (&ge;25), multiple unique counterparty addresses (&ge;10), large transfer volume (&ge;10 ETH), rapid transfer sequences, and unusual fan-out patterns. Scores range 0-30 (Low), 31-60 (Medium), 61-100 (High).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-400 block">Q2: Why store investigation records on Ethereum?</span>
            <p className="text-slate-300">
              Answer: Storing investigation metadata on an Ethereum smart contract ensures immutability, transparency, and auditability. Once written via <code className="text-cyan-300">registerInvestigation()</code>, the record cannot be tampered with or retroactively altered.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-400 block">Q3: How does the DApp interact with MetaMask?</span>
            <p className="text-slate-300">
              Answer: Ethers.js uses <code className="text-cyan-300">window.ethereum</code> as a web3 provider. MetaMask prompts the user to sign the transaction, which is broadcast to our local Hardhat testnet (Chain ID 31337).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
