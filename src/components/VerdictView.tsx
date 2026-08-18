import React from 'react';
import { Trophy, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb, Compass, Zap, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DecisionAnalysisResult } from '../types';

interface VerdictViewProps {
  decision: DecisionAnalysisResult;
  onLockDecision: (optionId: string) => void;
}

export const VerdictView: React.FC<VerdictViewProps> = ({
  decision,
  onLockDecision,
}) => {
  const { verdict, options, userChosenOptionId } = decision;

  if (!verdict) {
    return (
      <div className="bg-[#121212] border border-white/10 p-8 text-center text-white/50 text-xs font-mono uppercase">
        Verdict calculation pending.
      </div>
    );
  }

  const isDecided = Boolean(userChosenOptionId);
  const winningOption = options.find((o) => o.id === verdict.winnerId);

  const handleLockIn = () => {
    onLockDecision(verdict.winnerId);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4FF00', '#FFFFFF', '#080808']
    });
  };

  return (
    <div className="space-y-8">
      {/* Hero Recommendation Card */}
      <div className="bg-[#121212] border border-white/20 p-6 sm:p-10 relative overflow-hidden">
        {/* Subtle accent grid line */}
        <div className="absolute top-0 right-0 p-6 opacity-20 font-mono text-[100px] font-black leading-none select-none text-white pointer-events-none">
          TB
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#D4FF00]" />
              <span className="text-xs uppercase font-mono tracking-[0.3em] text-[#D4FF00] font-bold">
                The Tiebreaker Recommendation
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col text-right">
                <span className="text-[9px] uppercase font-mono tracking-widest text-white/40">
                  Certainty Score
                </span>
                <span className="text-2xl font-black text-[#D4FF00] font-mono">
                  {verdict.confidenceScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Winning Choice Display */}
          <div>
            <span className="text-[11px] uppercase font-mono tracking-[0.4em] text-white/40 block mb-2 font-bold">
              Optimal Course of Action
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
              {verdict.winnerName}
            </h2>
            {winningOption?.description && (
              <p className="text-sm text-white/60 mt-3 max-w-2xl font-mono">
                {winningOption.description}
              </p>
            )}
          </div>

          {/* Active Summary Quote */}
          <div className="border-l-4 border-[#D4FF00] pl-6 py-2 my-6">
            <p className="text-base sm:text-lg italic text-white/90 font-medium leading-relaxed">
              "{verdict.summary}"
            </p>
          </div>

          {/* Two Core Pillars: Deciding Factor & Critical Trade-Off */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-[#080808] border border-white/15 p-5 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#D4FF00]" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4FF00] font-bold">
                  The Deciding Factor
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                {verdict.theDecidingFactor}
              </p>
            </div>

            <div className="bg-[#080808] border border-white/15 p-5 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-400 font-bold">
                  Critical Trade-Off
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                {verdict.criticalTradeoff}
              </p>
            </div>
          </div>

          {/* Lock In Decision Action */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
            <div className="text-xs text-white/40 font-mono">
              Status: {isDecided ? '✓ Decision Locked In' : '• Pending Commitment'}
            </div>

            {!isDecided ? (
              <button
                type="button"
                id="btn-lock-verdict"
                onClick={handleLockIn}
                className="inline-flex items-center gap-2 bg-white text-black font-black uppercase text-xs tracking-widest px-6 py-3 hover:bg-[#D4FF00] transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Commit to {verdict.winnerName}
              </button>
            ) : (
              <span className="inline-flex items-center gap-2 bg-[#D4FF00]/10 border border-[#D4FF00]/40 text-[#D4FF00] font-mono text-xs font-bold uppercase tracking-wider px-4 py-2">
                <CheckCircle2 className="w-4 h-4" />
                Committed to this path
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Plan & Pivot Protocol Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Recommended Action Plan */}
        <div className="bg-[#121212] border border-white/15 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <div className="w-3 h-3 bg-[#D4FF00]" />
            <h3 className="text-xs uppercase font-mono tracking-[0.2em] font-bold text-white">
              Immediate Execution Roadmap
            </h3>
          </div>

          <ul className="space-y-3">
            {(verdict.recommendedActionPlan || []).map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-[#080808] border border-white/10 p-3.5 text-xs text-white/90">
                <span className="w-5 h-5 bg-white/10 text-[#D4FF00] font-mono font-bold flex items-center justify-center text-[10px] shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Pivot Trigger Conditions */}
        <div className="bg-[#121212] border border-white/15 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <div className="w-3 h-3 bg-red-500" />
            <h3 className="text-xs uppercase font-mono tracking-[0.2em] font-bold text-white">
              Pivot Triggers (When to Switch)
            </h3>
          </div>

          <ul className="space-y-3">
            {(verdict.pivotTriggers || []).map((trigger: any, idx) => {
              const triggerText = typeof trigger === 'string' 
                ? trigger 
                : `${trigger.condition || ''} → Switch to ${trigger.alternativeChoice || 'alternative'}`;
              return (
                <li key={idx} className="flex items-start gap-3 bg-[#080808] border border-white/10 p-3.5 text-xs text-white/80">
                  <span className="text-red-400 font-mono font-bold mt-0.5 shrink-0">!</span>
                  <span className="leading-relaxed font-mono">{triggerText}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Blindspot & Mitigation Matrix */}
      {decision.blindspots && decision.blindspots.length > 0 && (
        <div className="bg-[#121212] border border-white/15 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <div className="w-3 h-3 bg-[#D4FF00]" />
            <h3 className="text-xs uppercase font-mono tracking-[0.2em] font-bold text-white">
              Blindspot & Risk Mitigation
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {decision.blindspots.map((item, idx) => (
              <div key={idx} className="bg-[#080808] border border-white/10 p-4 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
                  Risk Factor 0{idx + 1}
                </span>
                <h4 className="text-xs font-bold text-white">
                  {item.risk || item.title}
                </h4>
                <p className="text-[11px] text-[#D4FF00] font-mono pt-1">
                  Fix: {item.mitigation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
