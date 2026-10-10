export interface RiskHistoryRecord {
  id: string;
  evaluationId: string;
  transactionId: string;
  timestamp: string;
  previousScore: number | null;
  currentScore: number;
  scoreChange: number | null;
  previousRiskLevel: string | null;
  currentRiskLevel: string;
  modelVersion: string;
  featureSetVersion: string;
  signalVersions: string;
  thresholdVersion: string;
  evaluationStatus: 'SUCCESS' | 'ERROR' | 'FALLBACK';
  failureReason?: string;
  evaluationLatencyMs?: number;
}
