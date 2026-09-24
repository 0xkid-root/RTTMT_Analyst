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
import { Transaction } from '../../types/transaction';
import { explorerColumns } from '../shared/transaction-columns';
import { DataTable, DataTablePagination, DataTableColumnVisibility } from '@/components/data-table';

interface TransactionExplorerTableProps {
  transactions: Transaction[];
  onTransactionClick: (t: Transaction) => void;
}

export function TransactionExplorerTable({ transactions, onTransactionClick }: TransactionExplorerTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'timestamp', desc: true }
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: transactions,
    columns: explorerColumns,
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
      {/* Table Controls */}
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
