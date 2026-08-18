import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DecisionForm } from './components/DecisionForm';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { HistoryModal } from './components/HistoryModal';
import { ExportModal } from './components/ExportModal';
import { DecisionAnalysisResult } from './types';
import { getSavedDecisions, saveDecision, deleteDecision } from './utils/storage';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [activeDecision, setActiveDecision] = useState<DecisionAnalysisResult | null>(null);
  const [savedDecisions, setSavedDecisions] = useState<DecisionAnalysisResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load saved history on mount
  useEffect(() => {
    const list = getSavedDecisions();
    setSavedDecisions(list);
  }, []);

  const handleAnalyze = async (payload: {
    title: string;
    context: string;
    options: { name: string; description: string }[];
    priorities: string[];
    userConstraints: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep('Evaluating decision dynamics...');

    const stepTimer1 = setTimeout(() => setLoadingStep('Analyzing Pros, Cons & Trade-offs...'), 1400);
    const stepTimer2 = setTimeout(() => setLoadingStep('Building Weighted Comparison Matrix...'), 3200);
    const stepTimer3 = setTimeout(() => setLoadingStep('Generating SWOT Matrix & Blindspots...'), 5000);
    const stepTimer4 = setTimeout(() => setLoadingStep('Determining The Tiebreaker Verdict...'), 6800);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Analysis failed (${response.status})`);
      }

      const result: DecisionAnalysisResult = await response.json();
      setActiveDecision(result);
      saveDecision(result);
      setSavedDecisions(getSavedDecisions());
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to complete analysis. Please check your inputs and try again.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      clearTimeout(stepTimer4);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleUpdateDecision = (updated: DecisionAnalysisResult) => {
    setActiveDecision(updated);
    saveDecision(updated);
    setSavedDecisions(getSavedDecisions());
  };

  const handleDeleteDecision = (id: string) => {
    const remaining = deleteDecision(id);
    setSavedDecisions(remaining);
    if (activeDecision?.id === id) {
      setActiveDecision(null);
    }
  };

  const handleSelectDecision = (decision: DecisionAnalysisResult) => {
    setActiveDecision(decision);
  };

  const handleNewDecision = () => {
    setActiveDecision(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col font-sans selection:bg-[#D4FF00] selection:text-black">
      {/* Top Navbar */}
      <Navbar
        onNewDecision={handleNewDecision}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={savedDecisions.length}
        hasActiveDecision={Boolean(activeDecision)}
        onExport={() => setIsExportOpen(true)}
        onResetToPresets={() => setActiveDecision(null)}
      />

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto mt-4 px-4 w-full">
          <div className="bg-red-950/60 border border-red-500/40 text-red-300 p-4 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-white font-bold ml-2 uppercase tracking-widest text-[10px]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1">
        {activeDecision ? (
          <AnalysisDashboard
            decision={activeDecision}
            onUpdateDecision={handleUpdateDecision}
            onBackToEdit={() => setActiveDecision(null)}
            onOpenExport={() => setIsExportOpen(true)}
          />
        ) : (
          <DecisionForm
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            loadingStep={loadingStep}
          />
        )}
      </main>

      {/* Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={handleSelectDecision}
        onDeleteDecision={handleDeleteDecision}
      />

      {activeDecision && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          decision={activeDecision}
        />
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 text-xs font-mono text-white/40 bg-[#080808] print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#D4FF00]" />
            <p className="uppercase tracking-[0.2em]">
              <strong>The Tiebreaker</strong> • High-Impact AI Decision Engine
            </p>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-white/30">
            Engine Version 2.4 • Obsidian & Volt Edition
          </p>
        </div>
      </footer>
    </div>
  );
}
