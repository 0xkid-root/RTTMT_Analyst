'use client';

import { useState, useMemo } from 'react';
import { RiskFactorsFilters } from './RiskFactorsFilters';
import { RiskFactorsTable } from './RiskFactorsTable';
import { RiskFactorDrawer } from './RiskFactorDrawer';
import { RiskFactor } from '../types/risk-factor';
import { useRiskFactors, RiskFactorFilterState } from '../hooks/useRiskFactors';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';

const defaultFilters: RiskFactorFilterState = {
  search: '',
  category: '',
  riskLevel: '',
};

export function RiskFactorsPage() {
  const [filters, setFilters] = useState<RiskFactorFilterState>(defaultFilters);
  const [activeFilters, setActiveFilters] = useState<RiskFactorFilterState>(defaultFilters);
  
  const [selectedFactor, setSelectedFactor] = useState<RiskFactor | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: factors = [], isLoading, isError, refetch } = useRiskFactors(activeFilters);

  const handleFilterChange = (key: keyof RiskFactorFilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setActiveFilters(defaultFilters);
  };

  const handleSearch = () => {
    setActiveFilters(filters);
  };

  const handleFactorClick = (f: RiskFactor) => {
    setSelectedFactor(f);
    setIsDrawerOpen(true);
  };

  // Factor summary calculations
  const summary = useMemo(() => {
    let highImpact = 0;
    let positive = 0;
    let negative = 0;

    factors.forEach(f => {
      if (f.severity === 'high' || f.severity === 'critical') highImpact++;
      if (f.direction === 'decrease') positive++;
      if (f.direction === 'increase') negative++;
    });

    return { total: factors.length, highImpact, positive, negative };
  }, [factors]);

  return (
    <StaggerContainer className="flex flex-col max-w-[1600px] mx-auto w-full pb-6">
      <StaggerItem>
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Risk Factors</h1>
            <span className="bg-primary/10 text-primary border border-primary/20 text-xs px-2 py-0.5 rounded-full font-medium">
              Mock Data
            </span>
          </div>
          <p className="text-muted-foreground mt-1">Understand the signals and features influencing transaction risk.</p>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="text-sm text-muted-foreground mb-1">Total Factors</div>
            <div className="text-2xl font-bold font-mono">{summary.total}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="text-sm text-muted-foreground mb-1">High Impact</div>
            <div className="text-2xl font-bold font-mono text-orange-500">{summary.highImpact}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="text-sm text-muted-foreground mb-1">Negative Indicators</div>
            <div className="text-2xl font-bold font-mono text-orange-500">{summary.negative}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="text-sm text-muted-foreground mb-1">Positive Indicators</div>
            <div className="text-2xl font-bold font-mono text-green-500">{summary.positive}</div>
          </div>
        </div>
      </StaggerItem>
      
      <StaggerItem>
        <RiskFactorsFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          onSearch={handleSearch}
        />
      </StaggerItem>
      
      <StaggerItem className="flex-1 flex flex-col min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-12 text-muted-foreground border border-border rounded-xl bg-card mt-4">
            Loading risk factors...
          </div>
        ) : isError ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground border border-border rounded-xl bg-card gap-2 mt-4">
            <span className="text-destructive">Failed to fetch factors</span>
            <button onClick={() => refetch()} className="text-sm underline text-primary">Retry</button>
          </div>
        ) : (
          <RiskFactorsTable 
            factors={factors}
            onFactorClick={handleFactorClick}
          />
        )}
      </StaggerItem>

      <RiskFactorDrawer 
        factor={selectedFactor}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </StaggerContainer>
  );
}
