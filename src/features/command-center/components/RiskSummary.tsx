import { ArrowLeftRight, AlertTriangle, Bell, FolderOpen, CheckCircle2, Clock } from 'lucide-react';
import { RiskKpiCard } from './RiskKpiCard';
import type { RiskSummary as RiskSummaryType } from '../types/command-center-types';

interface RiskSummaryProps {
  data: RiskSummaryType;
}

export function RiskSummary({ data }: RiskSummaryProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <RiskKpiCard
        title="Total Transactions"
        value={data.totalTransactions.total.toLocaleString()}
        subtext={`↑ ${data.totalTransactions.trendPercent}% vs. previous 24h`}
        trend="neutral"
        icon={<ArrowLeftRight className="h-5 w-5 text-primary" />}
      />
      
      <RiskKpiCard
        title="High Risk Transactions"
        value={data.highRiskTransactions.total.toLocaleString()}
        subtext={`↑ ${data.highRiskTransactions.trendPercent}% vs. previous 24h`}
        trend="up"
        icon={<AlertTriangle className="h-5 w-5 text-danger" />}
      />
      
      <RiskKpiCard
        title="Open Alerts"
        value={data.openAlerts.total.toLocaleString()}
        subtext={`↓ ${Math.abs(data.openAlerts.trendPercent)}% vs. previous 24h`}
        trend="down"
        icon={<Bell className="h-5 w-5 text-danger" />}
      />
      
      <RiskKpiCard
        title="Open Cases"
        value={data.openCases.total.toLocaleString()}
        subtext={`↓ ${Math.abs(data.openCases.trendPercent)}% vs. previous 24h`}
        trend="down"
        icon={<FolderOpen className="h-5 w-5 text-warning" />}
      />
      
      <RiskKpiCard
        title="Resolved Today"
        value={data.resolvedToday.total.toLocaleString()}
        subtext={`↑ ${data.resolvedToday.trendPercent}% vs. previous 24h`}
        trend="down" // down = success visually for trend colors in KPI card currently, wait, I should fix trend colors if 'down' is success. Actually trend='up' is red in kpi card. I'll make a custom one or just fix RiskKpiCard.
        icon={<CheckCircle2 className="h-5 w-5 text-success" />}
      />

      <RiskKpiCard
        title="SLA Breached"
        value={data.slaBreached.total.toLocaleString()}
        subtext={`↑ ${data.slaBreached.trendPercent}% vs. previous 24h`}
        trend="up"
        icon={<Clock className="h-5 w-5 text-indigo-400" />}
      />
    </div>
  );
}
