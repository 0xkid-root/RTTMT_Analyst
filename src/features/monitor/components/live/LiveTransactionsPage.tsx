'use client';

import { useState, useMemo } from 'react';
import { LiveTransactionsHeader } from './LiveTransactionsHeader';
import { LiveTransactionsSummary } from './LiveTransactionsSummary';
import { LiveTransactionsFilters } from './LiveTransactionsFilters';
import { LiveTransactionsTable } from './LiveTransactionsTable';
import { TransactionDetailsDrawer } from '../shared/TransactionDetailsDrawer';
import { Transaction } from '../../types/transaction';
import { useLiveTransactions } from '../../hooks/useLiveTransactions';

export function LiveTransactionsPage() {
  const [isPaused, setIsPaused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [newCount, setNewCount] = useState(0);
  
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // TanStack Query hook handles the live stream
  const { transactions, isLoading, isError } = useLiveTransactions(isPaused);

  // Derived stats from the live query data
  const stats = useMemo(() => {
    return {
      transactionsPerMin: 12842 + transactions.length, // Simulated scaling
      highRisk: transactions.filter(t => t.riskLevel === 'HIGH').length,
      critical: transactions.filter(t => t.riskLevel === 'CRITICAL').length,
      alerts: transactions.filter(t => t.status === 'ALERT').length,
      blocked: transactions.filter(t => t.status === 'BLOCKED').length
    };
  }, [transactions]);

  const handleTogglePause = () => setIsPaused(prev => !prev);
  const handleRefresh = () => {
    // We could trigger a refetch here if needed
  };

  const handleToggleAutoScroll = () => {
    setAutoScroll(prev => !prev);
    if (!autoScroll) {
      setNewCount(0); // Clear new count when re-enabling
    }
  };

  const handleTransactionClick = (t: Transaction) => {
    setSelectedTransaction(t);
    setIsDrawerOpen(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-[1600px] mx-auto w-full">
      <LiveTransactionsHeader 
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
        onRefresh={handleRefresh}
        transactionsPerMinute={stats.transactionsPerMin}
      />
      
      <LiveTransactionsSummary stats={stats} />
      
      <LiveTransactionsFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        autoScroll={autoScroll}
        onToggleAutoScroll={handleToggleAutoScroll}
      />
      
      <div className="flex-1 min-h-0 relative flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground border border-border rounded-xl bg-card">
            Connecting to live transaction stream...
          </div>
        ) : isError ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground border border-border rounded-xl bg-card gap-2">
            <span className="text-destructive">Unable to load live transactions</span>
            <button onClick={handleRefresh} className="text-sm underline text-primary">Retry</button>
          </div>
        ) : (
          <LiveTransactionsTable 
            transactions={transactions}
            searchTerm={searchTerm}
            onTransactionClick={handleTransactionClick}
            autoScroll={autoScroll}
            setAutoScroll={setAutoScroll}
            newCount={newCount}
            setNewCount={setNewCount}
          />
        )}
      </div>

      <TransactionDetailsDrawer 
        transaction={selectedTransaction}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
