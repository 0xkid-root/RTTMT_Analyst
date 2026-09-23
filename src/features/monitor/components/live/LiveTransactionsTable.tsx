'use client';

import { useState, useEffect, useRef } from 'react';
import { Transaction } from '../../types/transaction';
import { generateNewLiveTransaction } from '../../data/mockTransactions';
import { RiskBadge } from '../shared/RiskBadge';
import { TransactionStatusBadge } from '../shared/TransactionStatusBadge';
import { Button } from '@/components/ui/button';

interface LiveTransactionsTableProps {
  isPaused: boolean;
  searchTerm: string;
  autoScroll: boolean;
  onTransactionClick: (t: Transaction) => void;
  onNewTransaction: (t: Transaction) => void;
}

export function LiveTransactionsTable({ 
  isPaused, 
  searchTerm, 
  autoScroll,
  onTransactionClick,
  onNewTransaction
}: LiveTransactionsTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const nextId = useRef(1);

  // Initialize with some transactions
  useEffect(() => {
    const initial = Array.from({ length: 20 }, () => {
      const t = generateNewLiveTransaction(nextId.current++);
      return t;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setTransactions(initial);
  }, []);

  // Live stream interval
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      const newTxn = generateNewLiveTransaction(nextId.current++);
      
      setTransactions(prev => {
        const next = [newTxn, ...prev].slice(0, 100); // Keep last 100
        return next;
      });
      
      setHighlightedId(newTxn.id);
      setTimeout(() => setHighlightedId(null), 2000); // clear highlight after 2s
      
      onNewTransaction(newTxn);
    }, 3000); // Every 3 seconds
    
    return () => clearInterval(interval);
  }, [isPaused, onNewTransaction]);

  const filtered = transactions.filter(t => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return t.id.toLowerCase().includes(term) || 
           t.merchant.toLowerCase().includes(term) || 
           t.accountReference.toLowerCase().includes(term);
  });

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col flex-1">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Transaction ID</th>
              <th className="px-4 py-3 font-medium">Merchant</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium text-center">Risk</th>
              <th className="px-4 py-3 font-medium text-center">MALi</th>
              <th className="px-4 py-3 font-medium">Detection</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(t => (
              <tr 
                key={t.id} 
                onClick={() => onTransactionClick(t)}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  highlightedId === t.id ? 'bg-primary/10' : ''
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground font-mono">
                  {new Date(t.timestamp).toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' })}
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-primary">
                  {t.id}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {t.merchant}
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-mono font-medium text-right">
                  ₹{t.amount.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {t.paymentMethod}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {t.location}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <RiskBadge level={t.riskLevel} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <span className={`font-mono font-semibold ${
                    t.maliScore >= 80 ? 'text-red-500' : t.maliScore >= 60 ? 'text-orange-500' : 'text-foreground'
                  }`}>
                    {t.maliScore}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {t.detectionRules.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs truncate max-w-[150px]">{t.detectionRules[0]}</span>
                      {t.detectionRules.length > 1 && (
                        <span className="text-[10px] text-muted-foreground">+{t.detectionRules.length - 1} more</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <TransactionStatusBadge status={t.status} />
                </td>
              </tr>
            ))}
            
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                  No transactions match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-border bg-muted/20 text-center text-xs text-muted-foreground">
        Showing latest {Math.min(filtered.length, 100)} transactions
      </div>
    </div>
  );
}
