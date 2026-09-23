'use client';

import { useCaseStore } from '@/features/cases/store/useCaseStore';
import { CasesTable } from '@/features/cases/components/CasesTable';
import { Save } from 'lucide-react';

export function MyCasesPage() {
  const cases = useCaseStore(state => state.cases);
  const myCases = cases.filter(c => c.assignedTo === 'Current Analyst');
  
  return (
    <div className="flex-1 overflow-auto p-6 max-w-[1600px] mx-auto w-full flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
          <Save className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Cases</h1>
          <p className="text-muted-foreground">Cases currently assigned to you for investigation.</p>
        </div>
      </div>

      <CasesTable cases={myCases} emptyMessage="You have no assigned cases." />
    </div>
  );
}
