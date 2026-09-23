'use client';

import { useCaseStore } from '@/features/cases/store/useCaseStore';
import { CasesTable } from '@/features/cases/components/CasesTable';
import { FileText } from 'lucide-react';

export function PendingReviewPage() {
  const cases = useCaseStore(state => state.cases);
  const pendingCases = cases.filter(c => c.status === 'PENDING_REVIEW');
  
  return (
    <div className="flex-1 overflow-auto p-6 max-w-[1600px] mx-auto w-full flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-xl">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pending Review</h1>
          <p className="text-muted-foreground">Cases waiting for secondary analyst or manager review.</p>
        </div>
      </div>

      <CasesTable cases={pendingCases} emptyMessage="No cases are pending review." />
    </div>
  );
}
