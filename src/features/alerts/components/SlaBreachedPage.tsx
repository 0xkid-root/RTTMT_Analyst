'use client';

import { useState } from 'react';
import { AlertsTable } from './AlertsTable';
import { useAlerts } from '../hooks/useAlerts';
import { Alert } from '../types/alert';
import { AlertDetailsDrawer } from './AlertDetailsDrawer';
import { RiskKpiCard } from '@/features/command-center/components/RiskKpiCard';

export function SlaBreachedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: alerts = [], isLoading, refetch } = useAlerts({ search: searchQuery, slaStatus: 'BREACHED' });
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Summary Metrics
  const activeBreaches = alerts.filter(a => a.status !== 'RESOLVED').length;
  const criticalBreaches = alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length;
  const unassignedBreaches = alerts.filter(a => !a.assignedTo && a.status !== 'RESOLVED').length;
  
  const longestBreachMin = alerts.reduce((max, a) => {
    if (a.status !== 'RESOLVED' && a.slaBreachedByMinutes && a.slaBreachedByMinutes > max) {
      return a.slaBreachedByMinutes;
    }
    return max;
  }, 0);
  const longestBreachText = longestBreachMin > 0 
    ? `+${Math.floor(longestBreachMin / 60)}h ${longestBreachMin % 60}m` 
    : 'None';

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  const SummaryCards = (
    <div className="grid grid-cols-4 gap-4">
      <RiskKpiCard title="Breached Alerts" value={activeBreaches} index={0} isLive={activeBreaches > 0} liveTone="danger" />
      <RiskKpiCard title="Critical Breaches" value={criticalBreaches} index={1} isLive={criticalBreaches > 0} liveTone="danger" />
      <RiskKpiCard title="Longest Breach" value={longestBreachMin} subtext={longestBreachText} index={2} />
      <RiskKpiCard title="Unassigned Breaches" value={unassignedBreaches} index={3} isLive={unassignedBreaches > 0} liveTone="warning" />
    </div>
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <AlertsTable
        title="SLA Breached"
        subtitle="Alerts that have exceeded their required response or resolution time."
        alerts={alerts}
        isLoading={isLoading}
        onRefresh={() => refetch()}
        onAlertClick={handleAlertClick}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        summaryCards={SummaryCards}
      />
      <AlertDetailsDrawer 
        alert={selectedAlert}
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </div>
  );
}
