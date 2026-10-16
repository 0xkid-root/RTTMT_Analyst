import { createColumnHelper } from '@tanstack/react-table';
import { DetectionSignal } from '../../types/detection';
import { SeverityBadge, SignalTypeBadge } from '../shared/DetectionBadge';
import { Eye, ExternalLink, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const columnHelper = createColumnHelper<DetectionSignal>();

export const createSignalsColumns = (
  onInspect: (signal: DetectionSignal) => void,
  newlyArrivedSignalId?: string | null
) => [
  columnHelper.accessor('id', {
    header: 'Signal ID',
    cell: (info) => {
      const isNew = info.getValue() === newlyArrivedSignalId;
      return (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-primary tracking-wide">
            {info.getValue()}
          </span>
          {isNew && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 rounded animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              NEW
            </span>
          )}
        </div>
      );
    },
  }),

  columnHelper.accessor('transactionId', {
    header: 'Transaction ID',
    cell: (info) => {
      const txnId = info.getValue();
      const amount = info.row.original.transactionSnapshot?.amount;
      const currency = info.row.original.transactionSnapshot?.currency || 'INR';

      return (
        <div className="flex flex-col">
          <span className="font-mono text-xs text-foreground font-medium flex items-center gap-1">
            {txnId}
            <ExternalLink className="w-3 h-3 text-muted-foreground opacity-60" />
          </span>
          {amount !== undefined && (
            <span className="text-[11px] text-muted-foreground">
              {currency} {amount.toLocaleString()}
            </span>
          )}
        </div>
      );
    },
  }),

  columnHelper.accessor('signalType', {
    header: 'Signal Type',
    cell: (info) => <SignalTypeBadge type={info.getValue()} />,
  }),

  columnHelper.accessor('severity', {
    header: 'Severity',
    cell: (info) => <SeverityBadge severity={info.getValue()} />,
  }),

  columnHelper.accessor('ruleName', {
    header: 'Detection Rule',
    cell: (info) => {
      const ruleName = info.getValue();
      const ruleId = info.row.original.ruleId;
      return (
        <div className="flex flex-col max-w-[220px]">
          <span className="font-medium text-xs text-foreground truncate" title={ruleName}>
            {ruleName}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {ruleId}
          </span>
        </div>
      );
    },
  }),

  columnHelper.accessor('evidence.summary', {
    header: 'Evidence Finding',
    cell: (info) => {
      const summary = info.getValue();
      return (
        <div className="max-w-[280px] truncate text-xs text-muted-foreground" title={summary}>
          {summary}
        </div>
      );
    },
  }),

  columnHelper.accessor('relatedEntity', {
    header: 'Related Entity',
    cell: (info) => {
      const entity = info.getValue();
      return (
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            {entity.type}
          </span>
          <span className="font-mono text-xs text-foreground truncate max-w-[140px]" title={entity.id}>
            {entity.name ? entity.name : entity.id}
          </span>
        </div>
      );
    },
  }),

  columnHelper.accessor('timestamp', {
    header: 'Detected At',
    cell: (info) => {
      const timestamp = info.getValue();
      const date = new Date(timestamp);
      const formatted = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

      return (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
          <span>{dateStr}, {formatted}</span>
        </div>
      );
    },
  }),

  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: (info) => (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 gap-1.5"
        onClick={(e) => {
          e.stopPropagation();
          onInspect(info.row.original);
        }}
      >
        <Eye className="w-3.5 h-3.5" />
        <span>Inspect</span>
      </Button>
    ),
  }),
];
