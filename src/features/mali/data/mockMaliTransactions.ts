import { MaliAnalysisResult } from '../types/mali';
import { mockHistoricalTransactions } from '../../monitor/data/mockTransactions';

export const mockMaliTransactions: MaliAnalysisResult[] = mockHistoricalTransactions.map((t, index) => {
  return {
    ...t,
    evaluationId: `EV-${t.id}-${Date.now()}`,
    evaluationTimestamp: new Date(new Date(t.timestamp).getTime() + 1000).toISOString(),
    modelName: 'mali-transaction-risk',
    modelVersion: 'v2.4.1',
    featureSetVersion: 'v1.8.0',
    signalVersions: 'v3.2.0',
    thresholdVersion: 'v1.1.0',
    executionStatus: 'SUCCESS',
    scoringStatus: 'COMPLETED',
    configuredThresholds: {
      low: 0,
      medium: 40,
      high: 60,
      critical: 80,
    },
    contributingFeatures: [
      {
        name: 'Velocity Check',
        explanation: 'Transaction volume in the last hour exceeded historical baseline.',
        observedValue: '3 txns / hr',
        expectedBaseline: '< 1 txn / hr',
        contribution: 15,
        direction: 'increase',
        severity: 'high'
      },
      {
        name: 'Location Mismatch',
        explanation: 'Distance from previous transaction is anomalously high.',
        observedValue: '500km',
        expectedBaseline: '< 50km',
        contribution: 10,
        direction: 'increase',
        severity: 'medium'
      },
      {
        name: 'Device Trust',
        explanation: 'Device history indicates a trusted profile.',
        observedValue: 'Trusted (30 days)',
        expectedBaseline: 'Trusted',
        contribution: 5,
        direction: 'decrease',
        severity: 'low'
      }
    ],
    supportingSignals: [
      {
        name: 'High Velocity IP',
        description: 'Multiple transactions from the same IP address across different accounts.',
        observedValue: '5 accounts / IP',
        severity: 'high',
        version: 'v1.2',
        contributedToScore: true,
      },
      {
        name: 'Unusual Time',
        description: 'Transaction occurred outside of typical user hours.',
        observedValue: '03:00 AM',
        severity: 'medium',
        version: 'v2.0',
        contributedToScore: false,
      }
    ],
    featureEvidence: [
      { label: 'Amount', value: `₹${t.amount}`, baseline: '₹10,000 avg' },
      { label: 'IP Address', value: t.ipAddress },
      { label: 'Device ID', value: t.deviceId },
      { label: 'Merchant Category', value: 'Electronics', isMissingData: false },
      { label: 'Card Present', value: 'N/A', isMissingData: true },
    ],
    previousEvaluations: index % 3 === 0 ? [
      {
        evaluationId: `EV-${t.id}-prev1`,
        timestamp: new Date(new Date(t.timestamp).getTime() - 86400000).toISOString(),
        maliScore: Math.max(0, t.maliScore - 15),
        riskLevel: 'LOW'
      },
      {
        evaluationId: `EV-${t.id}-prev2`,
        timestamp: new Date(new Date(t.timestamp).getTime() - 172800000).toISOString(),
        maliScore: Math.max(0, t.maliScore - 5),
        riskLevel: 'MEDIUM'
      }
    ] : [],
  };
});
