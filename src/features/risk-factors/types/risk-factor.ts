export interface RiskFactor {
  id: string;
  transactionId: string;
  name: string;
  category: 'Transaction' | 'Device' | 'Behavioral' | 'Merchant' | 'Geographic';
  explanation: string;
  observedValue: string;
  expectedBaseline: string;
  contribution: number;
  direction: 'increase' | 'decrease';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}
