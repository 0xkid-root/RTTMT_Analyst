'use client';

import { useState, useMemo } from 'react';
import { TransactionExplorerHeader } from './TransactionExplorerHeader';
import { TransactionExplorerFilters, FilterState } from './TransactionExplorerFilters';
import { TransactionExplorerSummary } from './TransactionExplorerSummary';
import { TransactionExplorerTable } from './TransactionExplorerTable';
import { TransactionDetailsDrawer } from '../shared/TransactionDetailsDrawer';
import { Transaction } from '../../types/transaction';
import { useTransactionExplorer } from '../../hooks/useTransactionExplorer';

const defaultFilters: FilterState = {
  search: '',
  startDate: '',
  endDate: '',
  minAmount: '',
  maxAmount: '',
  riskLevel: '',
  status: '',
  paymentMethod: '',
  transactionType: '',
  location: ''
};

export function TransactionExplorerPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [activeFilters, setActiveFilters] = useState<FilterState>(defaultFilters);
  
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // TanStack Query hook handles the search/fetching
  const { transactions, isLoading, isError, refetch } = useTransactionExplorer(activeFilters);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setActiveFilters(defaultFilters);
  };

  const handleSearch = () => {
    setActiveFilters(filters);
  };

  const handleTransactionClick = (t: Transaction) => {
    setSelectedTransaction(t);
    setIsDrawerOpen(true);
  };

  // Compute summary stats
  const totalAmount = useMemo(() => transactions.reduce((sum, t) => sum + t.amount, 0), [transactions]);
  const highRiskCount = useMemo(() => transactions.filter(t => t.riskLevel === 'HIGH').length, [transactions]);
  const criticalCount = useMemo(() => transactions.filter(t => t.riskLevel === 'CRITICAL').length, [transactions]);

  return (
    <div className="flex flex-col max-w-[1600px] mx-auto w-full">
      <TransactionExplorerHeader />
      
      <TransactionExplorerFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        onSearch={handleSearch}
      />
      
      <TransactionExplorerSummary 
        totalCount={transactions.length}
        totalAmount={totalAmount}
        highRiskCount={highRiskCount}
        criticalCount={criticalCount}
      />
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center p-12 text-muted-foreground border border-border rounded-xl bg-card mt-4">
          Searching transactions...
        </div>
      ) : isError ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground border border-border rounded-xl bg-card gap-2 mt-4">
          <span className="text-destructive">Failed to fetch transactions</span>
          <button onClick={() => refetch()} className="text-sm underline text-primary">Retry</button>
        </div>
      ) : (
        <TransactionExplorerTable 
          transactions={transactions}
          onTransactionClick={handleTransactionClick}
        />
      )}

      <TransactionDetailsDrawer 
        transaction={selectedTransaction}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
