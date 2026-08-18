import React, { useState } from 'react';
import { ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { DecisionAnalysisResult } from '../types';

interface ScenarioSandboxProps {
  decision: DecisionAnalysisResult;
}

interface ScenarioShiftResult {
  shiftSummary: string;
  winnerChanged: boolean;
  updatedWinnerId: string;
  updatedWinnerName: string;
  updatedConfidenceScore: number;
  newDecidingFactor: string;
  keyInsight: string;
  impactOnOptions: Array<{
    optionId: string;
    optionName: string;
    impactNote: string;
    scoreDelta?: string;
  }>;
}

export const ScenarioSandbox: React.FC<ScenarioSandboxProps> = ({ decision }) => {
  const [scenarioPrompt, setScenarioPrompt] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<ScenarioShiftResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const samplePrompts = [
    'What if compensation is equalized across all options?',
    'What if my timeframe / horizon is cut in half?',
    'What if worst-case economic headwinds occur next year?',
    'What if I have to execute this completely solo?',
  ];

  const handleSimulate = async (promptToUse?: string) => {
    const query = promptToUse || scenarioPrompt;
    if (!query.trim()) return;

    setIsSimulating(true);
    setError(null);

    try {
      const res = await fetch('/api/tweak-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentAnalysis: decision,
          scenarioChange: query.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('Simulation failed. Please try again.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to simulate scenario shift');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Box */}
      <div className="bg-[#121212] border border-white/15 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#D4FF00]" />
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#D4FF00]">
              What-If Scenario Sandbox
            </h3>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              Stress-test this decision by testing hypothetical curveballs or modified assumptions
            </p>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2 font-mono">
          <input
            type="text"
            id="input-scenario-prompt"
            value={scenarioPrompt}
            onChange={(e) => setScenarioPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSimulate()}
            placeholder="e.g. What if Option B offers a $20k bonus? or What if remote work ends?"
            className="flex-1 text-xs text-white bg-[#080808] border border-white/20 px-4 py-3 focus:border-[#D4FF00] focus:outline-none"
          />
          <button
            type="button"
            id="btn-run-scenario"
            onClick={() => handleSimulate()}
            disabled={isSimulating || !scenarioPrompt.trim()}
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#D4FF00] text-black text-xs font-mono font-black uppercase tracking-widest px-6 py-3 transition-colors disabled:opacity-40 cursor-pointer shrink-0"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <span>Test Hypothesis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Quick prompt chips */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mr-1">
            Presets:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setScenarioPrompt(p);
                handleSimulate(p);
              }}
              className="text-[11px] font-mono bg-[#080808] hover:border-[#D4FF00] hover:text-[#D4FF00] text-white/70 px-3 py-1.5 border border-white/10 transition-colors text-left"
            >
              {p}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5 font-mono">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>

      {/* Simulation Result Card */}
      {result && (
        <div className="bg-[#121212] border border-white/20 p-6 sm:p-8 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4FF00] bg-[#D4FF00]/10 px-2.5 py-1 border border-[#D4FF00]/30">
                Simulation Outcome
              </span>
              {result.winnerChanged ? (
                <span className="text-xs font-mono font-black uppercase text-red-400 bg-red-950/60 px-2.5 py-1 border border-red-500/40">
                  ⚠️ Winner Flipped!
                </span>
              ) : (
                <span className="text-xs font-mono font-bold uppercase text-[#D4FF00] bg-[#D4FF00]/10 px-2.5 py-1">
                  ✓ Winner Remains Stable
                </span>
              )}
            </div>

            <div className="text-xs font-mono text-white/50">
              Revised Certainty:{' '}
              <strong className="text-[#D4FF00]">
                {result.updatedConfidenceScore}%
              </strong>
            </div>
          </div>

          {/* Revised Winner Display */}
          <div className="bg-[#080808] border border-white/20 p-6 space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-[#D4FF00] tracking-widest block">
              Under this hypothesis, the optimal choice becomes:
            </span>
            <h4 className="text-3xl font-black uppercase text-white font-sans tracking-tight">
              {result.updatedWinnerName}
            </h4>
            <p className="text-xs sm:text-sm text-white/80 mt-2 leading-relaxed font-mono">
              {result.shiftSummary}
            </p>
          </div>

          {/* Deciding Factor & Strategic Insight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#080808] border border-white/10 p-4 space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#D4FF00] uppercase tracking-widest block">
                New Crux
              </span>
              <p className="text-xs text-white/90 leading-relaxed font-mono">
                "{result.newDecidingFactor}"
              </p>
            </div>

            <div className="bg-[#080808] border border-white/10 p-4 space-y-1">
              <span className="text-[10px] font-mono font-bold text-white/60 uppercase tracking-widest block">
                Strategic Takeaway
              </span>
              <p className="text-xs text-white/90 leading-relaxed font-mono">
                {result.keyInsight}
              </p>
            </div>
          </div>

          {/* Impact on Individual Options */}
          {result.impactOnOptions && result.impactOnOptions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-[0.2em]">
                Impact Breakdown by Option
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.impactOnOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    className="bg-[#080808] border border-white/10 p-3.5 text-xs font-mono space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white uppercase">
                        {opt.optionName}
                      </span>
                      {opt.scoreDelta && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#D4FF00] text-black">
                          {opt.scoreDelta}
                        </span>
                      )}
                    </div>
                    <p className="text-white/60 text-[11px] leading-relaxed">
                      {opt.impactNote}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
