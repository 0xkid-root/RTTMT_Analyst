import { create } from 'zustand';
import { Case, CaseStatus } from '../types/case';
import { mockHistoricalTransactions } from '@/features/monitor/data/mockTransactions';

interface CaseState {
  cases: Case[];
  addCase: (newCase: Case) => void;
  updateCaseStatus: (id: string, status: CaseStatus) => void;
  getCase: (id: string) => Case | undefined;
}

// Generate some initial mock cases from the historical transactions
const generateInitialCases = (): Case[] => {
  const cases: Case[] = [];
  const caseTypes = ['Transaction Fraud', 'Payment Fraud', 'Account Takeover', 'Money Laundering'];
  const analysts = ['Current Analyst', 'Ananya Sharma', 'Rahul Verma', 'Priya Singh'];
  
  // Pick a few high/critical risk transactions for the mock cases
  const riskyTransactions = mockHistoricalTransactions
    .filter(t => t.riskLevel === 'CRITICAL' || t.riskLevel === 'HIGH')
    .slice(0, 15);

  riskyTransactions.forEach((txn, index) => {
    // Generate varied statuses for the demo
    let status: CaseStatus = 'OPEN';
    if (index % 5 === 0) status = 'CLOSED';
    else if (index % 4 === 0) status = 'IN_REVIEW';
    else if (index % 3 === 0) status = 'IN_REVIEW';
    else if (index % 7 === 0) status = 'ESCALATED';

    cases.push({
      id: `CASE-2026-${(10400 - index).toString()}`, // e.g. CASE-2026-10400
      title: `${txn.riskLevel} Risk: ${txn.paymentMethod} Transaction Anomaly`,
      type: caseTypes[index % caseTypes.length] as any,
      priority: txn.riskLevel === 'CRITICAL' ? 'Critical' : 'High',
      status,
      description: 'Auto-generated case from high risk transaction detection.',
      sourceTransactionId: txn.id,
      sourceTransaction: txn,
      assignedTo: analysts[index % analysts.length],
      createdAt: txn.timestamp,
      createdBy: 'System Engine',
      detectionSignals: txn.detectionRules,
      evidence: [],
      initialNotes: 'Investigating triggered rules.'
    });
  });

  return cases;
};

export const useCaseStore = create<CaseState>((set, get) => ({
  cases: generateInitialCases(),
  
  addCase: (newCase) => set((state) => ({ 
    // Add new case to the top of the array
    cases: [newCase, ...state.cases] 
  })),
  
  updateCaseStatus: (id, status) => set((state) => ({
    cases: state.cases.map(c => 
      c.id === id ? { ...c, status } : c
    )
  })),

  getCase: (id) => {
    return get().cases.find(c => c.id === id);
  }
}));
