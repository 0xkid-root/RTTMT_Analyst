'use client';

import { useState, useEffect, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  VisibilityState
} from '@tanstack/react-table';
import { Transaction } from '../../types/transaction';
import { liveColumns } from '../shared/transaction-columns';
import { DataTable, DataTableColumnVisibility } from '@/components/data-table';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LiveTransactionsTableProps {
  transactions: Transaction[];
  searchTerm: string;
  onTransactionClick: (t: Transaction) => void;
  autoScroll: boolean;
  setAutoScroll: (val: boolean) => void;
  newCount: number;
  setNewCount: React.Dispatch<React.SetStateAction<number>>;
}

export function LiveTransactionsTable({ 
  transactions,
  searchTerm, 
  onTransactionClick,
  autoScroll,
  setAutoScroll,
  newCount,
  setNewCount
}: LiveTransactionsTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  
  // Track previous transactions length to detect new arrivals
  const prevLengthRef = useRef(transactions.length);

  const filtered = transactions.filter(t => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return t.id.toLowerCase().includes(term) || 
           t.merchant.toLowerCase().includes(term) || 
           t.accountReference.toLowerCase().includes(term);
  });

  const table = useReactTable({
    data: filtered,
    columns: liveColumns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  // Handle new transactions arriving
  useEffect(() => {
    if (transactions.length > prevLengthRef.current) {
      const added = transactions.length - prevLengthRef.current;
      if (autoScroll) {
        // Auto scroll to bottom
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
          }
        }, 50);
      } else {
        // Increment new count if auto-scroll is off
        setNewCount(prev => prev + added);
      }
    }
    prevLengthRef.current = transactions.length;
  }, [transactions, autoScroll, setNewCount]);

  // Handle manual scrolling
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
    
    if (!isAtBottom && autoScroll) {
      setAutoScroll(false); // User scrolled up
    } else if (isAtBottom && !autoScroll) {
      setAutoScroll(true); // User reached the bottom naturally
      setNewCount(0);
    }
  };

  const jumpToLatest = () => {
    setAutoScroll(true);
    setNewCount(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-2 relative">
      <div className="flex justify-between items-center px-1">
        <div className="text-sm text-muted-foreground font-medium">
          {newCount > 0 ? (
            <span className="text-primary font-semibold">{newCount} new transactions</span>
          ) : (
            <span>Live stream active</span>
          )}
        </div>
        <div className="flex gap-4 items-center">
          {newCount > 0 && !autoScroll && (
            <Button 
              size="sm" 
              variant="default" 
              className="h-8 gap-2 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
              onClick={jumpToLatest}
            >
              <ArrowDown className="w-4 h-4" />
              Jump to latest
            </Button>
          )}
          <DataTableColumnVisibility table={table} />
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        <DataTable 
          table={table} 
          onRowClick={onTransactionClick}
          emptyMessage="No live transactions found."
        />
      </div>

      <div className="p-2 bg-muted/20 text-center text-xs text-muted-foreground rounded-lg border border-border">
        Live stream • Showing latest {Math.min(filtered.length, 100)} transactions
      </div>
    </div>
  );
}
