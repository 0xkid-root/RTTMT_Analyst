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
        index={0}
        title="Total Transactions"
        value={data.totalTransactions.total}
        subtext={`${Math.abs(data.totalTransactions.trendPercent)}% vs. previous 24h`}
        trendDirection={data.totalTransactions.trendPercent >= 0 ? "up" : "down"}
        trendTone="neutral"
        isLive={true}
        liveTone="success"
        icon={<ArrowLeftRight className="h-5 w-5 text-primary" />}
      />
      
      <RiskKpiCard
        index={1}
        title="High Risk Transactions"
        value={data.highRiskTransactions.total}
        subtext={`${Math.abs(data.highRiskTransactions.trendPercent)}% vs. previous 24h`}
        trendDirection={data.highRiskTransactions.trendPercent >= 0 ? "up" : "down"}
        trendTone={data.highRiskTransactions.trendPercent >= 0 ? "negative" : "positive"}
        isLive={true}
        liveTone="danger"
        icon={<AlertTriangle className="h-5 w-5 text-danger" />}
      />
      
      <RiskKpiCard
        index={2}
        title="Open Alerts"
        value={data.openAlerts.total}
        subtext={`${Math.abs(data.openAlerts.trendPercent)}% vs. previous 24h`}
        trendDirection={data.openAlerts.trendPercent >= 0 ? "up" : "down"}
        trendTone={data.openAlerts.trendPercent >= 0 ? "negative" : "positive"}
        isLive={true}
        liveTone="danger"
        icon={<Bell className="h-5 w-5 text-danger" />}
      />
      
      <RiskKpiCard
        index={3}
        title="Open Cases"
        value={data.openCases.total}
        subtext={`${Math.abs(data.openCases.trendPercent)}% vs. previous 24h`}
        trendDirection={data.openCases.trendPercent >= 0 ? "up" : "down"}
        trendTone={data.openCases.trendPercent >= 0 ? "negative" : "positive"}
        icon={<FolderOpen className="h-5 w-5 text-warning" />}
      />
      
      <RiskKpiCard
        index={4}
        title="Resolved Today"
        value={data.resolvedToday.total}
        subtext={`${Math.abs(data.resolvedToday.trendPercent)}% vs. previous 24h`}
        trendDirection={data.resolvedToday.trendPercent >= 0 ? "up" : "down"}
        trendTone={data.resolvedToday.trendPercent >= 0 ? "positive" : "negative"}
        icon={<CheckCircle2 className="h-5 w-5 text-success" />}
      />

      <RiskKpiCard
        index={5}
        title="SLA Breached"
        value={data.slaBreached.total}
        subtext={`${Math.abs(data.slaBreached.trendPercent)}% vs. previous 24h`}
        trendDirection={data.slaBreached.trendPercent >= 0 ? "up" : "down"}
        trendTone={data.slaBreached.trendPercent >= 0 ? "negative" : "positive"}
        isLive={true}
        liveTone="warning"
        icon={<Clock className="h-5 w-5 text-indigo-400" />}
      />
    </div>
  );
}
