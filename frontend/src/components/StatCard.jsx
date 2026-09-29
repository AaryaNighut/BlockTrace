import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'cyan' }) {
  const colorMap = {
    cyan: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30',
    rose: 'from-rose-500/20 to-red-500/10 text-rose-400 border-rose-500/30',
    amber: 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30',
    emerald: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
  };

  const currentStyle = colorMap[color] || colorMap.cyan;

  return (
    <div className="cyber-card p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-100 mt-2 font-mono tracking-tight">{value}</h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3.5 rounded-xl bg-gradient-to-br ${currentStyle} border shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {/* Subtle Glow line at bottom */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${currentStyle}`} />
    </div>
  );
}
