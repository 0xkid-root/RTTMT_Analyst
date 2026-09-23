'use client';

import { useCaseStore } from '@/features/cases/store/useCaseStore';
import { CasesTable } from '@/features/cases/components/CasesTable';
import { Briefcase } from 'lucide-react';

export function CaseQueuePage() {
  const cases = useCaseStore(state => state.cases);
  
  return (
    <div className="flex-1 overflow-auto p-6 max-w-[1600px] mx-auto w-full flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <Briefcase className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Case Queue</h1>
          <p className="text-muted-foreground">Manage all investigation cases and review case activity across the system.</p>
        </div>
      </div>

      <CasesTable cases={cases} />
    </div>
  );
}
