import { Transaction } from '../../monitor/types/transaction';

export interface ContributingFeature {
  name: string;
  explanation: string;
  observedValue: string;
  expectedBaseline: string;
  contribution: number;
  direction: 'increase' | 'decrease';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SupportingSignal {
  name: string;
  description: string;
  observedValue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  version: string;
  contributedToScore: boolean;
}

export interface FeatureEvidence {
  label: string;
  value: string;
  baseline?: string;
  isMissingData?: boolean;
}

export interface PreviousEvaluation {
  evaluationId: string;
  timestamp: string;
  maliScore: number;
  riskLevel: string;
}

export interface MaliAnalysisResult extends Transaction {
  evaluationId: string;
  evaluationTimestamp: string;
  modelName: string;
  modelVersion: string;
  featureSetVersion: string;
  signalVersions: string;
  thresholdVersion: string;
  executionStatus: 'SUCCESS' | 'FALLBACK' | 'ERROR';
  scoringStatus: 'COMPLETED' | 'PENDING' | 'FAILED';
  configuredThresholds: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  contributingFeatures: ContributingFeature[];
  supportingSignals: SupportingSignal[];
  featureEvidence: FeatureEvidence[];
  previousEvaluations: PreviousEvaluation[];
}
