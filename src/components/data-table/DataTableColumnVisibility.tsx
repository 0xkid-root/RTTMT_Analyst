'use client';

import { Table } from '@tanstack/react-table';
import { Columns, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface DataTableColumnVisibilityProps<TData> {
  table: Table<TData>;
}

export function DataTableColumnVisibility<TData>({ table }: DataTableColumnVisibilityProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors"
      >
        <Columns className="w-4 h-4" />
        View
        <ChevronDown className="w-4 h-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-md z-50 p-2">
          <div className="px-2 py-1.5 text-sm font-semibold text-foreground">
            Toggle columns
          </div>
          <div className="my-1 h-px bg-border" />
          <div className="max-h-60 overflow-y-auto">
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== 'undefined' && column.getCanHide()
              )
              .map((column) => {
                return (
                  <label
                    key={column.id}
                    className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-muted/50 rounded-sm"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-primary/50 text-primary focus:ring-primary h-4 w-4 bg-transparent"
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                    />
                    <span className="capitalize">{column.id.replace('_', ' ')}</span>
                  </label>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
