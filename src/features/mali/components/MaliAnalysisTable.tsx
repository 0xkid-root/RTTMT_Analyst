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
import { MaliAnalysisResult } from '../types/mali';
import { maliColumns } from './mali-columns';
import { DataTable, DataTablePagination, DataTableColumnVisibility } from '@/components/data-table';

interface MaliAnalysisTableProps {
  transactions: MaliAnalysisResult[];
  onTransactionClick: (t: MaliAnalysisResult) => void;
}

export function MaliAnalysisTable({ transactions, onTransactionClick }: MaliAnalysisTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'timestamp', desc: true }
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: transactions,
    columns: maliColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      }
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DataTableColumnVisibility table={table} />
      </div>

      <DataTable 
        table={table} 
        onRowClick={onTransactionClick}
        emptyMessage="No transactions found matching your criteria."
      />
      <DataTablePagination table={table} />
    </div>
  );
}
