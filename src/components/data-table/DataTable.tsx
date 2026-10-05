'use client';

import {
  flexRender,
  Table as TanStackTable,
} from '@tanstack/react-table';

import { Row } from '@tanstack/react-table';

interface DataTableProps<TData> {
  table: TanStackTable<TData>;
  onRowClick?: (row: TData) => void;
  emptyMessage?: string;
  getRowProps?: (row: Row<TData>) => React.HTMLAttributes<HTMLTableRowElement>;
}

import { HoverBorderRay } from '@/features/command-center/components/HoverBorderRay';

export function DataTable<TData>({
  table,
  onRowClick,
  emptyMessage = 'No data available.',
  getRowProps,
}: DataTableProps<TData>) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm relative group overflow-hidden">
      <HoverBorderRay />
      <div className="overflow-x-auto relative z-10 bg-card rounded-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} className="px-4 py-4 font-medium">
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? 'cursor-pointer select-none flex items-center gap-1 hover:text-primary transition-colors'
                              : 'flex items-center gap-1'
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' ↑',
                            desc: ' ↓',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row.original)}
                  {...(getRowProps ? getRowProps(row) : {})}
                  className={`transition-colors hover:bg-muted/50 ${onRowClick ? 'cursor-pointer' : ''} ${getRowProps?.(row).className || ''}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={table.getAllColumns().length} className="px-4 py-12 text-center text-muted-foreground text-lg">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
