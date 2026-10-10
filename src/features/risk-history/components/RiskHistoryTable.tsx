'use client';

import { 
  getCoreRowModel, 
  useReactTable, 
  getSortedRowModel, 
  SortingState,
  getPaginationRowModel
} from '@tanstack/react-table';
import { useState } from 'react';
import { RiskHistoryRecord } from '../types/risk-history';
import { riskHistoryColumns } from './risk-history-columns';
import { DataTable } from '@/components/data-table/DataTable';
import { DataTablePagination } from '@/components/data-table/DataTablePagination';

interface RiskHistoryTableProps {
  historyRecords: RiskHistoryRecord[];
  onRecordClick: (record: RiskHistoryRecord) => void;
}

export function RiskHistoryTable({ historyRecords, onRecordClick }: RiskHistoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: historyRecords,
    columns: riskHistoryColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      }
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <DataTable 
        table={table} 
        onRowClick={onRecordClick}
        emptyMessage="No risk history records found matching your criteria."
      />
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground ml-2">
          Showing {table.getRowModel().rows.length} of {historyRecords.length} records
        </div>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
