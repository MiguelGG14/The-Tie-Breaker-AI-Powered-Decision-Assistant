import React, { useState } from 'react';
import { Bookmark, Trash2, Calendar, CheckCircle2, ChevronRight, X, Search, FileText } from 'lucide-react';
import { DecisionAnalysisResult } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: DecisionAnalysisResult[];
  onSelectDecision: (decision: DecisionAnalysisResult) => void;
  onDeleteDecision: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'decided' | 'pending'>('all');

  if (!isOpen) return null;

  const filtered = savedDecisions.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.context?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.verdict?.winnerName?.toLowerCase().includes(searchQuery.toLowerCase());

    const isDecided = Boolean(d.userChosenOptionId);
    if (filterMode === 'decided') return matchesSearch && isDecided;
    if (filterMode === 'pending') return matchesSearch && !isDecided;
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#121212] border border-white/20 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#D4FF00]" />
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-[0.25em] text-white">
                Stored Queries & Sessions
              </h3>
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                {savedDecisions.length} records stored locally
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/40 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-[#080808] border-b border-white/10 flex flex-col sm:flex-row gap-2 font-mono">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by dilemma title or winner..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-[#121212] border border-white/20 text-white focus:border-[#D4FF00] focus:outline-none"
            />
          </div>

          <div className="flex gap-1">
            {(['all', 'decided', 'pending'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setFilterMode(m)}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-colors ${
                  filterMode === m
                    ? 'bg-[#D4FF00] text-black'
                    : 'bg-[#121212] text-white/60 border border-white/10 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* List of Saved Items */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 font-mono">
          {filtered.map((d) => {
            const isDecided = Boolean(d.userChosenOptionId);
            const dateStr = new Date(d.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={d.id}
                className="bg-[#080808] border border-white/10 hover:border-[#D4FF00] p-4 transition-all flex items-start justify-between gap-3 group"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    onSelectDecision(d);
                    onClose();
                  }}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {isDecided ? (
                      <span className="text-[9px] font-bold text-black bg-[#D4FF00] px-2 py-0.5 uppercase tracking-widest">
                        ✓ Decided
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-[#D4FF00] bg-[#D4FF00]/10 border border-[#D4FF00]/30 px-2 py-0.5 uppercase tracking-widest">
                        In Review
                      </span>
                    )}

                    <span className="text-[10px] text-white/40">
                      {dateStr}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white font-sans group-hover:text-[#D4FF00] transition-colors leading-snug">
                    {d.title}
                  </h4>

                  <p className="text-xs text-white/50 mt-1 line-clamp-1">
                    Alternatives: {d.options.map((o) => o.name).join(' vs ')}
                  </p>

                  <div className="mt-2 text-xs text-white/80 flex items-center gap-2">
                    <span className="text-[#D4FF00] font-bold">Pick:</span>
                    <span>{d.verdict?.winnerName || 'N/A'}</span>
                    <span className="text-white/40">({d.verdict?.confidenceScore}% score)</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDecision(d.id);
                    }}
                    className="p-1.5 text-white/20 hover:text-red-400 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectDecision(d);
                      onClose();
                    }}
                    className="p-1.5 text-white/40 group-hover:text-[#D4FF00] transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-white/30">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-mono uppercase tracking-widest">No saved queries found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
