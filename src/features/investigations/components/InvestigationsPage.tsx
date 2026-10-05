'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useInvestigationStore } from '../store/useInvestigationStore';
import { InvestigationsTable } from './InvestigationsTable';
import { InvestigationFilters } from './InvestigationFilters';
import { Investigation } from '../types/investigation';
import { FileSearch, Download, Plus } from 'lucide-react';

interface InvestigationsPageProps {
  title: string;
  description: string;
  scope: 'all' | 'my' | 'resolved';
}

export function InvestigationsPage({ title, description, scope }: InvestigationsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const allInvestigations = useInvestigationStore(state => state.investigations);
  
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam) {
      setStatusFilter(statusParam.toUpperCase());
    } else {
      setStatusFilter('ALL');
    }
  }, [searchParams]);

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

  const handleNewInvestigation = () => {
    alert('New Investigation flow is currently under development. Please check back in a future update.');
  };

  // Scope the investigations based on the page type
  const scopedInvestigations = useMemo(() => {
    if (scope === 'my') {
      return allInvestigations.filter(inv => inv.assignedTo === 'Current Analyst');
    }
    if (scope === 'resolved') {
      return allInvestigations.filter(inv => inv.status === 'CLOSED' || inv.status === 'RESOLVED');
    }
    return allInvestigations;
  }, [allInvestigations, scope]);

  // Apply the user's status filter (unless they are on 'resolved' where it's implicitly fixed)
  const filteredInvestigations = useMemo(() => {
    if (scope === 'resolved') return scopedInvestigations; // Status filter shouldn't apply here
    if (statusFilter === 'ALL') return scopedInvestigations;
    return scopedInvestigations.filter(inv => inv.status === statusFilter);
  }, [scopedInvestigations, statusFilter, scope]);

  return (
    <div className="max-w-[1600px] mx-auto w-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <FileSearch className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            <Download className="w-4 h-4" /> Export
          </button>
          <button 
            onClick={handleNewInvestigation} 
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> New Investigation
          </button>
        </div>
      </div>

      {scope !== 'resolved' && (
        <InvestigationFilters 
          investigations={scopedInvestigations}
          statusFilter={statusFilter}
          setStatusFilter={handleStatusFilterChange}
        />
      )}

      <InvestigationsTable 
        investigations={filteredInvestigations} 
        emptyMessage="No investigations match your filters." 
      />
    </div>
  );
}
