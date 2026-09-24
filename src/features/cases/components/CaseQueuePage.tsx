'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCaseStore } from '@/features/cases/store/useCaseStore';
import { CasesTable } from '@/features/cases/components/CasesTable';
import { CaseFilters } from '@/features/cases/components/CaseFilters';
import { Briefcase, Download, Plus } from 'lucide-react';

export function CaseQueuePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cases = useCaseStore(state => state.cases);
  
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Sync state from URL
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam) {
      setStatusFilter(statusParam.toUpperCase());
    } else {
      setStatusFilter('ALL');
    }
  }, [searchParams]);

  // Update URL when filter changes
  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus === 'ALL') {
      params.delete('status');
    } else {
      params.set('status', newStatus.toLowerCase());
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Filter cases based on status
  const filteredCases = useMemo(() => {
    if (statusFilter === 'ALL') return cases;
    return cases.filter(c => c.status === statusFilter);
  }, [cases, statusFilter]);

  return (
    <div className="max-w-[1600px] mx-auto w-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Case Queue</h1>
            <p className="text-muted-foreground">Manage investigation cases and monitor their current status.</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => router.push('/monitor/live-transactions')} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            <Plus className="w-4 h-4" /> Create Case
          </button>
        </div>
      </div>

      <CaseFilters 
        cases={cases}
        statusFilter={statusFilter}
        setStatusFilter={handleStatusFilterChange}
      />

      <CasesTable cases={filteredCases} emptyMessage="No cases match your filters." />
    </div>
  );
}
