export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskSummary {
  totalTransactions: {
    total: number;
    trendPercent: number; // positive = increase
  };
  highRiskTransactions: {
    total: number;
    trendPercent: number;
  };
  openAlerts: {
    total: number;
    trendPercent: number; // negative = decrease
  };
  openCases: {
    total: number;
    trendPercent: number;
  };
  resolvedToday: {
    total: number;
    trendPercent: number;
  };
  slaBreached: {
    total: number;
    trendPercent: number;
  };
}

export interface RiskLocation {
  id: string;
  city: string;
  latitude: number;
  longitude: number;
  riskLevel: RiskLevel;
  transactions: number;
  alerts: number;
  cases: number;
}

export interface RuleTrigger {
  id: string;
  ruleName: string;
  hits24h: number;
  iconType: 'lock' | 'shield' | 'globe' | 'monitor' | 'users';
}

export interface RecentAlert {
  id: string;
  riskLevel: RiskLevel;
  merchant: string;
  amount: number;
  time: string;
}

export interface RecentCase {
  id: string;
  priority: RiskLevel;
  merchant: string;
  status: 'Investigating' | 'Assigned' | 'Pending Review' | 'Open' | 'Closed';
}

export interface MaliScoreDistribution {
  range: string;
  percentage: number;
}

// Keeping these if needed, though they might be replaced by direct ECharts data structures in components
export interface TransactionVolumeData {
  times: string[];
  successful: number[];
  failed: number[];
}

export interface AlertTrendData {
  dates: string[];
  critical: number[];
  high: number[];
  medium: number[];
  low: number[];
}
