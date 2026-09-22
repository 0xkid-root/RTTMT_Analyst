import { BellRing, ShieldAlert, Activity, AlertTriangle, Briefcase } from 'lucide-react';
import { RiskKpiCard } from './RiskKpiCard';
import type { RiskSummary as RiskSummaryType } from '../types/command-center-types';

interface RiskSummaryProps {
  data: RiskSummaryType;
}

export function RiskSummary({ data }: RiskSummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      <RiskKpiCard
        title="Active Alerts"
        value={data.activeAlerts.total}
        subtext={`+${data.activeAlerts.trend} today`}
        trend="up"
        icon={<BellRing className="h-4 w-4" />}
      />
      
      <RiskKpiCard
        title="High Risk"
        value={data.highRisk.total}
        subtext={`${data.highRisk.critical} critical`}
        trend="up"
        icon={<ShieldAlert className="h-4 w-4 text-danger/70" />}
      />
      
      <RiskKpiCard
        title="Transactions"
        value={`${(data.transactions.total / 1000000).toFixed(2)}M`}
        subtext={`+${data.transactions.trendPercent}%`}
        trend="neutral" // Neutral because high transactions isn't necessarily bad risk
        icon={<Activity className="h-4 w-4" />}
      />
      
      <RiskKpiCard
        title="Risk Rate"
        value={`${data.riskRate.value}%`}
        subtext={`↓ ${Math.abs(data.riskRate.trendPercent)}%`}
        trend="down"
        icon={<AlertTriangle className="h-4 w-4" />}
      />
      
      <RiskKpiCard
        title="Open Cases"
        value={data.openCases.total}
        subtext={`${data.openCases.priority} priority`}
        trend="neutral"
        icon={<Briefcase className="h-4 w-4" />}
      />
    </div>
  );
}
