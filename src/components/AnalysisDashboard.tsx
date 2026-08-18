import React, { useState } from 'react';
import { Trophy, Scale, TableProperties, Compass, HeartHandshake, Sparkles, Share2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { DecisionAnalysisResult, OptionAnalysis, EvaluationCriterion } from '../types';
import { VerdictView } from './VerdictView';
import { ProsConsView } from './ProsConsView';
import { ComparisonMatrixView } from './ComparisonMatrixView';
import { SwotView } from './SwotView';
import { GutCheckSimulator } from './GutCheckSimulator';
import { ScenarioSandbox } from './ScenarioSandbox';

interface AnalysisDashboardProps {
  decision: DecisionAnalysisResult;
  onUpdateDecision: (updated: DecisionAnalysisResult) => void;
  onBackToEdit: () => void;
  onOpenExport: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  decision,
  onUpdateDecision,
  onBackToEdit,
  onOpenExport,
}) => {
  const [activeTab, setActiveTab] = useState<'verdict' | 'proscons' | 'matrix' | 'swot' | 'gutcheck' | 'sandbox'>('verdict');

  const handleLockDecision = (optionId: string) => {
    onUpdateDecision({
      ...decision,
      userChosenOptionId: optionId,
    });
  };

  const handleUpdateOptionsAnalysis = (updated: OptionAnalysis[]) => {
    onUpdateDecision({
      ...decision,
      optionsAnalysis: updated,
    });
  };

  const handleUpdateCriteria = (updated: EvaluationCriterion[]) => {
    onUpdateDecision({
      ...decision,
      criteria: updated,
    });
  };

  const isDecided = Boolean(decision.userChosenOptionId);
  const chosenOption = decision.options.find((o) => o.id === decision.userChosenOptionId);

  interface TabItem {
    id: 'verdict' | 'proscons' | 'matrix' | 'swot' | 'gutcheck' | 'sandbox';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  const tabs: TabItem[] = [
    { id: 'verdict', label: 'The Verdict', icon: Trophy, badge: `${decision.verdict?.confidenceScore || 75}% Certainty` },
    { id: 'proscons', label: 'Pros & Cons', icon: Scale, badge: `${decision.optionsAnalysis?.reduce((acc, o) => acc + o.pros.length + o.cons.length, 0) || 0} Factors` },
    { id: 'matrix', label: 'Direct Comparison', icon: TableProperties, badge: `${decision.criteria?.length || 0} Criteria` },
    { id: 'swot', label: 'SWOT Matrix', icon: Compass },
    { id: 'gutcheck', label: 'Gut Check', icon: HeartHandshake },
    { id: 'sandbox', label: 'What-If Sandbox', icon: Sparkles },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner (Bold Typography Architectural Header) */}
      <div className="bg-[#121212] border border-white/15 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="btn-back-to-input"
              onClick={onBackToEdit}
              className="p-2.5 bg-[#080808] border border-white/10 hover:border-[#D4FF00] text-white/70 hover:text-[#D4FF00] transition-colors"
              title="Return to query inputs"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1 font-mono">
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4FF00]">
                  Active Query Session
                </span>
                {isDecided && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-black bg-[#D4FF00] px-2 py-0.5">
                    Decided: {chosenOption?.name}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                Evaluating {decision.options.length} Candidate Alternatives
              </span>
            </div>
          </div>

          <button
            type="button"
            id="btn-export-dashboard"
            onClick={onOpenExport}
            className="inline-flex items-center gap-2 text-xs font-mono font-black uppercase tracking-widest text-black bg-white hover:bg-[#D4FF00] px-4 py-2.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            Export Report
          </button>
        </div>

        {/* Big Dilemma Display */}
        <div>
          <span className="text-[11px] uppercase font-mono tracking-[0.5em] text-[#D4FF00] font-bold block mb-2">
            Active Query
          </span>
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight italic border-l-4 border-[#D4FF00] pl-6 py-2 text-white font-sans">
            {decision.title}
          </h2>
        </div>

        {/* Contenders List */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-white/40 uppercase tracking-widest mr-1">
            Contenders:
          </span>
          {decision.options.map((opt, idx) => {
            const isWinner = opt.id === decision.verdict?.winnerId;
            const isChosen = opt.id === decision.userChosenOptionId;

            return (
              <span
                key={opt.id}
                className={`inline-flex items-center gap-2 px-3 py-1 border transition-colors ${
                  isChosen
                    ? 'bg-[#D4FF00] text-black border-[#D4FF00] font-bold'
                    : isWinner
                    ? 'bg-[#D4FF00]/10 text-[#D4FF00] border-[#D4FF00]/40 font-bold'
                    : 'bg-[#080808] text-white/80 border-white/15'
                }`}
              >
                <span
                  className={`w-4 h-4 text-[10px] font-black flex items-center justify-center ${
                    isChosen
                      ? 'bg-black text-[#D4FF00]'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt.name}</span>
                {isWinner && !isChosen && (
                  <span className="text-[9px] font-black uppercase bg-[#D4FF00] text-black px-1">
                    AI Pick
                  </span>
                )}
                {isChosen && (
                  <span className="text-[9px] font-black uppercase bg-black text-[#D4FF00] px-1">
                    Committed
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#D4FF00] text-black font-black'
                  : 'bg-[#121212] text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 font-mono font-bold ${
                    isActive
                      ? 'bg-black text-[#D4FF00]'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div>
        {activeTab === 'verdict' && (
          <VerdictView decision={decision} onLockDecision={handleLockDecision} />
        )}

        {activeTab === 'proscons' && (
          <ProsConsView
            optionsAnalysis={decision.optionsAnalysis}
            onUpdateAnalysis={handleUpdateOptionsAnalysis}
          />
        )}

        {activeTab === 'matrix' && (
          <ComparisonMatrixView
            options={decision.options}
            criteria={decision.criteria}
            onUpdateCriteria={handleUpdateCriteria}
          />
        )}

        {activeTab === 'swot' && (
          <SwotView optionsAnalysis={decision.optionsAnalysis} />
        )}

        {activeTab === 'gutcheck' && (
          <GutCheckSimulator
            options={decision.options}
            onSelectOption={handleLockDecision}
          />
        )}

        {activeTab === 'sandbox' && (
          <ScenarioSandbox decision={decision} />
        )}
      </div>
    </div>
  );
};
