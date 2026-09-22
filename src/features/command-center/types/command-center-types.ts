export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskSummary {
  activeAlerts: {
    total: number;
    trend: number; // positive = increase
  };
  highRisk: {
    total: number;
    critical: number;
  };
  transactions: {
    total: number; // e.g. 1280000 -> 1.28M
    trendPercent: number; 
  };
  riskRate: {
    value: number; // e.g. 2.7
    trendPercent: number; // negative = decrease
  };
  openCases: {
    total: number;
    priority: number;
  };
}

export interface RiskLocation {
  id: string;
  city: string;
  latitude: number;
  longitude: number;
  riskLevel: RiskLevel;
  transactions: number;
  riskEvents: number;
}

export interface PriorityActivity {
  id: string;
  riskLevel: RiskLevel;
  type: string;
  merchant: string;
  location: string;
  timestamp: string; // ISO or relative e.g., "2 min ago"
}

export interface TransactionActivitySummary {
  successful: number;
  underReview: number;
  declined: number;
  riskFlagged: number;
}

export interface RiskDistributionSummary {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface RecentEvent {
  id: string;
  time: string; // HH:mm
  type: string;
  description: string;
  status: 'info' | 'warning' | 'error' | 'success';
}
