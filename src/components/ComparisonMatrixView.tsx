import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { DecisionOption, EvaluationCriterion } from '../types';
import { calculateWeightedScore } from '../utils/scoring';

interface ComparisonMatrixViewProps {
  options: DecisionOption[];
  criteria: EvaluationCriterion[];
  onUpdateCriteria: (updated: EvaluationCriterion[]) => void;
}

export const ComparisonMatrixView: React.FC<ComparisonMatrixViewProps> = ({
  options,
  criteria,
  onUpdateCriteria,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCritName, setNewCritName] = useState('');
  const [newCritWeight, setNewCritWeight] = useState(3);
  const [newCritDesc, setNewCritDesc] = useState('');

  const ranking = options.map((opt) => {
    const scoreInfo = calculateWeightedScore(opt.id, criteria);
    return {
      option: opt,
      ...scoreInfo,
    };
  }).sort((a, b) => b.totalScore - a.totalScore);

  const handleScoreChange = (critId: string, optionId: string, value: number) => {
    const updated = criteria.map((c) => {
      if (c.id === critId) {
        return {
          ...c,
          scores: {
            ...c.scores,
            [optionId]: Math.max(1, Math.min(10, value)),
          },
        };
      }
      return c;
    });
    onUpdateCriteria(updated);
  };

  const handleWeightChange = (critId: string, weight: number) => {
    const updated = criteria.map((c) => {
      if (c.id === critId) {
        return { ...c, weight };
      }
      return c;
    });
    onUpdateCriteria(updated);
  };

  const handleRemoveCriterion = (critId: string) => {
    const updated = criteria.filter((c) => c.id !== critId);
    onUpdateCriteria(updated);
  };

  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritName.trim()) return;

    const initialScores: Record<string, number> = {};
    options.forEach((opt) => {
      initialScores[opt.id] = 5;
    });

    const newCriterion: EvaluationCriterion = {
      id: `crit-${Date.now()}`,
      name: newCritName.trim(),
      description: newCritDesc.trim(),
      weight: newCritWeight,
      scores: initialScores,
      rationales: {},
    };

    onUpdateCriteria([...criteria, newCriterion]);
    setShowAddModal(false);
    setNewCritName('');
    setNewCritDesc('');
    setNewCritWeight(3);
  };

  return (
    <div className="space-y-6">
      {/* Weighted Score Leaderboard Cards */}
      <div className="bg-[#121212] border border-white/15 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#D4FF00]" />
            <h3 className="text-xs uppercase font-mono tracking-[0.25em] text-white font-bold">
              Weighted Matrix Leaderboard
            </h3>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            Formula: Score × Weight Multiplier
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ranking.map((rank, idx) => {
            const isFirst = idx === 0;
            return (
              <div
                key={rank.option.id}
                className={`p-4 border transition-all ${
                  isFirst
                    ? 'bg-[#080808] border-[#D4FF00] text-white'
                    : 'bg-[#080808] border-white/10 text-white/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1 font-mono">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">
                    Rank #{idx + 1}
                  </span>
                  {isFirst && (
                    <span className="text-[10px] font-black uppercase text-black bg-[#D4FF00] px-1.5 py-0.5">
                      Leading Alternative
                    </span>
                  )}
                </div>

                <div className="text-base font-bold text-white uppercase font-sans truncate">
                  {rank.option.name}
                </div>

                <div className="mt-3 flex items-baseline justify-between font-mono">
                  <span className="text-[10px] uppercase tracking-widest text-white/40">
                    Weighted Index
                  </span>
                  <span
                    className={`text-xl font-black ${
                      isFirst ? 'text-[#D4FF00]' : 'text-white'
                    }`}
                  >
                    {rank.totalScore}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Comparison Matrix Table (Design Style) */}
      <div className="bg-[#121212] border border-white/15 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4FF00] block mb-1">
              Direct Side-by-Side Comparison
            </span>
            <h4 className="text-sm font-bold uppercase tracking-tight text-white font-mono">
              Evaluation Criteria & Scores (1 to 10 Scale)
            </h4>
          </div>

          <button
            type="button"
            id="btn-add-criterion"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 text-xs font-mono font-black uppercase tracking-widest text-black bg-white hover:bg-[#D4FF00] px-4 py-2 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Criterion
          </button>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead className="text-left opacity-60 uppercase border-b border-white/10">
              <tr className="h-10">
                <th className="pb-3 pr-4 font-bold text-[10px] tracking-wider text-white">
                  Evaluation Metric
                </th>
                <th className="pb-3 px-3 font-bold text-[10px] tracking-wider text-white text-center w-28">
                  Weight (1-5★)
                </th>
                {options.map((opt) => (
                  <th
                    key={opt.id}
                    className="pb-3 px-4 font-bold text-[10px] tracking-wider text-white text-center min-w-[140px]"
                  >
                    {opt.name}
                  </th>
                ))}
                <th className="pb-3 pl-2 w-10"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {criteria.map((crit) => (
                <tr key={crit.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 pr-4">
                    <div className="font-bold text-white text-xs">
                      {crit.name}
                    </div>
                    {crit.description && (
                      <div className="text-[10px] text-white/40 mt-0.5">
                        {crit.description}
                      </div>
                    )}
                  </td>

                  {/* Weight Selector */}
                  <td className="py-4 px-3 text-center">
                    <div className="inline-flex items-center gap-1 bg-[#080808] border border-white/10 px-2 py-1">
                      {[1, 2, 3, 4, 5].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => handleWeightChange(crit.id, w)}
                          className={`text-xs ${
                            w <= crit.weight
                              ? 'text-[#D4FF00] font-bold'
                              : 'text-white/20'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </td>

                  {/* Per-option score inputs */}
                  {options.map((opt) => {
                    const score = crit.scores[opt.id] ?? 5;
                    const isTopScore =
                      score === Math.max(...options.map((o) => crit.scores[o.id] ?? 0));

                    return (
                      <td key={opt.id} className="py-4 px-4 text-center">
                        <div className="inline-flex items-center justify-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={score}
                            onChange={(e) =>
                              handleScoreChange(
                                crit.id,
                                opt.id,
                                Number(e.target.value)
                              )
                            }
                            className={`w-14 text-center font-mono font-bold text-xs py-1.5 bg-[#080808] border ${
                              isTopScore
                                ? 'border-[#D4FF00] text-[#D4FF00]'
                                : 'border-white/20 text-white'
                            } focus:border-[#D4FF00] focus:outline-none`}
                          />
                          <span className="text-[10px] text-white/30">/10</span>
                        </div>
                      </td>
                    );
                  })}

                  <td className="py-4 pl-2 text-right">
                    {criteria.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCriterion(crit.id)}
                        className="text-white/20 hover:text-red-400 p-1 transition-colors"
                        title="Delete criterion"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Criterion Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-white/20 p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#D4FF00]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
                  Add Decision Metric
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-white/40 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCriterion} className="space-y-4 font-mono">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-1">
                  Metric Name
                </label>
                <input
                  type="text"
                  value={newCritName}
                  onChange={(e) => setNewCritName(e.target.value)}
                  placeholder="e.g. Cultural Alignment, Downside Risk, Burnout Potential"
                  className="w-full bg-[#080808] border border-white/20 p-3 text-xs text-white focus:border-[#D4FF00] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-1">
                  Importance Weight (1 to 5 Stars)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setNewCritWeight(w)}
                      className={`flex-1 py-2 text-xs font-bold border transition-colors ${
                        w <= newCritWeight
                          ? 'bg-[#D4FF00] text-black border-[#D4FF00]'
                          : 'bg-[#080808] text-white/50 border-white/10'
                      }`}
                    >
                      {w}★
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs uppercase tracking-widest text-white/60 hover:text-white border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black uppercase tracking-widest bg-white text-black hover:bg-[#D4FF00] transition-colors"
                >
                  Add Metric
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
