'use client';

import { useState } from 'react';
import { AlertsTable } from './AlertsTable';
import { useAlerts } from '../hooks/useAlerts';
import { Alert } from '../types/alert';
import { AlertDetailsDrawer } from './AlertDetailsDrawer';

export function MyAlertsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: alerts = [], isLoading, refetch } = useAlerts({ search: searchQuery, assignedTo: 'Analyst A' });
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Summary Metrics
  const myActiveAlerts = alerts.filter(a => a.status !== 'RESOLVED').length;
  const inProgress = alerts.filter(a => a.status === 'IN_PROGRESS').length;
  const atRisk = alerts.filter(a => a.slaStatus === 'AT_RISK' && a.status !== 'RESOLVED').length;
  const escalated = alerts.filter(a => a.escalated).length;

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  const SummaryCards = (
    <>
      <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="text-sm text-muted-foreground font-medium mb-1">My Active Alerts</div>
        <div className="text-2xl font-bold">{myActiveAlerts}</div>
      </div>
      <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="text-sm text-muted-foreground font-medium mb-1">In Progress</div>
        <div className="text-2xl font-bold">{inProgress}</div>
      </div>
      <div className="bg-card border border-yellow-500/30 p-4 rounded-xl shadow-sm">
        <div className="text-sm text-yellow-500 font-medium mb-1">SLA At Risk</div>
        <div className="text-2xl font-bold">{atRisk}</div>
      </div>
      <div className="bg-card border border-orange-500/30 p-4 rounded-xl shadow-sm">
        <div className="text-sm text-orange-500 font-medium mb-1">Escalated</div>
        <div className="text-2xl font-bold">{escalated}</div>
      </div>
    </>
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <AlertsTable
        title="My Alerts"
        subtitle="Alerts currently assigned to you."
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
