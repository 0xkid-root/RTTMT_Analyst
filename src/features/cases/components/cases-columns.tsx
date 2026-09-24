'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { Case } from '../types/case';
import { Hash, User, Clock } from 'lucide-react';

const columnHelper = createColumnHelper<Case>();

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
    case 'IN_REVIEW': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    case 'PENDING_REVIEW': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    case 'ESCALATED': return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'RESOLVED': return 'text-green-500 bg-green-500/10 border-green-500/20';
    case 'CLOSED': return 'text-muted-foreground bg-muted/50 border-border';
    default: return 'text-foreground bg-muted border-border';
  }
};

export const casesColumns = [
  // Selection checkbox
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
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
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          className="rounded border-primary/50 text-primary focus:ring-primary h-4 w-4 bg-transparent cursor-pointer"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          onClick={(e) => e.stopPropagation()} // Prevent row click
          aria-label="Select row"
        />
      </div>
    ),
  }),
  columnHelper.accessor('id', {
    header: 'Case ID',
    cell: info => <span className="font-mono font-medium text-primary">{info.getValue()}</span>,
  }),
  columnHelper.accessor('title', {
    header: 'Case Title',
    cell: info => (
      <div className="min-w-[200px] max-w-[300px]">
        <div className="font-medium truncate">{info.getValue()}</div>
      </div>
    ),
  }),
  columnHelper.accessor('sourceTransactionId', {
    header: 'Source Transaction',
    cell: info => (
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Hash className="w-3.5 h-3.5" />
        <span className="font-mono">{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: info => <span className="text-muted-foreground">{info.getValue()}</span>,
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
  columnHelper.accessor('assignedTo', {
    header: 'Assigned To',
    cell: info => (
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <User className="w-3.5 h-3.5" />
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created',
    cell: info => (
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        {new Date(info.getValue()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
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
];
