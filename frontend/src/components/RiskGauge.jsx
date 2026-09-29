import React from 'react';

export default function RiskGauge({ score = 0, riskLevel = 'LOW RISK' }) {
  // SVG circle calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = '#10b981'; // emerald
  let glowColor = 'rgba(16, 185, 129, 0.25)';

  if (clampedScore >= 61) {
    strokeColor = '#f43f5e'; // rose
    glowColor = 'rgba(244, 63, 94, 0.3)';
  } else if (clampedScore >= 31) {
    strokeColor = '#f59e0b'; // amber
    glowColor = 'rgba(245, 158, 11, 0.3)';
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 relative">
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
          {/* Background circle track */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Active score meter */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={strokeColor}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
              filter: `drop-shadow(0 0 10px ${glowColor})`,
            }}
          />
        </svg>

        {/* Center content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold text-slate-100 font-mono tracking-tight">
            {score}
          </span>
          <span className="text-[11px] text-slate-400 font-medium uppercase font-mono">out of 100</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Calculated Risk Index</span>
        <span
          className="text-base font-extrabold tracking-tight mt-0.5 block"
          style={{ color: strokeColor }}
        >
          {riskLevel}
        </span>
      </div>
    </div>
  );
}
