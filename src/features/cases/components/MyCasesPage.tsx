'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCaseStore } from '@/features/cases/store/useCaseStore';
import { CasesTable } from '@/features/cases/components/CasesTable';
import { CaseFilters } from '@/features/cases/components/CaseFilters';
import { Save } from 'lucide-react';

export function MyCasesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const allCases = useCaseStore(state => state.cases);
  
  // Pre-filter for current analyst
  const myCases = useMemo(() => allCases.filter(c => c.assignedTo === 'Current Analyst'), [allCases]);
  
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter cases based on status and search term
  const filteredCases = useMemo(() => {
    let result = myCases;
    
    // Status Filter
    if (statusFilter !== 'ALL') {
      result = result.filter(c => c.status === statusFilter);
    }
    
    // Search Filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.sourceTransactionId.toLowerCase().includes(q) ||
        (c.sourceTransaction?.merchant?.toLowerCase().includes(q))
      );
    }
    
    return result;
  }, [myCases, statusFilter, searchTerm]);

  return (
    <div className="flex-1 overflow-auto p-6 max-w-[1600px] mx-auto w-full flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
          <Save className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Cases</h1>
          <p className="text-muted-foreground">Cases currently assigned to you for investigation.</p>
        </div>
      </div>

      <CaseFilters 
        cases={myCases} // Pass myCases so tabs show counts specific to My Cases
        statusFilter={statusFilter}
        setStatusFilter={handleStatusFilterChange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <CasesTable cases={filteredCases} emptyMessage="No cases match your filters." />
    </div>
  );
}
