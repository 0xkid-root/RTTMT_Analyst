'use client';

import { CommandCenterHeader } from './CommandCenterHeader';
import { RiskSummary } from './RiskSummary';
import dynamic from 'next/dynamic';
const TransactionRiskMap = dynamic(() => import('./TransactionRiskMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-background border border-border rounded-xl text-muted-foreground">Loading Risk Map...</div>
});
import { RiskDistributionChart } from './RiskDistributionChart';
import { MaliScoreChart } from './MaliScoreChart';
import { TopRulesList } from './TopRulesList';

import { RecentAlertsTable } from './RecentAlertsTable';
import { TransactionVolumeChart } from './TransactionVolumeChart';
import { AlertTrendChart } from './AlertTrendChart';
import { RecentCasesTable } from './RecentCasesTable';

import {
  mockRiskSummary,
  mockRiskLocations,
  mockTopRules,
  mockMaliScoreDistribution,
  mockRecentAlerts,
  mockTransactionVolume,
  mockAlertTrend,
  mockRecentCases,
  mockNetworkEdges
} from '../data/mock-command-center-data';

export function CommandCenterPage() {
  const totalTrans = mockRiskSummary.totalTransactions.total;
  const distributionData = {
    totalTransactions: totalTrans,
    low: { count: Math.round(totalTrans * 0.813), percentage: 81.3 },
    medium: { count: Math.round(totalTrans * 0.136), percentage: 13.6 },
    high: { count: Math.round(totalTrans * 0.040), percentage: 4.0 },
    critical: { count: Math.round(totalTrans * 0.011), percentage: 1.1 },
  };

  return (
    <div className="flex flex-col gap-5 max-w-[1600px] mx-auto">
      <CommandCenterHeader />
      
      {/* Row 1: KPIs */}
      <RiskSummary data={mockRiskSummary} />
      
      {/* Row 2: Map (Full Width) */}
      <div className="w-full h-[500px] xl:h-[600px] rounded-xl overflow-hidden border border-border">
        <TransactionRiskMap />
      </div>
      
      {/* Row 3: Charts and Lists (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <RiskDistributionChart data={distributionData} />
        <MaliScoreChart data={mockMaliScoreDistribution} />
        <TopRulesList data={mockTopRules} />
      </div>
      
      {/* Row 4: Bottom Tables and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RecentAlertsTable data={mockRecentAlerts} />
        <TransactionVolumeChart data={mockTransactionVolume} />
        <AlertTrendChart data={mockAlertTrend} />
        <RecentCasesTable data={mockRecentCases} />
      </div>
      
    </div>
  );
}
