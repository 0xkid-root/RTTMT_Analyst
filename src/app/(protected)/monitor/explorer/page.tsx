'use client';

import { useState, useMemo } from 'react';
import { TransactionExplorerHeader } from '@/features/monitor/components/explorer/TransactionExplorerHeader';
import { TransactionExplorerFilters, FilterState } from '@/features/monitor/components/explorer/TransactionExplorerFilters';
import { TransactionExplorerSummary } from '@/features/monitor/components/explorer/TransactionExplorerSummary';
import { TransactionExplorerTable } from '@/features/monitor/components/explorer/TransactionExplorerTable';
import { TransactionDetailsDrawer } from '@/features/monitor/components/shared/TransactionDetailsDrawer';
import { Transaction } from '@/features/monitor/types/transaction';
import { mockHistoricalTransactions } from '@/features/monitor/data/mockTransactions';

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

export default function TransactionExplorerPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [activeFilters, setActiveFilters] = useState<FilterState>(defaultFilters);
  
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const filteredTransactions = useMemo(() => {
    return mockHistoricalTransactions.filter(t => {
      // Search term
      if (activeFilters.search) {
        const term = activeFilters.search.toLowerCase();
        if (!t.id.toLowerCase().includes(term) && 
            !t.merchant.toLowerCase().includes(term) && 
            !t.accountReference.toLowerCase().includes(term)) {
          return false;
        }
      }

      // Date Range (simple string comparison for dummy data format)
      if (activeFilters.startDate && new Date(t.timestamp) < new Date(activeFilters.startDate)) return false;
      if (activeFilters.endDate && new Date(t.timestamp) > new Date(activeFilters.endDate + 'T23:59:59')) return false;

      // Amount
      if (activeFilters.minAmount && t.amount < parseFloat(activeFilters.minAmount)) return false;
      if (activeFilters.maxAmount && t.amount > parseFloat(activeFilters.maxAmount)) return false;

      // Exact matches
      if (activeFilters.riskLevel && t.riskLevel !== activeFilters.riskLevel) return false;
      if (activeFilters.status && t.status !== activeFilters.status) return false;
      if (activeFilters.paymentMethod && t.paymentMethod !== activeFilters.paymentMethod) return false;
      if (activeFilters.transactionType && t.transactionType !== activeFilters.transactionType) return false;

      return true;
    });
  }, [activeFilters]);

  // Compute summary stats
  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const highRiskCount = filteredTransactions.filter(t => t.riskLevel === 'HIGH').length;
  const criticalCount = filteredTransactions.filter(t => t.riskLevel === 'CRITICAL').length;

  return (
    <div className="flex flex-col h-full min-h-0 max-w-[1600px] mx-auto">
      <TransactionExplorerHeader />
      
      <TransactionExplorerFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        onSearch={handleSearch}
      />
      
      <TransactionExplorerSummary 
        totalCount={filteredTransactions.length}
        totalAmount={totalAmount}
        highRiskCount={highRiskCount}
        criticalCount={criticalCount}
      />
      
      <TransactionExplorerTable 
        transactions={filteredTransactions}
        onTransactionClick={handleTransactionClick}
      />

      <TransactionDetailsDrawer 
        transaction={selectedTransaction}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
