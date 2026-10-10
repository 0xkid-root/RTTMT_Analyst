'use client';

import { ColumnDef } from '@tanstack/react-table';
import { RiskHistoryRecord } from '../types/risk-history';
import { RiskBadge } from '../../monitor/components/shared/RiskBadge';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';

export const riskHistoryColumns: ColumnDef<RiskHistoryRecord>[] = [
  {
    accessorKey: 'evaluationId',
    header: 'Evaluation ID',
    cell: ({ row }) => (
      <div className="font-mono text-xs text-muted-foreground">{row.original.evaluationId}</div>
    ),
  },
  {
    accessorKey: 'transactionId',
    header: 'Transaction ID',
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.original.transactionId}</div>
    ),
  },
  {
    accessorKey: 'previousScore',
    header: 'Prev Score',
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.previousScore !== null ? row.original.previousScore : '-'}
      </div>
    ),
  },
  {
    accessorKey: 'currentScore',
    header: 'Current Score',
    cell: ({ row }) => (
      <div className="font-bold">{row.original.currentScore}</div>
    ),
  },
  {
    accessorKey: 'scoreChange',
    header: 'Change',
    cell: ({ row }) => {
      const change = row.original.scoreChange;
      if (change === null || change === 0) {
        return <div className="text-muted-foreground flex items-center gap-1"><MinusIcon className="w-4 h-4" /> 0</div>;
      }
      const isIncrease = change > 0;
      return (
        <div className={`flex items-center gap-1 font-medium ${isIncrease ? 'text-red-500' : 'text-green-500'}`}>
          {isIncrease ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
          {Math.abs(change)}
        </div>
      );
    },
  },
  {
    accessorKey: 'currentRiskLevel',
    header: 'Risk Level',
    cell: ({ row }) => (
      <RiskBadge level={row.original.currentRiskLevel as any} />
    ),
  },
  {
    accessorKey: 'modelVersion',
    header: 'Model',
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.original.modelVersion}</div>
    ),
  },
  {
    accessorKey: 'evaluationStatus',
    header: 'Status',
    cell: ({ row }) => {
      const s = row.original.evaluationStatus;
      return (
        <span className={`px-2 py-1 text-[10px] font-semibold uppercase rounded border ${
          s === 'SUCCESS' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 
          s === 'ERROR' ? 'text-red-500 bg-red-500/10 border-red-500/20' : 
          'text-orange-500 bg-orange-500/10 border-orange-500/20'
        }`}>
          {s}
        </span>
      );
    },
  },
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    cell: ({ row }) => {
      const d = new Date(row.original.timestamp);
      return (
        <div className="text-muted-foreground whitespace-nowrap">
          {d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      );
    },
  }
];
