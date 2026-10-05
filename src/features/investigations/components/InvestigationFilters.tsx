'use client';

import { Investigation, InvestigationStatus } from '../types/investigation';

interface InvestigationFiltersProps {
  investigations: Investigation[];
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export const INVESTIGATION_STATUSES: { id: string; label: string }[] = [
  { id: 'ALL', label: 'All Investigations' },
  { id: 'OPEN', label: 'Open' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'ON_HOLD', label: 'On Hold' },
  { id: 'ESCALATED', label: 'Escalated' },
  { id: 'RESOLVED', label: 'Resolved' },
  { id: 'CLOSED', label: 'Closed' }
];

export function InvestigationFilters({
  investigations,
  statusFilter,
  setStatusFilter
}: InvestigationFiltersProps) {
  
  // Calculate counts for the tabs
  const counts = INVESTIGATION_STATUSES.reduce((acc, status) => {
    if (status.id === 'ALL') {
      acc[status.id] = investigations.length;
    } else {
      acc[status.id] = investigations.filter(inv => inv.status === status.id).length;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Status Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {INVESTIGATION_STATUSES.map(status => {
          const isSelected = statusFilter === status.id;
          const count = counts[status.id] || 0;
          return (
            <button
              key={status.id}
              onClick={() => setStatusFilter(status.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 border
                ${isSelected 
                  ? 'bg-primary/10 text-primary border-primary/20' 
                  : 'bg-card text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground'
                }
              `}
            >
              {status.label}
              <span className={`
                px-1.5 py-0.5 rounded-md text-xs font-mono
                ${isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}
              `}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
