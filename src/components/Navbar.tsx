import React from 'react';
import { Scale, Bookmark, PlusCircle, RotateCcw, Share2, Terminal } from 'lucide-react';

interface NavbarProps {
  onNewDecision: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  hasActiveDecision: boolean;
  onExport: () => void;
  onResetToPresets: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewDecision,
  onOpenHistory,
  historyCount,
  hasActiveDecision,
  onExport,
  onResetToPresets,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#080808]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Bold Monogram */}
        <div 
          onClick={onNewDecision}
          className="flex items-center gap-3.5 cursor-pointer group"
          id="navbar-brand-button"
        >
          <div className="w-10 h-10 bg-[#D4FF00] text-black flex items-center justify-center font-black text-xl transition-transform duration-150 group-hover:scale-105">
            TB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-xl tracking-tighter uppercase">
                The Tiebreaker
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#D4FF00] bg-[#D4FF00]/10 px-2 py-0.5 border border-[#D4FF00]/30 hidden sm:inline-block">
                AI Engine
              </span>
            </div>
            <p className="text-[10px] uppercase font-mono tracking-[0.25em] text-white/40 hidden md:block">
              Clarity over paralysis • Multi-Vector Evaluation
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasActiveDecision && (
            <>
              <button
                id="navbar-export-button"
                onClick={onExport}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/20 px-3.5 py-2.5 transition-colors cursor-pointer"
                title="Export or Print Analysis"
              >
                <Share2 className="w-3.5 h-3.5 text-[#D4FF00]" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                id="navbar-new-decision-button"
                onClick={onNewDecision}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black bg-white hover:bg-[#D4FF00] px-4 py-2.5 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Query</span>
              </button>
            </>
          )}

          {!hasActiveDecision && (
            <button
              id="navbar-explore-presets-button"
              onClick={onResetToPresets}
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/70 hover:text-[#D4FF00] bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Presets</span>
            </button>
          )}

          <button
            id="navbar-history-button"
            onClick={onOpenHistory}
            className="relative inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/20 px-3.5 py-2.5 transition-colors cursor-pointer"
            title="Saved Decisions History"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#D4FF00]" />
            <span className="hidden sm:inline">Saved</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono font-black text-black bg-[#D4FF00]">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
