'use client';

import { useState } from 'react';
import { AlertsTable } from './AlertsTable';
import { useAlerts } from '../hooks/useAlerts';
import { Alert } from '../types/alert';
import { AlertDetailsDrawer } from './AlertDetailsDrawer';

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
      <div className="bg-card border border-red-500/30 p-4 rounded-xl shadow-sm">
        <div className="text-sm text-red-500 font-medium mb-1">Breached Alerts</div>
        <div className="text-2xl font-bold">{activeBreaches}</div>
      </div>
      <div className="bg-card border border-red-500/30 p-4 rounded-xl shadow-sm">
        <div className="text-sm text-red-500 font-medium mb-1">Critical Breaches</div>
        <div className="text-2xl font-bold">{criticalBreaches}</div>
      </div>
      <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="text-sm text-muted-foreground font-medium mb-1">Longest Breach</div>
        <div className="text-2xl font-bold">{longestBreachText}</div>
      </div>
      <div className="bg-card border border-orange-500/30 p-4 rounded-xl shadow-sm">
        <div className="text-sm text-orange-500 font-medium mb-1">Unassigned Breaches</div>
        <div className="text-2xl font-bold">{unassignedBreaches}</div>
      </div>
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
