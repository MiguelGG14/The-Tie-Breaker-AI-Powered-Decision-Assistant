import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { OptionAnalysis, ProConItem } from '../types';

interface ProsConsViewProps {
  optionsAnalysis: OptionAnalysis[];
  onUpdateAnalysis: (updated: OptionAnalysis[]) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  optionsAnalysis,
  onUpdateAnalysis,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    optionsAnalysis[0]?.optionId || ''
  );
  const [showAddModal, setShowAddModal] = useState<{
    optionId: string;
    type: 'pro' | 'con';
  } | null>(null);

  const [newText, setNewText] = useState('');
  const [newImpact, setNewImpact] = useState(3);
  const [newCategory, setNewCategory] = useState<'Career' | 'Financial' | 'Lifestyle' | 'Emotional' | 'Risk' | 'Effort' | 'Health' | 'General'>('Career');

  const activeOption =
    optionsAnalysis.find((o) => o.optionId === selectedOptionId) ||
    optionsAnalysis[0];

  const handleAddFactor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddModal || !newText.trim()) return;

    const newItem: ProConItem = {
      id: `custom-${Date.now()}`,
      text: newText.trim(),
      impact: Number(newImpact),
      category: newCategory,
    };

    const updated = optionsAnalysis.map((opt) => {
      if (opt.optionId === showAddModal.optionId) {
        if (showAddModal.type === 'pro') {
          return { ...opt, pros: [...opt.pros, newItem] };
        } else {
          return { ...opt, cons: [...opt.cons, newItem] };
        }
      }
      return opt;
    });

    onUpdateAnalysis(updated);
    setShowAddModal(null);
    setNewText('');
    setNewImpact(3);
  };

  const handleRemoveFactor = (
    optionId: string,
    type: 'pro' | 'con',
    factorId: string
  ) => {
    const updated = optionsAnalysis.map((opt) => {
      if (opt.optionId === optionId) {
        if (type === 'pro') {
          return { ...opt, pros: opt.pros.filter((p) => p.id !== factorId) };
        } else {
          return { ...opt, cons: opt.cons.filter((c) => c.id !== factorId) };
        }
      }
      return opt;
    });
    onUpdateAnalysis(updated);
  };

  if (!activeOption) {
    return (
      <div className="p-8 text-center text-white/40 font-mono text-xs uppercase">
        No options to display.
      </div>
    );
  }

  // Calculate Net balance score for this option
  const totalProsScore = activeOption.pros.reduce((acc, p) => acc + p.impact, 0);
  const totalConsScore = activeOption.cons.reduce((acc, c) => acc + c.impact, 0);
  const netBalance = totalProsScore - totalConsScore;

  return (
    <div className="space-y-6">
      {/* Option Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121212] p-4 border border-white/15">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#D4FF00]" />
          <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#D4FF00] font-bold">
            Inspecting Alternative:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {optionsAnalysis.map((opt) => {
            const isSelected = opt.optionId === selectedOptionId;
            return (
              <button
                key={opt.optionId}
                id={`btn-select-option-${opt.optionId}`}
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

      {/* Net Score Balance Bar */}
      <div className="bg-[#121212] border border-white/15 p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
            Alternative Evaluation
          </span>
          <h3 className="text-xl font-bold uppercase text-white font-mono">
            {activeOption.optionName}
          </h3>
        </div>

        <div className="flex items-center gap-6 font-mono">
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-widest text-[#D4FF00] block">
              Pros Weight (+{totalProsScore})
            </span>
            <span className="text-xs text-white/60">
              {activeOption.pros.length} items
            </span>
          </div>

          <div className="text-right">
            <span className="text-[9px] uppercase tracking-widest text-red-400 block">
              Cons Weight (-{totalConsScore})
            </span>
            <span className="text-xs text-white/60">
              {activeOption.cons.length} items
            </span>
          </div>

          <div className="border-l border-white/20 pl-4 text-right">
            <span className="text-[9px] uppercase tracking-widest text-white/40 block">
              Net Balance
            </span>
            <span
              className={`text-xl font-black ${
                netBalance > 0
                  ? 'text-[#D4FF00]'
                  : netBalance < 0
                  ? 'text-red-400'
                  : 'text-white'
              }`}
            >
              {netBalance > 0 ? `+${netBalance}` : netBalance}
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Pros & Cons Columns (Design Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PROS COLUMN */}
        <div className="bg-[#121212] border border-white/15 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#D4FF00]" />
                <h4 className="text-xs uppercase font-mono tracking-[0.2em] font-bold text-[#D4FF00]">
                  PROS ({activeOption.pros.length})
                </h4>
              </div>

              <button
                type="button"
                id="btn-add-pro"
                onClick={() =>
                  setShowAddModal({ optionId: activeOption.optionId, type: 'pro' })
                }
                className="text-[10px] font-black font-mono uppercase tracking-widest text-[#D4FF00] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Pro
              </button>
            </div>

            <ul className="space-y-3">
              {activeOption.pros.map((p) => (
                <li
                  key={p.id}
                  className="bg-[#080808] border border-white/10 p-3.5 flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#D4FF00] font-mono font-bold">—</span>
                      <span className="text-xs font-bold text-white">
                        {p.text}
                      </span>
                    </div>
                    {p.explanation && (
                      <p className="text-[11px] text-white/60 pl-4 font-mono">
                        {p.explanation}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono font-black text-black bg-[#D4FF00] px-1.5 py-0.5">
                      +{p.impact}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveFactor(activeOption.optionId, 'pro', p.id)
                      }
                      className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              ))}

              {activeOption.pros.length === 0 && (
                <li className="text-xs text-white/40 italic py-4 text-center font-mono">
                  No pros identified yet.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* CONS COLUMN */}
        <div className="bg-[#121212] border border-white/15 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-red-500" />
                <h4 className="text-xs uppercase font-mono tracking-[0.2em] font-bold text-red-400">
                  CONS ({activeOption.cons.length})
                </h4>
              </div>

              <button
                type="button"
                id="btn-add-con"
                onClick={() =>
                  setShowAddModal({ optionId: activeOption.optionId, type: 'con' })
                }
                className="text-[10px] font-black font-mono uppercase tracking-widest text-red-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Con
              </button>
            </div>

            <ul className="space-y-3">
              {activeOption.cons.map((c) => (
                <li
                  key={c.id}
                  className="bg-[#080808] border border-white/10 p-3.5 flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 font-mono font-bold">—</span>
                      <span className="text-xs font-bold text-white">
                        {c.text}
                      </span>
                    </div>
                    {c.explanation && (
                      <p className="text-[11px] text-white/60 pl-4 font-mono">
                        {c.explanation}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono font-black text-white bg-red-600 px-1.5 py-0.5">
                      -{c.impact}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveFactor(activeOption.optionId, 'con', c.id)
                      }
                      className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              ))}

              {activeOption.cons.length === 0 && (
                <li className="text-xs text-white/40 italic py-4 text-center font-mono">
                  No cons identified yet.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Add Factor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-white/20 p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 ${
                    showAddModal.type === 'pro' ? 'bg-[#D4FF00]' : 'bg-red-500'
                  }`}
                />
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
                  Add {showAddModal.type === 'pro' ? 'Pro (+)' : 'Con (-)'} Factor
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(null)}
                className="text-white/40 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFactor} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-white/60 mb-1">
                  Factor Description
                </label>
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="e.g. Higher commute time or Accelerated equity vesting"
                  className="w-full bg-[#080808] border border-white/20 p-3 text-xs text-white focus:border-[#D4FF00] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-white/60 mb-1">
                  Impact Weight: {newImpact} / 5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={newImpact}
                  onChange={(e) => setNewImpact(Number(e.target.value))}
                  className="w-full accent-[#D4FF00]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(null)}
                  className="px-4 py-2 text-xs font-mono uppercase tracking-widest text-white/60 hover:text-white border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-mono font-black uppercase tracking-widest bg-white text-black hover:bg-[#D4FF00] transition-colors"
                >
                  Append Factor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
