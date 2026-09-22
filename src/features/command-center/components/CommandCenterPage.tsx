'use client';

import { CommandCenterHeader } from './CommandCenterHeader';
import { RiskSummary } from './RiskSummary';
import { RiskMap } from './RiskMap';
import { PriorityActivity } from './PriorityActivity';
import { RiskActivityChart } from './RiskActivityChart';
import { TransactionActivity } from './TransactionActivity';
import { RiskDistribution } from './RiskDistribution';
import { RecentActivity } from './RecentActivity';

import {
  mockRiskSummary,
  mockRiskLocations,
  mockPriorityActivity,
  mockRiskChartData,
  mockTransactionActivity,
  mockRiskDistribution,
  mockRecentEvents
} from '../data/mock-command-center-data';

export function CommandCenterPage() {
  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto">
      <CommandCenterHeader />
      
      <RiskSummary data={mockRiskSummary} />
      
      {/* Main Operations Area */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-[500px]">
        {/* Map gets 3 columns on extra large screens */}
        <div className="xl:col-span-3">
          <RiskMap locations={mockRiskLocations} />
        </div>
        
        {/* Priority Activity gets 1 column */}
        <div className="xl:col-span-1">
          <PriorityActivity data={mockPriorityActivity} />
        </div>
      </div>
      
      {/* Secondary Operations Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskActivityChart data={mockRiskChartData} />
        <TransactionActivity data={mockTransactionActivity} />
      </div>
      
      {/* Tertiary Operations Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RiskDistribution data={mockRiskDistribution} />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity data={mockRecentEvents} />
        </div>
      </div>
      
    </div>
  );
}
