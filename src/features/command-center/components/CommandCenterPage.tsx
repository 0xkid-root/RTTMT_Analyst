'use client';

import { CommandCenterHeader } from './CommandCenterHeader';
import { RiskSummary } from './RiskSummary';
import { RiskMap } from './RiskMap';

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
      
      {/* Row 2: Map & Right Column Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        
        {/* Left: Map (66%) */}
        <div className="xl:col-span-2 min-h-[500px]">
          <RiskMap locations={mockRiskLocations} edges={mockNetworkEdges} />
        </div>
        
        {/* Right: Charts and Lists (33%) */}
        <div className="xl:col-span-1 flex flex-col gap-5">
          <RiskDistributionChart data={distributionData} />
          <MaliScoreChart data={mockMaliScoreDistribution} />
          <TopRulesList data={mockTopRules} />
        </div>
        
      </div>
      
      {/* Row 3: Bottom Tables and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RecentAlertsTable data={mockRecentAlerts} />
        <TransactionVolumeChart data={mockTransactionVolume} />
        <AlertTrendChart data={mockAlertTrend} />
        <RecentCasesTable data={mockRecentCases} />
      </div>
      
    </div>
  );
}
