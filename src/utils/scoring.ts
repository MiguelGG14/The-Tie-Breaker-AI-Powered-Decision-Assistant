import { EvaluationCriterion, OptionAnalysis } from '../types';

export function calculateWeightedScore(
  optionId: string,
  criteria: EvaluationCriterion[]
): { totalScore: number; maxPossible: number; percentage: number } {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const crit of criteria) {
    const weight = crit.weight || 1;
    const score = crit.scores[optionId] ?? 5;
    weightedSum += score * weight;
    totalWeight += weight * 10; // max score is 10
  }

  const totalScore = Math.round(weightedSum * 10) / 10;
  const maxPossible = totalWeight || 1;
  const percentage = Math.round((weightedSum / maxPossible) * 100);

  return { totalScore, maxPossible, percentage };
}

export function calculateProsConsBalance(analysis: OptionAnalysis): {
  prosScore: number;
  consScore: number;
  netScore: number;
} {
  const prosScore = (analysis.pros || []).reduce((acc, p) => acc + (p.impact || 3), 0);
  const consScore = (analysis.cons || []).reduce((acc, c) => acc + (c.impact || 3), 0);
  const netScore = prosScore - consScore;
  return { prosScore, consScore, netScore };
}
