export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertStatus = 'NEW' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED';
export type SlaStatus = 'ON_TRACK' | 'AT_RISK' | 'BREACHED';

export interface Alert {
  id: string; // e.g. ALT-2026-008421
  title: string; // e.g. UPI Transaction Anomaly
  description: string;
  alertType: string;
  severity: AlertSeverity;
  status: AlertStatus;
  
  // Relationships
  transactionId?: string;
  merchantId: string;
  merchantName: string;
  accountId?: string;
  accountStatus?: string;
  caseId?: string;
  caseTitle?: string;
  caseStatus?: string;
  
  // Context
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  location?: string;
  
  // Detection
  riskScore: number;
  ruleId: string;
  ruleName: string;
  riskIndicators?: string[];
  
  // SLA
  slaTargetTime: string; // ISO date string
  slaStatus: SlaStatus;
  slaBreachedByMinutes?: number; // positive if breached
  
  // Assignment & Lifecycle
  assignedTo?: string; // Analyst Name or 'Unassigned'
  assignedAt?: string;
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  resolutionReason?: string;
  
  // Escalation
  escalated: boolean;
  escalatedTo?: string;
  escalationReason?: string;
  escalatedAt?: string;
}

// Filter shape for queries
export interface AlertFilters {
  search?: string;
  severity?: string;
  status?: string;
  assignedTo?: string;
  slaStatus?: string;
  escalated?: boolean;
}
