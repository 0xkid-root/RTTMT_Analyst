import { createColumnHelper } from '@tanstack/react-table';
import { DetectionRule } from '../../types/detection';
import { SeverityBadge, RuleCategoryBadge, StatusBadge } from '../shared/DetectionBadge';
import { Eye, Edit3, PlayCircle, Clock, Trash2, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';

const columnHelper = createColumnHelper<DetectionRule>();

export interface RulesColumnsActions {
  onInspect: (rule: DetectionRule) => void;
  onEdit: (rule: DetectionRule) => void;
  onSimulate: (rule: DetectionRule) => void;
  onToggleStatus: (ruleId: string) => void;
  onDelete: (rule: DetectionRule) => void;
}

export const createRulesColumns = (actions: RulesColumnsActions) => [
  columnHelper.accessor('id', {
    header: 'Rule ID',
    cell: (info) => (
      <span className="font-mono text-xs font-semibold text-primary">
        {info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor('name', {
    header: 'Rule Name & Purpose',
    cell: (info) => {
      const name = info.getValue();
      const description = info.row.original.description;
      return (
        <div className="flex flex-col max-w-[280px]">
          <span className="font-semibold text-xs text-foreground truncate" title={name}>
            {name}
          </span>
          <span className="text-[11px] text-muted-foreground truncate" title={description}>
            {description}
          </span>
        </div>
      );
    },
  }),

  columnHelper.accessor('category', {
    header: 'Category',
    cell: (info) => <RuleCategoryBadge category={info.getValue()} />,
  }),

  columnHelper.accessor('severity', {
    header: 'Severity',
    cell: (info) => <SeverityBadge severity={info.getValue()} />,
  }),

  columnHelper.accessor('enabled', {
    header: 'Status',
    cell: (info) => {
      const isEnabled = info.getValue();
      const ruleId = info.row.original.id;

      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            actions.onToggleStatus(ruleId);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
            isEnabled
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted'
          }`}
          title={isEnabled ? 'Click to Disable Rule' : 'Click to Enable Rule'}
        >
          <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-400' : 'bg-muted-foreground'}`} />
          <span>{isEnabled ? 'Enabled' : 'Disabled'}</span>
        </button>
      );
    },
  }),

  columnHelper.accessor('version', {
    header: 'Version',
    cell: (info) => (
      <span className="font-mono text-xs text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded border border-border">
        {info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor('stats.hits24h', {
    header: 'Hits (24h)',
    cell: (info) => {
      const hits = info.getValue();
      return (
        <div className="flex flex-col">
          <span className="font-mono text-xs font-semibold text-foreground">
            {hits.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground">
            FP: {info.row.original.stats.falsePositiveRate}%
          </span>
        </div>
      );
    },
  }),

  columnHelper.accessor('lastUpdated', {
    header: 'Last Updated',
    cell: (info) => {
      const date = new Date(info.getValue());
      const formatted = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      return (
        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
          <span>{formatted}</span>
        </div>
      );
    },
  }),

  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: (info) => (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => actions.onInspect(info.row.original)}
          title="Inspect Rule Details"
        >
          <Eye className="w-3.5 h-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => actions.onEdit(info.row.original)}
          title="Edit Rule Configuration"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-primary/80 hover:text-primary hover:bg-primary/10"
          onClick={() => actions.onSimulate(info.row.original)}
          title="Run Simulation against this Rule"
        >
          <PlayCircle className="w-3.5 h-3.5" />
        </Button>
      </div>
    ),
  }),
];
