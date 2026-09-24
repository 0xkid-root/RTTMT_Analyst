'use client';

import { useState } from 'react';
import { AlertsTable } from './AlertsTable';
import { useAlerts } from '../hooks/useAlerts';
import { Alert } from '../types/alert';
import { AlertDetailsDrawer } from './AlertDetailsDrawer';

export function AlertQueuePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: alerts = [], isLoading, refetch } = useAlerts({ search: searchQuery });
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Summary Metrics
  const activeAlerts = alerts.filter(a => a.status !== 'RESOLVED').length;
  const critical = alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length;
  const highRisk = alerts.filter(a => a.severity === 'HIGH' && a.status !== 'RESOLVED').length;
  const slaBreached = alerts.filter(a => a.slaStatus === 'BREACHED' && a.status !== 'RESOLVED').length;

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  const SummaryCards = (
    <>
      <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="text-sm text-muted-foreground font-medium mb-1">Active Alerts</div>
        <div className="text-2xl font-bold">{activeAlerts}</div>
      </div>
      <div className="bg-card border border-red-500/30 p-4 rounded-xl shadow-sm">
        <div className="text-sm text-red-500 font-medium mb-1">Critical</div>
        <div className="text-2xl font-bold">{critical}</div>
      </div>
      <div className="bg-card border border-orange-500/30 p-4 rounded-xl shadow-sm">
        <div className="text-sm text-orange-500 font-medium mb-1">High Risk</div>
        <div className="text-2xl font-bold">{highRisk}</div>
      </div>
      <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="text-sm text-muted-foreground font-medium mb-1">SLA Breached</div>
        <div className="text-2xl font-bold">{slaBreached}</div>
      </div>
    </>
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <AlertsTable
        title="Alert Queue"
        subtitle="Monitor and manage risk alerts detected across the platform."
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
