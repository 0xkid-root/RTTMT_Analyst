'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { Alert } from '../types/alert';
import { Hash, User, Clock, AlertTriangle, AlertCircle, Building, CheckCircle2 } from 'lucide-react';

const columnHelper = createColumnHelper<Alert>();

export const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'NEW': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    case 'ACKNOWLEDGED': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    case 'IN_PROGRESS': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    case 'RESOLVED': return 'text-green-500 bg-green-500/10 border-green-500/20';
    default: return 'text-muted-foreground bg-muted/50 border-border';
  }
};

export const getSlaColor = (sla: string) => {
  switch (sla) {
    case 'ON_TRACK': return 'text-green-500';
    case 'AT_RISK': return 'text-yellow-500';
    case 'BREACHED': return 'text-red-500 font-semibold';
    default: return 'text-muted-foreground';
  }
};

export const formatSla = (alert: Alert) => {
  if (alert.slaStatus === 'BREACHED' && alert.slaBreachedByMinutes) {
    const hrs = Math.floor(alert.slaBreachedByMinutes / 60);
    const mins = alert.slaBreachedByMinutes % 60;
    return `+${hrs > 0 ? `${hrs}h ` : ''}${mins}m`;
  }
  
  if (alert.status === 'RESOLVED') return 'Resolved';

  const target = new Date(alert.slaTargetTime).getTime();
  const now = new Date().getTime();
  const diffMinutes = Math.max(0, Math.floor((target - now) / 60000));
  
  if (diffMinutes === 0) return '< 1m remaining';
  
  const hrs = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m remaining`;
};

export const alertsColumns = [
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
    header: 'Alert ID',
    cell: info => <span className="font-mono font-medium text-primary">{info.getValue()}</span>,
  }),
  columnHelper.accessor('title', {
    header: 'Alert',
    cell: info => {
      const isEscalated = info.row.original.escalated;
      return (
        <div className="min-w-[200px] max-w-[300px] flex items-center gap-2">
          {isEscalated && <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />}
          <div className="font-medium truncate">{info.getValue()}</div>
        </div>
      )
    },
  }),
  columnHelper.accessor('transactionId', {
    header: 'Source Transaction',
    cell: info => {
      const val = info.getValue();
      if (!val) return <span className="text-muted-foreground">-</span>;
      return (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Hash className="w-3.5 h-3.5" />
          <span className="font-mono">{val}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor('merchantName', {
    header: 'Merchant',
    cell: info => (
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Building className="w-3.5 h-3.5" />
        <span className="truncate max-w-[120px]">{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('severity', {
    header: () => <div className="text-center">Severity</div>,
    cell: info => (
      <div className="text-center">
        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider border ${getSeverityColor(info.getValue())}`}>
          {info.getValue().toUpperCase()}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor('slaStatus', {
    header: 'SLA',
    cell: info => {
      const alert = info.row.original;
      return (
        <div className={`flex items-center gap-1.5 text-sm ${getSlaColor(alert.slaStatus)}`}>
          {alert.slaStatus === 'BREACHED' ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
          {formatSla(alert)}
        </div>
      );
    },
  }),
  columnHelper.accessor('assignedTo', {
    header: 'Assigned To',
    cell: info => {
      const val = info.getValue();
      if (!val) return <span className="text-muted-foreground text-sm italic">Unassigned</span>;
      return (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <User className="w-3.5 h-3.5" />
          {val}
        </div>
      );
    },
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
  columnHelper.accessor('createdAt', {
    header: 'Created',
    cell: info => {
      const date = new Date(info.getValue());
      return (
        <div className="text-muted-foreground text-sm">
          {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </div>
      );
    }
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: () => (
      <div className="text-muted-foreground text-center tracking-widest cursor-pointer hover:text-primary">
        •••
      </div>
    )
  })
];
