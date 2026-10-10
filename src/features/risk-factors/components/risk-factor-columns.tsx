'use client';

import { ColumnDef } from '@tanstack/react-table';
import { RiskFactor } from '../types/risk-factor';
import { AlertCircle, ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

export const riskFactorColumns: ColumnDef<RiskFactor>[] = [
  {
    accessorKey: 'name',
    header: 'Factor Name',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.name}</div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.category}</div>
    ),
  },
  {
    accessorKey: 'transactionId',
    header: 'Transaction ID',
    cell: ({ row }) => (
      <div className="font-mono text-xs text-muted-foreground">{row.original.transactionId}</div>
    ),
  },
  {
    accessorKey: 'observedValue',
    header: 'Observed Value',
  },
  {
    accessorKey: 'severity',
    header: 'Severity',
    cell: ({ row }) => {
      const s = row.original.severity;
      let colorClass = 'text-green-500 bg-green-500/10 border-green-500/20';
      if (s === 'medium') colorClass = 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      if (s === 'high') colorClass = 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      if (s === 'critical') colorClass = 'text-red-500 bg-red-500/10 border-red-500/20';

      return (
        <span className={`px-2.5 py-1 text-xs font-medium uppercase rounded-full border flex items-center w-fit gap-1.5 ${colorClass}`}>
          {s === 'critical' && <AlertCircle className="w-3.5 h-3.5" />}
          {s}
        </span>
      );
    },
  },
  {
    accessorKey: 'contribution',
    header: 'Contribution',
    cell: ({ row }) => {
      const isIncrease = row.original.direction === 'increase';
      return (
        <div className={`flex items-center gap-1 font-medium ${isIncrease ? 'text-orange-500' : 'text-green-500'}`}>
          {isIncrease ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
          {isIncrease ? '+' : '-'}{row.original.contribution}
        </div>
      );
    },
  },
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    cell: ({ row }) => {
      const d = new Date(row.original.timestamp);
      return (
        <div className="text-muted-foreground">
          {d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      );
    },
  }
];
