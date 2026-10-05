'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  VisibilityState,
  RowSelectionState,
  SortingState
} from '@tanstack/react-table';
import { Investigation } from '../types/investigation';
import { investigationsColumns } from './investigations-columns';
import { DataTable, DataTablePagination, DataTableColumnVisibility } from '@/components/data-table';
import { Search } from 'lucide-react';

interface InvestigationsTableProps {
  investigations: Investigation[];
  emptyMessage?: string;
}

export function InvestigationsTable({ 
  investigations, 
  emptyMessage = 'No investigations found.',
}: InvestigationsTableProps) {
  const router = useRouter();
  
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data: investigations,
    columns: investigationsColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      columnVisibility,
      rowSelection,
      sorting,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search investigations..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <DataTableColumnVisibility table={table} />
      </div>
      
      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
        <DataTable 
          table={table} 
          emptyMessage={emptyMessage}
          onRowClick={(investigation) => {
            router.push(`/investigations/${investigation.id}`);
          }}
        />
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
