'use client';

import { Search, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { HoverBorderRay } from '@/features/command-center/components/HoverBorderRay';

export interface FilterState {
  search: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  riskLevel: string;
  status: string;
  paymentMethod: string;
  transactionType: string;
  location: string;
}

interface TransactionExplorerFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  onSearch: () => void;
}

export function TransactionExplorerFilters({ filters, onFilterChange, onReset, onSearch }: TransactionExplorerFiltersProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isReducedMotion || !cardRef.current || e.pointerType !== 'mouse') return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleChange = (key: keyof FilterState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFilterChange(key, e.target.value);
  };

  return (
    <div 
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`bg-card border border-border p-5 rounded-xl mb-6 space-y-4 group relative overflow-hidden transition-all duration-300 ${
        !isReducedMotion ? "hover:-translate-y-[1px] hover:bg-foreground/[0.02] hover:border-foreground/15 hover:shadow-[-8px_0_24px_-4px_rgba(0,0,0,0.4)] shadow-sm" : ""
      }`}
    >
      {!isReducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.04), transparent 70%)'
          }}
        />
      )}
      
      <HoverBorderRay />

      {/* Primary Search */}
      <div className="relative w-full z-10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search by Transaction ID, Merchant, Account, Reference ID..."
          value={filters.search}
          onChange={handleChange('search')}
          className="w-full bg-background/50 backdrop-blur-sm border border-border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors hover:bg-background/80"
        />
      </div>

      {/* Advanced Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 z-10 relative">
        
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Date Range (Start)</label>
          <input type="date" value={filters.startDate} onChange={handleChange('startDate')} className="bg-background/50 backdrop-blur-sm border border-border rounded-md px-3 py-1.5 text-sm hover:bg-background/80 transition-colors focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Date Range (End)</label>
          <input type="date" value={filters.endDate} onChange={handleChange('endDate')} className="bg-background/50 backdrop-blur-sm border border-border rounded-md px-3 py-1.5 text-sm hover:bg-background/80 transition-colors focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Min Amount</label>
          <input type="number" placeholder="0" value={filters.minAmount} onChange={handleChange('minAmount')} className="bg-background/50 backdrop-blur-sm border border-border rounded-md px-3 py-1.5 text-sm hover:bg-background/80 transition-colors focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Max Amount</label>
          <input type="number" placeholder="No limit" value={filters.maxAmount} onChange={handleChange('maxAmount')} className="bg-background/50 backdrop-blur-sm border border-border rounded-md px-3 py-1.5 text-sm hover:bg-background/80 transition-colors focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Risk Level</label>
          <select value={filters.riskLevel} onChange={handleChange('riskLevel')} className="bg-background/50 backdrop-blur-sm border border-border rounded-md px-3 py-1.5 text-sm hover:bg-background/80 transition-colors focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="">All</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Status</label>
          <select value={filters.status} onChange={handleChange('status')} className="bg-background/50 backdrop-blur-sm border border-border rounded-md px-3 py-1.5 text-sm hover:bg-background/80 transition-colors focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="">All</option>
            <option value="CLEAR">Clear</option>
            <option value="ALERT">Alert</option>
            <option value="REVIEW">Review</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Payment Method</label>
          <select value={filters.paymentMethod} onChange={handleChange('paymentMethod')} className="bg-background/50 backdrop-blur-sm border border-border rounded-md px-3 py-1.5 text-sm hover:bg-background/80 transition-colors focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="">All</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
            <option value="NETBANKING">Net Banking</option>
            <option value="WALLET">Wallet</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Transaction Type</label>
          <select value={filters.transactionType} onChange={handleChange('transactionType')} className="bg-background/50 backdrop-blur-sm border border-border rounded-md px-3 py-1.5 text-sm hover:bg-background/80 transition-colors focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="">All</option>
            <option value="PAYMENT">Payment</option>
            <option value="TRANSFER">Transfer</option>
            <option value="WITHDRAWAL">Withdrawal</option>
            <option value="REFUND">Refund</option>
          </select>
        </div>

      </div>

      <div className="flex justify-end items-center gap-3 pt-2 z-10 relative">
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button variant="default" size="sm" onClick={onSearch} className="bg-primary text-primary-foreground hover:bg-primary/90 px-6">
          Search
        </Button>
      </div>
    </div>
  );
}
