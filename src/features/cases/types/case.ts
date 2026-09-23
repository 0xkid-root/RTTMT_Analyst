import { Transaction } from '@/features/monitor/types/transaction';

export type CaseType = 
  | 'Transaction Fraud'
  | 'Payment Fraud'
  | 'Account Takeover'
  | 'Money Laundering'
  | 'Suspicious Activity'
  | 'Merchant Risk'
  | 'Other';

export type CasePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type CaseStatus = 'DRAFT' | 'OPEN' | 'IN_REVIEW' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';

export type EvidenceType = 
  | 'Transaction'
  | 'Device'
  | 'IP Address'
  | 'Merchant'
  | 'Account'
  | 'Document'
  | 'Other';

export interface Evidence {
  id: string;
  type: EvidenceType;
  reference: string;
  description: string;
  addedAt: string;
}

export interface Case {
  id: string;
  title: string;
  type: CaseType;
  priority: CasePriority;
  status: CaseStatus;
  description: string;
  sourceTransactionId: string;
  sourceTransaction?: Transaction; // Attached on the frontend for context
  assignedTo: string;
  createdAt: string;
  createdBy: string;
  detectionSignals: string[]; // Rule IDs or names
  evidence: Evidence[];
  initialNotes: string;
}
