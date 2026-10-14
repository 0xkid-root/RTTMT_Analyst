export type SignalSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type SignalType = 
  | 'HIGH_VELOCITY'
  | 'UNUSUAL_AMOUNT'
  | 'NEW_DEVICE'
  | 'IP_RISK'
  | 'IMPOSSIBLE_TRAVEL'
  | 'MERCHANT_RISK'
  | 'OFF_HOURS_ACTIVITY'
  | 'GEO_MISMATCH';

export type RuleCategory = 
  | 'VELOCITY'
  | 'AMOUNT_ANOMALY'
  | 'DEVICE_INTELLIGENCE'
  | 'GEOLOCATION'
  | 'NETWORK_REPUTATION'
  | 'BEHAVIORAL';

export type ComparisonOperator = '>' | '>=' | '<' | '<=' | '==' | '!=' | 'IN' | 'CONTAINS';

export interface DetectionCondition {
  id: string;
  field: string;
  label: string;
  operator: ComparisonOperator;
  value: string | number | boolean;
  unit?: string;
  description?: string;
}

export interface RuleVersionHistory {
  version: string;
  date: string;
  author: string;
  changes: string;
}

export interface DetectionRule {
  id: string; // e.g. RUL-VEL-001
  name: string;
  category: RuleCategory;
  description: string;
  severity: SignalSeverity;
  enabled: boolean;
  version: string;
  lastUpdated: string; // ISO
  updatedBy: string;
  conditions: DetectionCondition[];
  logic: 'AND' | 'OR';
  actionSignalType: SignalType;
  stats: {
    hits24h: number;
    hits7d: number;
    falsePositiveRate: number; // percentage, e.g. 1.8
    avgLatencyMs: number; // e.g. 3.4
  };
  history: RuleVersionHistory[];
  exampleEvidence: string[];
}

export interface SignalEvidenceMetric {
  key: string;
  label: string;
  value: string | number;
  baseline?: string | number;
  unit?: string;
}

export interface SignalEvidence {
  summary: string;
  metrics: SignalEvidenceMetric[];
  details: Record<string, unknown>;
  triggerConditionsPassed: string[];
}

export interface RelatedEntity {
  type: 'ACCOUNT' | 'CARD' | 'MERCHANT' | 'DEVICE' | 'IP';
  id: string;
  name?: string;
}

export interface TransactionSnapshot {
  id: string;
  amount: number;
  currency: string;
  merchant: string;
  merchantId: string;
  paymentMethod: string;
  transactionType: string;
  location: string;
  status: string;
  ipAddress: string;
  deviceId: string;
  accountReference: string;
  timestamp: string;
}

export interface DetectionSignal {
  id: string; // e.g. SIG-84291
  transactionId: string;
  signalType: SignalType;
  severity: SignalSeverity;
  ruleId: string;
  ruleName: string;
  timestamp: string; // ISO
  evidence: SignalEvidence;
  relatedEntity: RelatedEntity;
  transactionSnapshot: TransactionSnapshot;
  status: 'ACTIVE' | 'CORRELATED' | 'EVALUATED';
}

export interface DetectionPattern {
  id: string;
  name: string;
  category: string;
  severity: SignalSeverity;
  description: string;
  signalsCount: number;
  associatedRules: string[];
  heuristicSummary: string;
  detectedClusters: number;
  lastDetected: string;
  status: 'ACTIVE' | 'MONITORING';
}

export interface RuleSimulationInput {
  amount: number;
  currency: string;
  paymentMethod: string;
  location: string;
  velocity10m: number;
  velocity1h: number;
  isNewDevice: boolean;
  ipRiskScore: number;
  distanceKm: number;
  hoursSinceLastSeen: number;
  merchantCategory: string;
}

export interface ConditionEvaluationResult {
  conditionId: string;
  field: string;
  label: string;
  operator: ComparisonOperator;
  expectedValue: string | number | boolean;
  actualValue: string | number | boolean;
  passed: boolean;
  explanation: string;
}

export interface RuleSimulationResult {
  ruleId: string;
  ruleName: string;
  matched: boolean;
  evaluatedAt: string;
  executionDurationMs: number;
  conditionResults: ConditionEvaluationResult[];
  simulatedSignal?: DetectionSignal;
}

export interface SimulationPreset {
  id: string;
  name: string;
  description: string;
  scenario: string;
  targetRuleId: string;
  input: RuleSimulationInput;
}
