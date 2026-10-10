'use client';

import { Search, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { HoverBorderRay } from '@/features/command-center/components/HoverBorderRay';
import { RiskHistoryFilterState } from '../hooks/useRiskHistory';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RiskHistoryFiltersProps {
  filters: RiskHistoryFilterState;
  onFilterChange: (key: keyof RiskHistoryFilterState, value: string) => void;
  onReset: () => void;
  onSearch: () => void;
}

export function RiskHistoryFilters({ filters, onFilterChange, onReset, onSearch }: RiskHistoryFiltersProps) {
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

  const handleChange = (key: keyof RiskHistoryFilterState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(key, e.target.value);
  };

  const handleSelectChange = (key: keyof RiskHistoryFilterState) => (value: string | null) => {
    onFilterChange(key, value === 'all' || value === null ? '' : value);
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

      <div className="relative w-full z-10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search by Transaction ID or Evaluation ID..."
          value={filters.search}
          onChange={handleChange('search')}
          className="w-full bg-background/50 backdrop-blur-sm border border-border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors hover:bg-background/80"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 z-10 relative">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Risk Level</label>
          <Select value={filters.riskLevel || 'all'} onValueChange={handleSelectChange('riskLevel')}>
            <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm border-border hover:bg-background/80 transition-colors h-[34px]">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Status</label>
          <Select value={filters.status || 'all'} onValueChange={handleSelectChange('status')}>
            <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm border-border hover:bg-background/80 transition-colors h-[34px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="ERROR">Error</SelectItem>
              <SelectItem value="FALLBACK">Fallback</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Model Version</label>
          <Select value={filters.modelVersion || 'all'} onValueChange={handleSelectChange('modelVersion')}>
            <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm border-border hover:bg-background/80 transition-colors h-[34px]">
              <SelectValue placeholder="All Versions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Versions</SelectItem>
              <SelectItem value="v2.4.1">v2.4.1</SelectItem>
              <SelectItem value="v2.4.0">v2.4.0</SelectItem>
              <SelectItem value="v2.3.0">v2.3.0</SelectItem>
            </SelectContent>
          </Select>
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
