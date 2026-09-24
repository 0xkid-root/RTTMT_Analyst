'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState
} from '@tanstack/react-table';
import { Alert } from '../types/alert';
import { alertsColumns } from './alerts-columns';
import { DataTable, DataTablePagination, DataTableColumnVisibility } from '@/components/data-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Search, ChevronDown, Filter, SlidersHorizontal } from 'lucide-react';

interface AlertsTableProps {
  alerts: Alert[];
  title: string;
  subtitle: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  onAlertClick: (alert: Alert) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  summaryCards?: React.ReactNode;
  initialVisibility?: VisibilityState;
  hideFilters?: string[];
}

export function AlertsTable({
  alerts,
  title,
  subtitle,
  isLoading,
  onRefresh,
  onAlertClick,
  searchQuery,
  onSearchChange,
  summaryCards,
  initialVisibility = {},
  hideFilters = []
}: AlertsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialVisibility);

  const table = useReactTable({
    data: alerts,
    columns: alertsColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 15,
      }
    }
  });

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2 text-muted-foreground"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {summaryCards && (
        <div className="w-full">
          {summaryCards}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 w-full pb-2">
        <div className="relative w-[280px] shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search alert ID, transaction..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-card border-border h-9"
          />
        </div>
        
        {/* Filter Dropdowns UI */}
        <div className="flex items-center gap-2 shrink-0">
          {!hideFilters.includes('severity') && (
            <Button variant="outline" size="sm" className="h-9 gap-1 text-muted-foreground bg-card border-border">
              Severity <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-50" />
            </Button>
          )}
          {!hideFilters.includes('status') && (
            <Button variant="outline" size="sm" className="h-9 gap-1 text-muted-foreground bg-card border-border">
              Status <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-50" />
            </Button>
          )}
          {!hideFilters.includes('alertType') && (
            <Button variant="outline" size="sm" className="h-9 gap-1 text-muted-foreground bg-card border-border">
              Alert Type <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-50" />
            </Button>
          )}
          {!hideFilters.includes('sla') && (
            <Button variant="outline" size="sm" className="h-9 gap-1 text-muted-foreground bg-card border-border">
              SLA <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-50" />
            </Button>
          )}
          {!hideFilters.includes('assignedTo') && (
            <Button variant="outline" size="sm" className="h-9 gap-1 text-muted-foreground bg-card border-border">
              Assigned To <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-50" />
            </Button>
          )}
          {!hideFilters.includes('moreFilters') && (
            <Button variant="outline" size="sm" className="h-9 gap-1 text-muted-foreground bg-card border-border border-dashed ml-1">
              <Filter className="w-3.5 h-3.5 mr-1" /> More Filters
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <DataTableColumnVisibility table={table} />
        </div>
      </div>

      <DataTable 
        table={table} 
        onRowClick={onAlertClick} 
        emptyMessage={isLoading ? "Loading alerts..." : "No alerts found matching your criteria."} 
      />
      
      <DataTablePagination table={table} />
    </div>
  );
}
