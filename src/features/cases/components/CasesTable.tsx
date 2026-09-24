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
import { Search } from 'lucide-react';
import { Case } from '../types/case';
import { casesColumns } from './cases-columns';
import { DataTable, DataTablePagination, DataTableColumnVisibility } from '@/components/data-table';

interface CasesTableProps {
  cases: Case[];
  emptyMessage?: string;
}

export function CasesTable({ cases, emptyMessage = 'No cases found.' }: CasesTableProps) {
  const router = useRouter();
  
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data: cases,
    columns: casesColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      columnVisibility,
      rowSelection,
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      }
    }
  });

  return (
    <div className="space-y-4">
      {/* Search and Table Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search Case ID, title, transaction, analyst..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 w-full bg-card flex h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Note: Filters/Export can be placed here later if needed */}
          <DataTableColumnVisibility table={table} />
        </div>
      </div>
      
      <DataTable 
        table={table} 
        onRowClick={(row) => router.push(`/cases/${row.id}`)}
        emptyMessage={emptyMessage}
      />
      
      <DataTablePagination table={table} />
    </div>
  );
}
