'use client';

import { useState } from 'react';
import { RiskHistoryFilters } from './RiskHistoryFilters';
import { RiskHistoryTable } from './RiskHistoryTable';
import { RiskHistoryDrawer } from './RiskHistoryDrawer';
import { RiskHistoryTimeline } from './RiskHistoryTimeline';
import { RiskHistoryRecord } from '../types/risk-history';
import { useRiskHistory, RiskHistoryFilterState } from '../hooks/useRiskHistory';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';

const defaultFilters: RiskHistoryFilterState = {
  search: '',
  timeRange: 'all',
  riskLevel: '',
  status: '',
  modelVersion: '',
};

export function RiskHistoryPage() {
  const [filters, setFilters] = useState<RiskHistoryFilterState>(defaultFilters);
  const [activeFilters, setActiveFilters] = useState<RiskHistoryFilterState>(defaultFilters);
  
  const [selectedRecord, setSelectedRecord] = useState<RiskHistoryRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: records = [], isLoading, isError, refetch } = useRiskHistory(activeFilters);

  const handleFilterChange = (key: keyof RiskHistoryFilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTimeRangeChange = (range: string) => {
    setFilters(prev => ({ ...prev, timeRange: range }));
    setActiveFilters(prev => ({ ...prev, timeRange: range }));
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setActiveFilters(defaultFilters);
  };

  const handleSearch = () => {
    setActiveFilters(filters);
  };

  const handleRecordClick = (record: RiskHistoryRecord) => {
    setSelectedRecord(record);
    setIsDrawerOpen(true);
  };

  return (
    <StaggerContainer className="flex flex-col max-w-[1600px] mx-auto w-full pb-6">
      <StaggerItem>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Risk History</h1>
              <span className="bg-primary/10 text-primary border border-primary/20 text-xs px-2 py-0.5 rounded-full font-medium">
                Mock Data
              </span>
            </div>
            <p className="text-muted-foreground mt-1">Track historical risk evaluations, score changes, and scoring configuration versions.</p>
          </div>
          
          <div className="flex items-center bg-card border border-border p-1 rounded-lg">
            {['24h', '7d', '30d', '90d', 'all'].map(range => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeFilters.timeRange === range 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {range === 'all' ? 'All Time' : range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </StaggerItem>
      
      <StaggerItem>
        <RiskHistoryFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          onSearch={handleSearch}
        />
      </StaggerItem>
      
      <StaggerItem className="mb-6">
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center border border-border rounded-xl bg-card text-muted-foreground">
            Loading timeline...
          </div>
        ) : (
          <RiskHistoryTimeline 
            records={records} 
            onPointClick={handleRecordClick} 
          />
        )}
      </StaggerItem>

      <StaggerItem className="flex-1 flex flex-col min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-12 text-muted-foreground border border-border rounded-xl bg-card mt-4">
            Loading risk history...
          </div>
        ) : isError ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground border border-border rounded-xl bg-card gap-2 mt-4">
            <span className="text-destructive">Failed to fetch history</span>
            <button onClick={() => refetch()} className="text-sm underline text-primary">Retry</button>
          </div>
        ) : (
          <RiskHistoryTable 
            historyRecords={records}
            onRecordClick={handleRecordClick}
          />
        )}
      </StaggerItem>

      <RiskHistoryDrawer 
        record={selectedRecord}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </StaggerContainer>
  );
}
