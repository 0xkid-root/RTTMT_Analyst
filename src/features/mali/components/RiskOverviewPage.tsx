'use client';

import { useState } from 'react';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';
import { RiskKpiCard } from '@/features/command-center/components/RiskKpiCard';
import { RiskDistributionChart } from '@/features/command-center/components/RiskDistributionChart';
import { RiskTrendChart } from './RiskTrendChart';
import { mockRiskOverviewData } from '../data/mockRiskOverview';
import { Activity, ShieldAlert, DatabaseZap, Clock, Layers } from 'lucide-react';

export function RiskOverviewPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real implementation, data fetching would be controlled by timeRange
  const data = mockRiskOverviewData;

  const handleTimeRangeChange = (val: string) => {
    setIsLoading(true);
    setTimeRange(val);
    setTimeout(() => setIsLoading(false), 600);
  };

  return (
    <StaggerContainer className="flex flex-col max-w-[1600px] mx-auto w-full pb-6 space-y-6">
      
      {/* 2. Page header and filters */}
      <StaggerItem>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Risk Overview</h1>
              <span className="bg-primary/10 text-primary border border-primary/20 text-xs px-2 py-0.5 rounded-full font-medium">
                Mock Data
              </span>
            </div>
            <p className="text-muted-foreground mt-1">Risk scoring performance and distribution</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              className="w-[180px] bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last Quarter</option>
            </select>
          </div>
        </div>
      </StaggerItem>

      {/* 3. Evaluation summary */}
      <StaggerItem>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <RiskKpiCard
            title="Total Evaluations"
            value={data.summary.totalEvaluations}
            icon={<Activity className="w-5 h-5 text-primary" />}
          />
          <RiskKpiCard
            title="High-Risk Evaluations"
            value={Math.round(data.summary.totalEvaluations * (data.summary.highRiskPercentage / 100))}
            subtext={`${data.summary.highRiskPercentage.toFixed(1)}% of total`}
            trendTone="warning"
            icon={<ShieldAlert className="w-5 h-5 text-orange-500" />}
          />
          <RiskKpiCard
            title="Scoring Failure Rate"
            value={data.summary.failureRate}
            subtext="Failed out of total"
            trendTone="negative"
            icon={<DatabaseZap className="w-5 h-5 text-destructive" />}
          />
          
          <div className="bg-background border border-border rounded-xl p-4 flex flex-col justify-between relative overflow-hidden shadow-sm">
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted">
                <Layers className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Active Configuration</h3>
            </div>
            <div className="relative z-10">
              <div className="text-lg font-bold tracking-tight text-foreground truncate">
                Model: <span className="font-mono">{data.summary.currentModelVersion}</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground truncate">
                Threshold: <span className="font-mono">{data.summary.currentThresholdVersion}</span>
              </div>
            </div>
          </div>
        </div>
      </StaggerItem>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 4. Risk score distribution */}
        <StaggerItem className="lg:col-span-1 min-h-[300px]">
          <RiskDistributionChart data={data.distribution} />
        </StaggerItem>

        {/* 5. Risk score trends */}
        <StaggerItem className="lg:col-span-2 min-h-[300px]">
          <RiskTrendChart data={data.trends} />
        </StaggerItem>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 6. Scoring system health */}
        <StaggerItem>
          <div className="bg-background border border-border rounded-xl p-5 h-full">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" /> Scoring System Health
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-card border border-border/50">
                <span className="text-muted-foreground">Successful Evaluations</span>
                <span className="font-mono font-medium">{data.health.successful.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-card border border-border/50">
                <span className="text-muted-foreground">Failed Evaluations</span>
                <span className="font-mono font-medium text-destructive">{data.health.failed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-card border border-border/50">
                <span className="text-muted-foreground">Average Latency</span>
                <span className="font-mono font-medium">{data.health.averageLatencyMs} ms</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-card border border-border/50">
                <span className="text-muted-foreground">Availability</span>
                <span className="font-mono font-medium text-emerald-500">{data.health.availabilityPercentage.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* 7. Model and threshold versions */}
        <StaggerItem>
          <div className="bg-background border border-border rounded-xl p-5 h-full">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Model & Version Metadata
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-card border border-border/50">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Model Name</span>
                  <span className="font-mono text-sm">{data.modelMetadata.modelName}</span>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border/50">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Status</span>
                  <span className="text-sm font-medium text-emerald-500">{data.modelMetadata.status}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Model Version</span>
                  <span className="font-mono text-sm">{data.modelMetadata.modelVersion}</span>
                </div>
                <div className="flex justify-between items-center p-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Feature Set</span>
                  <span className="font-mono text-sm">{data.modelMetadata.featureSetVersion}</span>
                </div>
                <div className="flex justify-between items-center p-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Signal Rules</span>
                  <span className="font-mono text-sm">{data.modelMetadata.signalVersions}</span>
                </div>
                <div className="flex justify-between items-center p-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Thresholds</span>
                  <span className="font-mono text-sm">{data.modelMetadata.thresholdVersion}</span>
                </div>
              </div>

              <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> Effective Date: {new Date(data.modelMetadata.effectiveDate).toLocaleString()}
              </div>
            </div>
          </div>
        </StaggerItem>
      </div>

    </StaggerContainer>
  );
}
