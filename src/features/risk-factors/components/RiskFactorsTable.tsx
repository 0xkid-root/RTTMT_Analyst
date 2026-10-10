'use client';

import { 
  getCoreRowModel, 
  useReactTable, 
  getSortedRowModel, 
  SortingState,
  getPaginationRowModel
} from '@tanstack/react-table';
import { useState } from 'react';
import { RiskFactor } from '../types/risk-factor';
import { riskFactorColumns } from './risk-factor-columns';
import { DataTable } from '@/components/data-table/DataTable';
import { DataTablePagination } from '@/components/data-table/DataTablePagination';

interface RiskFactorsTableProps {
  factors: RiskFactor[];
  onFactorClick: (factor: RiskFactor) => void;
}

export function RiskFactorsTable({ factors, onFactorClick }: RiskFactorsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: factors,
    columns: riskFactorColumns,
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
        onRowClick={onFactorClick}
        emptyMessage="No risk factors found matching your criteria."
      />
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground ml-2">
          Showing {table.getRowModel().rows.length} of {factors.length} factors
        </div>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
