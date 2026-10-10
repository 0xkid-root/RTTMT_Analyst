import { RiskFactor } from '../types/risk-factor';
import { mockMaliTransactions } from '../../mali/data/mockMaliTransactions';

export const mockRiskFactors: RiskFactor[] = mockMaliTransactions.flatMap((t, tIndex) => {
  return t.contributingFeatures.map((f, fIndex) => {
    let category: RiskFactor['category'] = 'Transaction';
    const nameLower = f.name.toLowerCase();
    
    if (nameLower.includes('location') || nameLower.includes('distance') || nameLower.includes('ip')) {
      category = 'Geographic';
    } else if (nameLower.includes('device') || nameLower.includes('browser')) {
      category = 'Device';
    } else if (nameLower.includes('velocity') || nameLower.includes('time')) {
      category = 'Behavioral';
    } else if (nameLower.includes('merchant')) {
      category = 'Merchant';
    }
    
    return {
      id: `RF-${t.id}-${fIndex}`,
      transactionId: t.id,
      name: f.name,
      category,
      explanation: f.explanation,
      observedValue: f.observedValue,
      expectedBaseline: f.expectedBaseline,
      contribution: f.contribution,
      direction: f.direction,
      severity: f.severity,
      timestamp: t.evaluationTimestamp,
    };
  });
});
