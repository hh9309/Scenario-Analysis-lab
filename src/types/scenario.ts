/**
 * Types for Scenario Analysis & Future Evolution Lab
 */

export type PestelCategory = 'P' | 'E' | 'S' | 'T' | 'En' | 'L';

export interface DriverFactor {
  id: string;
  name: string;
  category: PestelCategory;
  categoryLabel: string;
  impact: number; // 1 - 10
  uncertainty: number; // 1 - 10
  description: string;
  isKeyAxisCandidate?: boolean;
  predeterminedTrend?: boolean; // 高影响但低不确定性，如人口老龄化
  currentStatus: string;
  sourceOrTrend: string;
}

export interface AxisDefinition {
  id: string;
  name: string;
  negativeLabel: string;
  positiveLabel: string;
  negativeDescription: string;
  positiveDescription: string;
  category: PestelCategory;
}

export interface StrategicMaturityMetric {
  dimension: string;
  score: number; // 0 - 100
  benchmark: number; // 0 - 100 industry baseline
  description: string;
}

export interface ScenarioQuadrant {
  id: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  title: string;
  subTitle: string;
  xState: 'pos' | 'neg';
  yState: 'pos' | 'neg';
  tagline: string;
  worldNarrative: string;
  characteristics: string[];
  winners: string[];
  losers: string[];
  earlyWarningSignals: string[];
  strategicImperatives: string[];
  color: string;
  accentBg: string;
  maturityScores?: StrategicMaturityMetric[];
}

export interface CibVariableState {
  id: string;
  label: string;
  description: string;
}

export interface CibVariable {
  id: string;
  name: string;
  category: string;
  states: [CibVariableState, CibVariableState]; // Two binary states
}

export interface CibImpact {
  sourceVarId: string;
  sourceStateId: string;
  targetVarId: string;
  targetStateId: string;
  weight: number; // -3 to +3
}

export interface CibConfiguration {
  id: string;
  stateAssignments: Record<string, string>; // varId -> stateId
  isConsistent: boolean;
  totalScore: number;
  unresolvedContradictions: string[];
}

export interface BenchmarkCase {
  id: string;
  numberTag: string;
  title: string;
  methodTag: string;
  organization: string;
  summary: string;
  background: string;
  axisX?: AxisDefinition;
  axisY?: AxisDefinition;
  quadrants?: ScenarioQuadrant[];
  morphologyTable?: {
    dimension: string;
    options: string[];
    selectedRoute: number;
  }[];
  cibVariables?: CibVariable[];
  tiaEvents?: {
    event: string;
    probability: number;
    year: number;
    impactDelta: string;
  }[];
  robustnessStrategy?: {
    strategyName: string;
    scoresInScenarios: number[]; // Scores in Q1, Q2, Q3, Q4 (1-10)
    hedgingCost: string;
    recommendedAction: string;
  }[];
  takeaways: string[];
}

export interface HistoryMilestone {
  era: string;
  yearRange: string;
  title: string;
  keyFigure: string;
  institution: string;
  coreContribution: string;
  breakthrough: string;
  caseStudy: string;
}

export interface ScenarioSchool {
  name: string;
  enName: string;
  origin: string;
  representative: string;
  coreEpistemology: string;
  methodLogic: string;
  pros: string;
  cons: string;
  typicalUse: string;
}

export interface KnowledgeSlice {
  id: string;
  title: string;
  subTitle: string;
  tag: string;
  coreThesis: string;
  comparisonTable?: {
    dimension: string;
    itemA: string;
    itemB: string;
  }[];
  trapsAndAntidotes?: {
    trap: string;
    symptom: string;
    antidote: string;
  }[];
  axioms: string[];
  visualSchematic?: string;
}
