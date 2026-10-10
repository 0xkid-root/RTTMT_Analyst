'use client';

import { useState } from 'react';
import { MaliAnalysisFilters } from './MaliAnalysisFilters';
import { MaliAnalysisTable } from './MaliAnalysisTable';
import { MaliTransactionDrawer } from './MaliTransactionDrawer';
import { MaliAnalysisResult } from '../types/mali';
import { useMaliAnalysis, MaliFilterState } from '../hooks/useMaliAnalysis';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';

const defaultFilters: MaliFilterState = {
  search: '',
  riskLevel: '',
  startDate: '',
  endDate: '',
};

import { MaliEvaluationFlow } from './MaliEvaluationFlow';

export function MaliAnalysisPage() {
  const [filters, setFilters] = useState<MaliFilterState>(defaultFilters);
  const [activeFilters, setActiveFilters] = useState<MaliFilterState>(defaultFilters);
  
  const [selectedTransaction, setSelectedTransaction] = useState<MaliAnalysisResult | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: transactions = [], isLoading, isError, refetch } = useMaliAnalysis(activeFilters);

  const handleFilterChange = (key: keyof MaliFilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setActiveFilters(defaultFilters);
  };

  const handleSearch = () => {
    setActiveFilters(filters);
  };

  const handleTransactionClick = (t: MaliAnalysisResult) => {
    setSelectedTransaction(t);
    setIsDrawerOpen(true);
  };

  return (
    <StaggerContainer className="flex flex-col max-w-[1600px] mx-auto w-full pb-6">
      <StaggerItem>
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">MALi Analysis</h1>
            <span className="bg-primary/10 text-primary border border-primary/20 text-xs px-2 py-0.5 rounded-full font-medium">
              Mock Data
            </span>
          </div>
          <p className="text-muted-foreground mt-1">Explainable transaction risk scoring</p>
        </div>
      </StaggerItem>

      <StaggerItem>
        <MaliEvaluationFlow />
      </StaggerItem>
      
      <StaggerItem>
        <MaliAnalysisFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          onSearch={handleSearch}
        />
      </StaggerItem>
      
      <StaggerItem className="flex-1 flex flex-col min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-12 text-muted-foreground border border-border rounded-xl bg-card mt-4">
            Searching MALi transactions...
          </div>
        ) : isError ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground border border-border rounded-xl bg-card gap-2 mt-4">
            <span className="text-destructive">Failed to fetch transactions</span>
            <button onClick={() => refetch()} className="text-sm underline text-primary">Retry</button>
          </div>
        ) : (
          <MaliAnalysisTable 
            transactions={transactions}
            onTransactionClick={handleTransactionClick}
          />
        )}
      </StaggerItem>

      <MaliTransactionDrawer 
        transaction={selectedTransaction}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </StaggerContainer>
  );
}
