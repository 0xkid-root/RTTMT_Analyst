export interface RiskOverviewSummary {
  totalEvaluations: number;
  highRiskPercentage: number;
  failureRate: number;
  currentModelVersion: string;
  currentThresholdVersion: string;
}

export interface RiskDistributionData {
  totalTransactions: number;
  low: { count: number; percentage: number };
  medium: { count: number; percentage: number };
  high: { count: number; percentage: number };
  critical: { count: number; percentage: number };
}

export interface RiskTrendDataPoint {
  timestamp: string; // ISO or formatted date
  averageScore: number;
  highRiskPercentage: number;
}

export interface ScoringHealthData {
  successful: number;
  failed: number;
  averageLatencyMs: number;
  availabilityPercentage: number;
}

export interface ModelMetadata {
  modelName: string;
  modelVersion: string;
  featureSetVersion: string;
  signalVersions: string;
  thresholdVersion: string;
  effectiveDate: string;
  status: 'ACTIVE' | 'DEPRECATED' | 'TESTING';
}

export interface RiskOverviewData {
  summary: RiskOverviewSummary;
  distribution: RiskDistributionData;
  trends: RiskTrendDataPoint[];
  health: ScoringHealthData;
  modelMetadata: ModelMetadata;
}
