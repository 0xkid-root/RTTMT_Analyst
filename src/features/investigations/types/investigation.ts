export type InvestigationPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type InvestigationStatus = 'OPEN' | 'IN_PROGRESS' | 'ON_HOLD' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';
export type InvestigationRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface InvestigationTimelineEvent {
  id: string;
  action: string;
  user: string;
  date: string;
  details?: string;
}

export interface InvestigationEvidence {
  id: string;
  type: string;
  description: string;
  date: string;
}

export interface InvestigationNote {
  id: string;
  text: string;
  user: string;
  date: string;
}

export interface Investigation {
  id: string;
  title: string;
  description: string;
  status: InvestigationStatus;
  priority: InvestigationPriority;
  riskLevel: InvestigationRiskLevel;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  transactionCount: number;
  alertCount: number;
  riskScore: number;
  merchant: string;
  source: string;
  lastActivity: string;
  riskSignals: string[];
  relatedTransactions: string[];
  relatedAlerts: string[];
  evidence: InvestigationEvidence[];
  timeline: InvestigationTimelineEvent[];
  notes: InvestigationNote[];
}
