import { DecisionAnalysisResult } from '../types';

const STORAGE_KEY = 'the_tiebreaker_saved_decisions';

export function getSavedDecisions(): DecisionAnalysisResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved decisions', e);
    return [];
  }
}

export function saveDecision(decision: DecisionAnalysisResult): void {
  try {
    const current = getSavedDecisions();
    const existingIndex = current.findIndex((d) => d.id === decision.id);
    let updated: DecisionAnalysisResult[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = decision;
    } else {
      updated = [decision, ...current];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save decision', e);
  }
}

export function deleteDecision(id: string): DecisionAnalysisResult[] {
  try {
    const current = getSavedDecisions();
    const filtered = current.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    console.error('Failed to delete decision', e);
    return [];
  }
}
