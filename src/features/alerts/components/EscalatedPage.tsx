'use client';

import { useState } from 'react';
import { AlertsTable } from './AlertsTable';
import { useAlerts } from '../hooks/useAlerts';
import { Alert } from '../types/alert';
import { AlertDetailsDrawer } from './AlertDetailsDrawer';

export function EscalatedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: alerts = [], isLoading, refetch } = useAlerts({ search: searchQuery, escalated: true });
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Summary Metrics
  const activeEscalated = alerts.filter(a => a.status !== 'RESOLVED').length;
  const criticalEscalated = alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length;
  const awaitingReview = alerts.filter(a => a.status === 'NEW' || a.status === 'ACKNOWLEDGED').length;
  
  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  const SummaryCards = (
    <>
      <div className="bg-card border border-orange-500/30 p-4 rounded-xl shadow-sm">
        <div className="text-sm text-orange-500 font-medium mb-1">Escalated Alerts</div>
        <div className="text-2xl font-bold">{activeEscalated}</div>
      </div>
      <div className="bg-card border border-red-500/30 p-4 rounded-xl shadow-sm">
        <div className="text-sm text-red-500 font-medium mb-1">Critical Priority</div>
        <div className="text-2xl font-bold">{criticalEscalated}</div>
      </div>
      <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="text-sm text-muted-foreground font-medium mb-1">Awaiting Review</div>
        <div className="text-2xl font-bold">{awaitingReview}</div>
      </div>
    </>
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <AlertsTable
        title="Escalated Alerts"
        subtitle="Alerts escalated for additional review or intervention."
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
