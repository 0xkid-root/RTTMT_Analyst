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
import { RefreshCw, Download, Search } from 'lucide-react';

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
  initialVisibility = {}
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
        <div className="grid grid-cols-4 gap-4">
          {summaryCards}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search alert ID, transaction, merchant..." 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
          {/* Add more filter dropdowns here later if needed */}
        </div>
        
        <DataTableColumnVisibility table={table} />
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
