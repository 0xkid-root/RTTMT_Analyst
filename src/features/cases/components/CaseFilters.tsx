'use client';

import { Case } from '../types/case';
import { Search } from 'lucide-react';

interface CaseFiltersProps {
  cases: Case[];
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const CASE_STATUSES = [
  { id: 'ALL', label: 'All Cases' },
  { id: 'OPEN', label: 'Open' },
  { id: 'IN_REVIEW', label: 'In Review' },
  { id: 'PENDING_REVIEW', label: 'Pending Review' },
  { id: 'ESCALATED', label: 'Escalated' },
  { id: 'RESOLVED', label: 'Resolved' },
  { id: 'CLOSED', label: 'Closed' }
];

export function CaseFilters({
  cases,
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm
}: CaseFiltersProps) {
  
  // Calculate counts for the tabs
  const counts = CASE_STATUSES.reduce((acc, status) => {
    if (status.id === 'ALL') {
      acc[status.id] = cases.length;
    } else {
      acc[status.id] = cases.filter(c => c.status === status.id).length;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Status Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {CASE_STATUSES.map(status => {
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

      {/* Search and Extra Filters Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search Case ID, title, transaction, analyst..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-9 w-full bg-card flex h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        
        <div className="flex gap-2">
          {/* Placeholders for future dropdown filters like Priority, Case Type, etc. */}
          <button className="px-3 py-2 text-sm font-medium border border-border bg-card rounded-md text-muted-foreground hover:bg-muted transition-colors">
            Priority
          </button>
          <button className="px-3 py-2 text-sm font-medium border border-border bg-card rounded-md text-muted-foreground hover:bg-muted transition-colors">
            Case Type
          </button>
        </div>
      </div>
    </div>
  );
}
