import { RiskOverviewData } from '../types/risk-overview';

export const mockRiskOverviewData: RiskOverviewData = {
  summary: {
    totalEvaluations: 124500,
    highRiskPercentage: 4.2,
    failureRate: 0.05,
    currentModelVersion: 'v2.4.1',
    currentThresholdVersion: 'v1.1.0'
  },
  distribution: {
    totalTransactions: 124500,
    low: { count: 104580, percentage: 84.0 },
    medium: { count: 14691, percentage: 11.8 },
    high: { count: 3984, percentage: 3.2 },
    critical: { count: 1245, percentage: 1.0 }
  },
  trends: Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return {
      timestamp: d.toISOString().split('T')[0],
      averageScore: 15 + Math.random() * 5,
      highRiskPercentage: 3.5 + Math.random() * 1.5
    };
  }),
  health: {
    successful: 124437,
    failed: 63,
    averageLatencyMs: 42,
    availabilityPercentage: 99.98
  },
  modelMetadata: {
    modelName: 'mali-transaction-risk',
    modelVersion: 'v2.4.1',
    featureSetVersion: 'v1.8.0',
    signalVersions: 'v3.2.0',
    thresholdVersion: 'v1.1.0',
    effectiveDate: new Date(Date.now() - 14 * 86400000).toISOString(),
    status: 'ACTIVE'
  }
};
