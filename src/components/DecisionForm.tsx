import React, { useState } from 'react';
import { ArrowRight, Wand2, Lightbulb, CheckCircle2, Sliders, Layers, AlertCircle, Sparkles, Plus, Trash2 } from 'lucide-react';
import { DECISION_PRESETS } from '../data/presets';
import { DecisionPreset } from '../types';

interface DecisionFormProps {
  onAnalyze: (payload: {
    title: string;
    context: string;
    options: { name: string; description: string }[];
    priorities: string[];
    userConstraints: string;
  }) => Promise<void>;
  isLoading: boolean;
  loadingStep: string;
}

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onAnalyze,
  isLoading,
  loadingStep,
}) => {
  const [mode, setMode] = useState<'quick' | 'structured'>('quick');
  const [dilemmaText, setDilemmaText] = useState('');
  
  // Structured fields
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [options, setOptions] = useState<Array<{ name: string; description: string }>>([
    { name: '', description: '' },
    { name: '', description: '' }
  ]);
  const [prioritiesText, setPrioritiesText] = useState('');
  const [constraintsText, setConstraintsText] = useState('');
  const [isBrainstorming, setIsBrainstorming] = useState(false);
  const [brainstormError, setBrainstormError] = useState<string | null>(null);

  const handleApplyPreset = (preset: DecisionPreset) => {
    setTitle(preset.title);
    setContext(preset.dilemma);
    setDilemmaText(preset.dilemma);
    setOptions(
      preset.options.map((opt) => {
        const parts = opt.split(': ');
        return {
          name: parts[0] || opt,
          description: parts[1] || ''
        };
      })
    );
    setPrioritiesText(preset.priorities);
    setMode('structured');
  };

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, { name: '', description: '' }]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, idx) => idx !== index));
    }
  };

  const handleOptionChange = (index: number, field: 'name' | 'description', val: string) => {
    const next = [...options];
    next[index][field] = val;
    setOptions(next);
  };

  const handleAutoStructure = async () => {
    if (!dilemmaText.trim()) return;
    setIsBrainstorming(true);
    setBrainstormError(null);
    try {
      const res = await fetch('/api/brainstorm-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dilemma: dilemmaText, context }),
      });
      if (!res.ok) {
        throw new Error('Failed to brainstorm options');
      }
      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.refinedContext) setContext(data.refinedContext);
      if (data.options && data.options.length > 0) {
        setOptions(data.options.map((o: any) => ({ name: o.name, description: o.description || o.tagline || '' })));
      }
      if (data.suggestedPriorities && data.suggestedPriorities.length > 0) {
        setPrioritiesText(data.suggestedPriorities.join(', '));
      }
      setMode('structured');
    } catch (err: any) {
      console.error(err);
      setBrainstormError('Could not auto-extract. You can structure your options directly below.');
    } finally {
      setIsBrainstorming(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (mode === 'quick') {
      if (!dilemmaText.trim()) return;
      await onAnalyze({
        title: dilemmaText.slice(0, 80),
        context: dilemmaText,
        options: [],
        priorities: [],
        userConstraints: constraintsText
      });
    } else {
      const validOptions = options.filter(o => o.name.trim().length > 0);
      if (!title.trim() && validOptions.length === 0) return;

      const priorityList = prioritiesText
        .split(/[,;\n]/)
        .map(p => p.trim())
        .filter(Boolean);

      await onAnalyze({
        title: title.trim() || 'Decision Analysis',
        context: context.trim() || dilemmaText.trim(),
        options: validOptions.length >= 2 ? validOptions : options,
        priorities: priorityList,
        userConstraints: constraintsText.trim()
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Huge Display Hero Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#D4FF00]" />
          <span className="text-xs uppercase font-mono tracking-[0.3em] text-[#D4FF00] font-bold">
            Decision Protocol TB-9921
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-none">
          Break The <span className="text-[#D4FF00]">Tie</span>.
        </h1>

        <p className="text-sm sm:text-base text-white/60 font-medium max-w-2xl leading-relaxed">
          Provide your dilemma. The engine deconstructs every angle through structured Pros & Cons, weighted matrix mathematics, and SWOT analysis.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          type="button"
          id="tab-mode-quick"
          onClick={() => setMode('quick')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
            mode === 'quick'
              ? 'bg-[#D4FF00] text-black'
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          Natural Query Mode
        </button>

        <button
          type="button"
          id="tab-mode-structured"
          onClick={() => setMode('structured')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
            mode === 'structured'
              ? 'bg-[#D4FF00] text-black'
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Multi-Option Matrix Mode
        </button>
      </div>

      {/* Main Form Box */}
      <form onSubmit={handleSubmit} className="bg-[#121212] border border-white/15 p-6 sm:p-8 space-y-6">
        {mode === 'quick' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-mono tracking-[0.4em] text-[#D4FF00] font-bold block">
                Active Dilemma Query
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                Natural Language Input
              </span>
            </div>

            <textarea
              id="dilemma-input"
              rows={4}
              value={dilemmaText}
              onChange={(e) => setDilemmaText(e.target.value)}
              placeholder="e.g. Should I accept Offer A ($170k, Series A startup, hybrid 3d/wk) or Offer B ($195k, public company, remote, structured)? We value career upside and work-life balance..."
              className="w-full bg-[#080808] border border-white/20 p-4 text-base text-white placeholder:text-white/30 focus:border-[#D4FF00] focus:outline-none transition-all font-sans"
              required
            />

            {/* Smart assist helper */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <span className="text-xs text-white/50 flex items-center gap-2 font-mono">
                <span className="w-2 h-2 bg-[#D4FF00]" />
                Include constraints, compensation, locations, or timeline deadlines.
              </span>

              {dilemmaText.trim().length > 15 && (
                <button
                  type="button"
                  id="btn-auto-structure"
                  onClick={handleAutoStructure}
                  disabled={isBrainstorming}
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#D4FF00] bg-[#D4FF00]/10 hover:bg-[#D4FF00]/20 px-4 py-2 border border-[#D4FF00]/40 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isBrainstorming ? 'Deconstructing...' : 'Auto-Extract Options'}
                </button>
              )}
            </div>

            {brainstormError && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                {brainstormError}
              </p>
            )}
          </div>
        ) : (
          /* Structured Mode */
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="structured-title" className="block text-[10px] font-mono uppercase font-bold tracking-[0.25em] text-[#D4FF00] mb-2">
                  Decision Title / Core Dilemma
                </label>
                <input
                  id="structured-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Relocate to Berlin for Senior Design Lead role vs Stay in London"
                  className="w-full bg-[#080808] border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#D4FF00] focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="structured-context" className="block text-[10px] font-mono uppercase font-bold tracking-[0.25em] text-white/60 mb-2">
                  Background Context & Stakes (Optional)
                </label>
                <textarea
                  id="structured-context"
                  rows={2}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. Decision deadline in 5 days. Relocation package included."
                  className="w-full bg-[#080808] border border-white/20 px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#D4FF00] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Options List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase font-bold tracking-[0.25em] text-[#D4FF00] flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-[#D4FF00]" />
                  Candidate Alternatives (Min 2, Max 5)
                </span>
                {options.length < 5 && (
                  <button
                    type="button"
                    id="btn-add-option"
                    onClick={handleAddOption}
                    className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#D4FF00] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Alternative
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {options.map((opt, index) => (
                  <div
                    key={index}
                    className="bg-[#080808] border border-white/15 p-4 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-6 h-6 bg-[#D4FF00] text-black text-xs font-black flex items-center justify-center font-mono">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <input
                          type="text"
                          id={`option-${index}-name`}
                          value={opt.name}
                          onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + index)} Name (e.g. Relocate to Berlin)`}
                          className="font-bold text-sm text-white bg-transparent border-b border-white/20 focus:border-[#D4FF00] focus:outline-none px-1 py-1 flex-1"
                          required
                        />
                      </div>
                      {options.length > 2 && (
                        <button
                          type="button"
                          id={`btn-remove-option-${index}`}
                          onClick={() => handleRemoveOption(index)}
                          className="text-white/40 hover:text-red-400 p-1 transition-colors"
                          title="Remove option"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      id={`option-${index}-desc`}
                      value={opt.description}
                      onChange={(e) => handleOptionChange(index, 'description', e.target.value)}
                      placeholder="Key details (e.g. 30% salary bump, European hub access, relocation support)"
                      className="w-full text-xs text-white/70 bg-white/5 border border-white/10 px-3 py-2 placeholder:text-white/30 focus:border-[#D4FF00] focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Priorities & Constraints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="structured-priorities" className="block text-[10px] font-mono uppercase font-bold tracking-[0.25em] text-[#D4FF00] mb-2">
                  Key Priorities / Decision Criteria
                </label>
                <input
                  id="structured-priorities"
                  type="text"
                  value={prioritiesText}
                  onChange={(e) => setPrioritiesText(e.target.value)}
                  placeholder="e.g. Net income growth, Culture, Commute, Career trajectory"
                  className="w-full bg-[#080808] border border-white/20 px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#D4FF00] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="structured-constraints" className="block text-[10px] font-mono uppercase font-bold tracking-[0.25em] text-white/60 mb-2">
                  Hard Constraints / Dealbreakers
                </label>
                <input
                  id="structured-constraints"
                  type="text"
                  value={constraintsText}
                  onChange={(e) => setConstraintsText(e.target.value)}
                  placeholder="e.g. Minimum $160k net, max 30min commute"
                  className="w-full bg-[#080808] border border-white/20 px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#D4FF00] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit & Status Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
              Output: Pros/Cons • SWOT • Weighted Score • Verdict
            </span>
          </div>

          <button
            type="submit"
            id="btn-run-analysis"
            disabled={isLoading || (mode === 'quick' && !dilemmaText.trim()) || (mode === 'structured' && !title.trim())}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-black font-black uppercase text-xs tracking-widest px-8 py-4 hover:bg-[#D4FF00] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black animate-spin" />
                <span>{loadingStep || 'Executing Analysis...'}</span>
              </>
            ) : (
              <>
                <span>Execute Tiebreaker Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Library Grid */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#D4FF00]" />
            <h3 className="text-xs uppercase font-mono tracking-[0.3em] text-white/80 font-bold">
              Standard Decision Presets
            </h3>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            Select to Load
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {DECISION_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              id={`preset-card-${preset.id}`}
              className="p-5 bg-[#121212] border border-white/10 hover:border-[#D4FF00] hover:bg-[#181818] cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4FF00]">
                  {preset.category}
                </span>
                <span className="text-white/20 group-hover:text-[#D4FF00] transition-colors">→</span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-[#D4FF00] transition-colors leading-snug line-clamp-2">
                {preset.title}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
