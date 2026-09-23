'use client';

import { useState } from 'react';
import { LiveTransactionsHeader } from '@/features/monitor/components/live/LiveTransactionsHeader';
import { LiveTransactionsSummary } from '@/features/monitor/components/live/LiveTransactionsSummary';
import { LiveTransactionsFilters } from '@/features/monitor/components/live/LiveTransactionsFilters';
import { LiveTransactionsTable } from '@/features/monitor/components/live/LiveTransactionsTable';
import { TransactionDetailsDrawer } from '@/features/monitor/components/shared/TransactionDetailsDrawer';
import { Transaction } from '@/features/monitor/types/transaction';

export default function LiveTransactionsPage() {
  const [isPaused, setIsPaused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Simulated live stats
  const [stats, setStats] = useState({
    transactionsPerMin: 12842,
    highRisk: 426,
    critical: 38,
    alerts: 127,
    blocked: 21
  });

  const handleTogglePause = () => setIsPaused(prev => !prev);
  const handleRefresh = () => {
    // Just visual feedback for now
  };
  const handleToggleAutoScroll = () => setAutoScroll(prev => !prev);

  const handleTransactionClick = (t: Transaction) => {
    setSelectedTransaction(t);
    setIsDrawerOpen(true);
  };

  const handleNewTransaction = (t: Transaction) => {
    // Update stats slightly to simulate live changes
    setStats(prev => {
      const increment = t.riskLevel === 'CRITICAL' || t.riskLevel === 'HIGH' ? 1 : 0;
      return {
        ...prev,
        transactionsPerMin: prev.transactionsPerMin + Math.floor(Math.random() * 3),
        highRisk: t.riskLevel === 'HIGH' ? prev.highRisk + 1 : prev.highRisk,
        critical: t.riskLevel === 'CRITICAL' ? prev.critical + 1 : prev.critical,
        alerts: t.status === 'ALERT' ? prev.alerts + 1 : prev.alerts,
        blocked: t.status === 'BLOCKED' ? prev.blocked + 1 : prev.blocked,
      };
    });
  };

  return (
    <div className="flex flex-col h-full min-h-0 max-w-[1600px] mx-auto">
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
      
      <LiveTransactionsTable 
        isPaused={isPaused}
        searchTerm={searchTerm}
        autoScroll={autoScroll}
        onTransactionClick={handleTransactionClick}
        onNewTransaction={handleNewTransaction}
      />

      <TransactionDetailsDrawer 
        transaction={selectedTransaction}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
