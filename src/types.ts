export interface DecisionOption {
  id: string;
  name: string;
  description?: string;
  tagline?: string;
}

export interface ProConItem {
  id: string;
  text: string;
  category: 'Financial' | 'Career' | 'Lifestyle' | 'Emotional' | 'Risk' | 'Effort' | 'Health' | 'General';
  impact: number; // 1 to 5
  explanation?: string;
}

export interface OptionAnalysis {
  optionId: string;
  optionName: string;
  pros: ProConItem[];
  cons: ProConItem[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  netScore?: number;
}

export interface EvaluationCriterion {
  id: string;
  name: string;
  description: string;
  weight: number; // 1 to 5
  scores: Record<string, number>; // optionId -> score 1-10
  rationales: Record<string, string>; // optionId -> rationale
}

export interface Blindspot {
  title: string;
  risk: string;
  mitigation: string;
}

export interface TiebreakerVerdict {
  winnerId: string;
  winnerName: string;
  confidenceScore: number; // 0-100
  summary: string;
  theDecidingFactor: string;
  criticalTradeoff: string;
  recommendedActionPlan: string[];
  pivotTriggers: {
    condition: string;
    alternativeChoice: string;
  }[];
}

export interface DecisionAnalysisResult {
  id: string;
  createdAt: string;
  title: string;
  context: string;
  priorities: string[];
  options: DecisionOption[];
  optionsAnalysis: OptionAnalysis[];
  criteria: EvaluationCriterion[];
  swotOverview?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  verdict: TiebreakerVerdict;
  blindspots: Blindspot[];
  userChosenOptionId?: string;
  notes?: string;
}

export interface DecisionPreset {
  id: string;
  title: string;
  icon: string;
  category: string;
  dilemma: string;
  options: string[];
  priorities: string;
}
