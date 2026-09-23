'use client';

import { useCaseStore } from '@/features/cases/store/useCaseStore';
import { CasesTable } from '@/features/cases/components/CasesTable';
import { CheckSquare } from 'lucide-react';

export function ClosedCasesPage() {
  const cases = useCaseStore(state => state.cases);
  const closedCases = cases.filter(c => c.status === 'CLOSED');
  
  return (
    <div className="flex-1 overflow-auto p-6 max-w-[1600px] mx-auto w-full flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-muted-foreground/10 text-muted-foreground rounded-xl">
          <CheckSquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Closed Cases</h1>
          <p className="text-muted-foreground">Historical view of resolved and closed investigation cases.</p>
        </div>
      </div>

      <CasesTable cases={closedCases} emptyMessage="No closed cases found." />
    </div>
  );
}
