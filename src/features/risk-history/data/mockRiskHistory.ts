import { RiskHistoryRecord } from '../types/risk-history';
import { mockMaliTransactions } from '../../mali/data/mockMaliTransactions';

export const mockRiskHistory: RiskHistoryRecord[] = [];

mockMaliTransactions.forEach(t => {
  // Generate 3-4 history records per transaction to form a timeline
  const baseTime = new Date(t.evaluationTimestamp).getTime();
  
  // Oldest record
  const oldestScore = Math.max(0, t.maliScore - 30);
  const oldestRiskLevel = oldestScore >= 80 ? 'CRITICAL' : oldestScore >= 60 ? 'HIGH' : oldestScore >= 40 ? 'MEDIUM' : 'LOW';
  
  mockRiskHistory.push({
    id: `HIST-${t.id}-1`,
    evaluationId: `EV-${t.id}-1`,
    transactionId: t.id,
    timestamp: new Date(baseTime - 86400000 * 3).toISOString(), // 3 days ago
    previousScore: null,
    currentScore: oldestScore,
    scoreChange: null,
    previousRiskLevel: null,
    currentRiskLevel: oldestRiskLevel,
    modelVersion: 'v2.3.0',
    featureSetVersion: 'v1.7.5',
    signalVersions: 'v3.1.0',
    thresholdVersion: 'v1.0.0',
    evaluationStatus: 'SUCCESS',
    evaluationLatencyMs: 145,
  });

  // Middle record
  const middleScore = Math.max(0, t.maliScore - 15);
  const middleRiskLevel = middleScore >= 80 ? 'CRITICAL' : middleScore >= 60 ? 'HIGH' : middleScore >= 40 ? 'MEDIUM' : 'LOW';
  
  mockRiskHistory.push({
    id: `HIST-${t.id}-2`,
    evaluationId: `EV-${t.id}-2`,
    transactionId: t.id,
    timestamp: new Date(baseTime - 86400000).toISOString(), // 1 day ago
    previousScore: oldestScore,
    currentScore: middleScore,
    scoreChange: middleScore - oldestScore,
    previousRiskLevel: oldestRiskLevel,
    currentRiskLevel: middleRiskLevel,
    modelVersion: 'v2.4.0',
    featureSetVersion: 'v1.8.0',
    signalVersions: 'v3.2.0',
    thresholdVersion: 'v1.1.0',
    evaluationStatus: 'SUCCESS',
    evaluationLatencyMs: 160,
  });

  // Current record
  mockRiskHistory.push({
    id: `HIST-${t.id}-3`,
    evaluationId: t.evaluationId,
    transactionId: t.id,
    timestamp: t.evaluationTimestamp,
    previousScore: middleScore,
    currentScore: t.maliScore,
    scoreChange: t.maliScore - middleScore,
    previousRiskLevel: middleRiskLevel,
    currentRiskLevel: t.riskLevel,
    modelVersion: t.modelVersion,
    featureSetVersion: t.featureSetVersion,
    signalVersions: t.signalVersions,
    thresholdVersion: t.thresholdVersion,
    evaluationStatus: t.executionStatus,
    failureReason: t.executionStatus === 'ERROR' ? 'Timeout reaching feature store' : undefined,
    evaluationLatencyMs: 210,
  });
});
