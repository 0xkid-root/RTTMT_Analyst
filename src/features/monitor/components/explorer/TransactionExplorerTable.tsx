'use client';

import { useState } from 'react';
import { Transaction } from '../../types/transaction';
import { RiskBadge } from '../shared/RiskBadge';
import { TransactionStatusBadge } from '../shared/TransactionStatusBadge';
import { ChevronUp, ChevronDown } from 'lucide-react';

type SortField = 'timestamp' | 'amount' | 'riskScore' | 'maliScore';
type SortDirection = 'asc' | 'desc';

interface TransactionExplorerTableProps {
  transactions: Transaction[];
  onTransactionClick: (t: Transaction) => void;
}

export function TransactionExplorerTable({ transactions, onTransactionClick }: TransactionExplorerTableProps) {
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to desc for new sorts
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'timestamp') {
      comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    } else if (sortField === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sortField === 'riskScore') {
      comparison = a.riskScore - b.riskScore;
    } else if (sortField === 'maliScore') {
      comparison = a.maliScore - b.maliScore;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <div className="w-4 h-4 ml-1 inline-block opacity-0" />;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1 inline-block" /> : <ChevronDown className="w-4 h-4 ml-1 inline-block" />;
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col flex-1 min-h-[500px]">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort('timestamp')}>
                Date/Time {renderSortIcon('timestamp')}
              </th>
              <th className="px-4 py-3 font-medium">Transaction ID</th>
              <th className="px-4 py-3 font-medium">Merchant</th>
              <th className="px-4 py-3 font-medium text-right cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort('amount')}>
                Amount {renderSortIcon('amount')}
              </th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium text-center cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort('riskScore')}>
                Risk Score {renderSortIcon('riskScore')}
              </th>
              <th className="px-4 py-3 font-medium text-center cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort('maliScore')}>
                MALi Score {renderSortIcon('maliScore')}
              </th>
              <th className="px-4 py-3 font-medium">Rule</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedTransactions.map(t => (
              <tr 
                key={t.id} 
                onClick={() => onTransactionClick(t)}
                className="cursor-pointer transition-colors hover:bg-muted/50"
              >
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {new Date(t.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} <span className="font-mono ml-1">{new Date(t.timestamp).toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
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
                  <div className="flex flex-col items-center gap-1">
                    <span className={`font-mono font-semibold ${t.riskScore >= 85 ? 'text-red-500' : t.riskScore >= 65 ? 'text-orange-500' : 'text-foreground'}`}>
                      {t.riskScore}
                    </span>
                    <RiskBadge level={t.riskLevel} className="scale-75 origin-top" />
                  </div>
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
            
            {sortedTransactions.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-muted-foreground text-lg">
                  No transactions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
