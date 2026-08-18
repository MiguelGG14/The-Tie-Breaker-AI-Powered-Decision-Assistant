import React, { useState } from 'react';
import { Dice5, Sparkles, RefreshCw, Smile, Frown, Meh, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DecisionOption } from '../types';

interface GutCheckSimulatorProps {
  options: DecisionOption[];
  onSelectOption: (optionId: string) => void;
}

export const GutCheckSimulator: React.FC<GutCheckSimulatorProps> = ({
  options,
  onSelectOption,
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [revealedOption, setRevealedOption] = useState<DecisionOption | null>(null);
  const [reaction, setReaction] = useState<'relieved' | 'disappointed' | 'neutral' | null>(null);

  const handleTriggerFlip = () => {
    setIsFlipping(true);
    setRevealedOption(null);
    setReaction(null);

    // Simulate psychological spin
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * options.length);
      const chosen = options[randomIndex];
      setRevealedOption(chosen);
      setIsFlipping(false);
    }, 1200);
  };

  const handleReaction = (type: 'relieved' | 'disappointed' | 'neutral') => {
    setReaction(type);
    if (type === 'relieved' && revealedOption) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4FF00', '#FFFFFF', '#080808']
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#121212] border border-white/15 p-6 sm:p-8 space-y-6 text-center">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4FF00]/10 border border-[#D4FF00]/30 text-[#D4FF00] text-xs font-mono font-bold uppercase tracking-widest mb-1">
          <div className="w-2 h-2 bg-[#D4FF00]" />
          Subconscious Gut-Check Protocol
        </div>
        <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
          Test Your Intuition
        </h3>
        <p className="text-xs text-white/50 max-w-md mx-auto font-mono leading-relaxed">
          When an outcome is forced at random, notice your immediate bodily response. Your subconscious often knows before your logic rationalizes.
        </p>
      </div>

      {/* Simulator Spinner Card */}
      <div className="py-8 px-4 bg-[#080808] border border-white/10 flex flex-col items-center justify-center relative">
        {!revealedOption && !isFlipping && (
          <div className="space-y-4">
            <div className="w-20 h-20 bg-[#D4FF00] text-black flex items-center justify-center shadow-lg mx-auto font-black text-2xl">
              TB
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-white">
                Ready to trigger the digital coin toss?
              </p>
              <p className="text-xs text-white/40 font-mono mt-1">
                Comparing {options.length} alternatives: {options.map((o) => o.name).join(' vs ')}
              </p>
            </div>
            <button
              type="button"
              id="btn-spin-tiebreaker"
              onClick={handleTriggerFlip}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#D4FF00] text-black text-xs font-black uppercase tracking-widest px-8 py-3.5 transition-colors cursor-pointer"
            >
              <Dice5 className="w-4 h-4" />
              Flip The Tiebreaker
            </button>
          </div>
        )}

        {isFlipping && (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 border-4 border-white/20 border-t-[#D4FF00] animate-spin mx-auto" />
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4FF00] animate-pulse">
              Flipping fate... Watch your immediate reaction!
            </p>
          </div>
        )}

        {revealedOption && !isFlipping && (
          <div className="space-y-5 w-full max-w-md">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#D4FF00] block">
              Randomly Selected:
            </span>
            <div className="bg-[#121212] p-5 border border-[#D4FF00]">
              <h4 className="text-2xl font-black uppercase text-white tracking-tight">
                {revealedOption.name}
              </h4>
              {revealedOption.description && (
                <p className="text-xs text-white/60 mt-1 font-mono">
                  {revealedOption.description}
                </p>
              )}
            </div>

            {/* Reaction Buttons */}
            <div className="pt-2">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-3">
                How did you feel the very second this appeared?
              </p>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  id="btn-reaction-relieved"
                  onClick={() => handleReaction('relieved')}
                  className={`p-3 border text-xs font-mono font-bold uppercase transition-all ${
                    reaction === 'relieved'
                      ? 'bg-[#D4FF00] text-black border-[#D4FF00]'
                      : 'bg-[#121212] text-white/80 border-white/10 hover:border-[#D4FF00]'
                  }`}
                >
                  <Smile className="w-5 h-5 mx-auto mb-1" />
                  <span>Relieved</span>
                </button>

                <button
                  type="button"
                  id="btn-reaction-disappointed"
                  onClick={() => handleReaction('disappointed')}
                  className={`p-3 border text-xs font-mono font-bold uppercase transition-all ${
                    reaction === 'disappointed'
                      ? 'bg-red-600 text-white border-red-500'
                      : 'bg-[#121212] text-white/80 border-white/10 hover:border-red-500'
                  }`}
                >
                  <Frown className="w-5 h-5 mx-auto mb-1" />
                  <span>Dismayed</span>
                </button>

                <button
                  type="button"
                  id="btn-reaction-neutral"
                  onClick={() => handleReaction('neutral')}
                  className={`p-3 border text-xs font-mono font-bold uppercase transition-all ${
                    reaction === 'neutral'
                      ? 'bg-white text-black border-white'
                      : 'bg-[#121212] text-white/80 border-white/10 hover:border-white'
                  }`}
                >
                  <Meh className="w-5 h-5 mx-auto mb-1" />
                  <span>Neutral</span>
                </button>
              </div>
            </div>

            {/* Reaction Feedback Interpretation */}
            {reaction && (
              <div className="bg-[#121212] p-4 border border-white/15 text-left space-y-2">
                {reaction === 'relieved' && (
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-[#D4FF00] block mb-1">
                      💡 Intuitive Alignment Confirmed
                    </span>
                    <p className="text-xs text-white/80 leading-relaxed font-mono">
                      Your immediate sense of relief indicates that <strong>{revealedOption.name}</strong> is what you genuinely desire. Trust this internal signal!
                    </p>
                    <button
                      type="button"
                      onClick={() => onSelectOption(revealedOption.id)}
                      className="mt-3 inline-flex items-center gap-2 bg-[#D4FF00] text-black text-xs font-mono font-black uppercase tracking-widest px-4 py-2"
                    >
                      <span>Commit to {revealedOption.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {reaction === 'disappointed' && (
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-red-400 block mb-1">
                      💡 Secret Preference Revealed
                    </span>
                    <p className="text-xs text-white/80 leading-relaxed font-mono">
                      Your feeling of disappointment when {revealedOption.name} was picked indicates your subconscious was rooting for the alternative option.
                    </p>
                  </div>
                )}

                {reaction === 'neutral' && (
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-white block mb-1">
                      💡 Fully Rational Decision
                    </span>
                    <p className="text-xs text-white/80 leading-relaxed font-mono">
                      Your emotional neutrality means both options hold equal subjective appeal. Rely firmly on the Weighted Comparison Matrix.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={handleTriggerFlip}
                className="text-xs font-mono uppercase tracking-widest text-white/40 hover:text-[#D4FF00] inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Flip Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
