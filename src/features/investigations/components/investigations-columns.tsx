'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { Investigation } from '../types/investigation';
import { User, Clock, AlertTriangle, Activity } from 'lucide-react';

const columnHelper = createColumnHelper<Investigation>();

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    default: return 'text-green-500 bg-green-500/10 border-green-500/20';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'OPEN': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    case 'IN_PROGRESS': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    case 'ON_HOLD': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    case 'ESCALATED': return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'RESOLVED': return 'text-green-500 bg-green-500/10 border-green-500/20';
    case 'CLOSED': return 'text-muted-foreground bg-muted/50 border-border';
    default: return 'text-foreground bg-muted border-border';
  }
};

export const investigationsColumns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center px-2">
        <input
          type="checkbox"
          className="rounded border-primary/50 text-primary focus:ring-primary h-4 w-4 bg-transparent cursor-pointer"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center px-2">
        <input
          type="checkbox"
          className="rounded border-primary/50 text-primary focus:ring-primary h-4 w-4 bg-transparent cursor-pointer"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          onClick={(e) => e.stopPropagation()}
          aria-label="Select row"
        />
      </div>
    ),
  }),
  columnHelper.accessor('id', {
    header: 'Investigation',
    cell: info => {
      const investigation = info.row.original;
      return (
        <div className="flex flex-col gap-1 min-w-[220px] max-w-[320px]">
          <span className="font-mono font-medium text-primary text-xs">{investigation.id}</span>
          <span className="font-medium truncate text-sm">{investigation.title}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor('riskLevel', {
    header: () => <div className="text-center">Risk</div>,
    cell: info => {
      const risk = info.getValue();
      let colorClass = 'text-green-500';
      if (risk === 'CRITICAL') colorClass = 'text-red-500';
      else if (risk === 'HIGH') colorClass = 'text-orange-500';
      else if (risk === 'MEDIUM') colorClass = 'text-yellow-500';
      
      return (
        <div className="flex items-center justify-center gap-1.5">
          <AlertTriangle className={`w-3.5 h-3.5 ${colorClass}`} />
          <span className={`text-xs font-semibold ${colorClass}`}>{risk}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor('priority', {
    header: () => <div className="text-center">Priority</div>,
    cell: info => (
      <div className="text-center">
        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider border ${getPriorityColor(info.getValue())}`}>
          {info.getValue().toUpperCase()}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor('status', {
    header: () => <div className="text-center">Status</div>,
    cell: info => (
      <div className="text-center">
        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider border ${getStatusColor(info.getValue())}`}>
          {info.getValue().replace('_', ' ')}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor('assignedTo', {
    header: 'Assigned Analyst',
    cell: info => (
      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
        <User className="w-3.5 h-3.5" />
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('alertCount', {
    header: () => <div className="text-center">Alerts</div>,
    cell: info => (
      <div className="text-center font-mono text-sm">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('transactionCount', {
    header: () => <div className="text-center">Txns</div>,
    cell: info => (
      <div className="text-center font-mono text-sm text-muted-foreground">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('lastActivity', {
    header: 'Last Activity',
    cell: info => (
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs max-w-[200px] truncate">
        <Activity className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created',
    cell: info => (
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs whitespace-nowrap">
        <Clock className="w-3.5 h-3.5" />
        {new Date(info.getValue()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>
    ),
  }),
];
