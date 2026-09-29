import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function RiskBadge({ riskLevel, score }) {
  const level = (riskLevel || '').toUpperCase();

  if (level.includes('HIGH')) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-semibold shadow-sm shadow-rose-950/40">
        <AlertOctagon className="w-3.5 h-3.5" />
        <span>HIGH RISK</span>
        {score !== undefined && <span className="font-mono text-[11px] opacity-80">({score}/100)</span>}
      </div>
    );
  }

  if (level.includes('MEDIUM') || level.includes('MED')) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-semibold shadow-sm shadow-amber-950/40">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>MEDIUM RISK</span>
        {score !== undefined && <span className="font-mono text-[11px] opacity-80">({score}/100)</span>}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold shadow-sm shadow-emerald-950/40">
      <ShieldCheck className="w-3.5 h-3.5" />
      <span>LOW RISK</span>
      {score !== undefined && <span className="font-mono text-[11px] opacity-80">({score}/100)</span>}
    </div>
  );
}
