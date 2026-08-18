import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { OptionAnalysis } from '../types';

interface SwotViewProps {
  optionsAnalysis: OptionAnalysis[];
}

export const SwotView: React.FC<SwotViewProps> = ({ optionsAnalysis }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    optionsAnalysis[0]?.optionId || ''
  );

  const activeOption =
    optionsAnalysis.find((o) => o.optionId === selectedOptionId) ||
    optionsAnalysis[0];

  if (!activeOption || !activeOption.swot) {
    return (
      <div className="bg-[#121212] p-8 border border-white/15 text-center text-white/40 font-mono text-xs uppercase">
        No SWOT matrix data available.
      </div>
    );
  }

  const { swot } = activeOption;

  return (
    <div className="space-y-6">
      {/* Option Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121212] p-4 border border-white/15">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#D4FF00]" />
          <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#D4FF00] font-bold">
            SWOT Matrix Audit For:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {optionsAnalysis.map((opt) => {
            const isSelected = opt.optionId === selectedOptionId;
            return (
              <button
                key={opt.optionId}
                id={`btn-swot-option-${opt.optionId}`}
                onClick={() => setSelectedOptionId(opt.optionId)}
                className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#D4FF00] text-black font-black'
                    : 'bg-[#080808] text-white/70 hover:text-white border border-white/10'
                }`}
              >
                {opt.optionName}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2x2 Grid (Exact Bold Typography Architectural Grid) */}
      <div className="bg-[#121212] border border-white/20 grid grid-cols-1 md:grid-cols-2">
        {/* 1. STRENGTHS (Internal Positives) */}
        <div className="p-6 border-b md:border-r border-white/15 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-[#D4FF00] uppercase font-mono font-bold tracking-[0.3em]">
                STRENGTHS (INTERNAL)
              </span>
              <span className="w-2 h-2 bg-[#D4FF00]" />
            </div>
            <p className="text-xs text-white/50 mb-4 font-mono">
              Core internal advantages and competitive levers.
            </p>

            <ul className="space-y-2.5">
              {(swot.strengths || []).map((item, idx) => (
                <li
                  key={idx}
                  className="bg-[#080808] border border-white/10 p-3.5 text-xs text-white/90 flex items-start gap-2.5"
                >
                  <span className="text-[#D4FF00] font-mono font-bold">—</span>
                  <span className="leading-relaxed font-semibold">{item}</span>
                </li>
              ))}
              {(!swot.strengths || swot.strengths.length === 0) && (
                <li className="text-xs text-white/40 italic font-mono">No strengths listed</li>
              )}
            </ul>
          </div>
        </div>

        {/* 2. WEAKNESSES (Internal Drawbacks) */}
        <div className="p-6 border-b border-white/15 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-red-400 uppercase font-mono font-bold tracking-[0.3em]">
                WEAKNESSES (INTERNAL)
              </span>
              <span className="w-2 h-2 bg-red-500" />
            </div>
            <p className="text-xs text-white/50 mb-4 font-mono">
              Structural gaps, friction points, and constraints.
            </p>

            <ul className="space-y-2.5">
              {(swot.weaknesses || []).map((item, idx) => (
                <li
                  key={idx}
                  className="bg-[#080808] border border-white/10 p-3.5 text-xs text-white/90 flex items-start gap-2.5"
                >
                  <span className="text-red-400 font-mono font-bold">—</span>
                  <span className="leading-relaxed font-semibold">{item}</span>
                </li>
              ))}
              {(!swot.weaknesses || swot.weaknesses.length === 0) && (
                <li className="text-xs text-white/40 italic font-mono">No weaknesses listed</li>
              )}
            </ul>
          </div>
        </div>

        {/* 3. OPPORTUNITIES (External Upside) */}
        <div className="p-6 border-b md:border-b-0 md:border-r border-white/15 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-sky-400 uppercase font-mono font-bold tracking-[0.3em]">
                OPPORTUNITIES (EXTERNAL)
              </span>
              <span className="w-2 h-2 bg-sky-400" />
            </div>
            <p className="text-xs text-white/50 mb-4 font-mono">
              Future upside, network expansion, and market trends.
            </p>

            <ul className="space-y-2.5">
              {(swot.opportunities || []).map((item, idx) => (
                <li
                  key={idx}
                  className="bg-[#080808] border border-white/10 p-3.5 text-xs text-white/90 flex items-start gap-2.5"
                >
                  <span className="text-sky-400 font-mono font-bold">—</span>
                  <span className="leading-relaxed font-semibold">{item}</span>
                </li>
              ))}
              {(!swot.opportunities || swot.opportunities.length === 0) && (
                <li className="text-xs text-white/40 italic font-mono">No opportunities listed</li>
              )}
            </ul>
          </div>
        </div>

        {/* 4. THREATS (External Headwinds) */}
        <div className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-amber-400 uppercase font-mono font-bold tracking-[0.3em]">
                THREATS (EXTERNAL)
              </span>
              <span className="w-2 h-2 bg-amber-400" />
            </div>
            <p className="text-xs text-white/50 mb-4 font-mono">
              Macroeconomic risks, competitive moves, and roadblocks.
            </p>

            <ul className="space-y-2.5">
              {(swot.threats || []).map((item, idx) => (
                <li
                  key={idx}
                  className="bg-[#080808] border border-white/10 p-3.5 text-xs text-white/90 flex items-start gap-2.5"
                >
                  <span className="text-amber-400 font-mono font-bold">—</span>
                  <span className="leading-relaxed font-semibold">{item}</span>
                </li>
              ))}
              {(!swot.threats || swot.threats.length === 0) && (
                <li className="text-xs text-white/40 italic font-mono">No threats listed</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
