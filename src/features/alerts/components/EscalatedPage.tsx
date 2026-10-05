'use client';

import { useState } from 'react';
import { AlertsTable } from './AlertsTable';
import { useAlerts } from '../hooks/useAlerts';
import { Alert } from '../types/alert';
import { AlertDetailsDrawer } from './AlertDetailsDrawer';
import { RiskKpiCard } from '@/features/command-center/components/RiskKpiCard';

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
    <div className="grid grid-cols-3 gap-4">
      <RiskKpiCard title="Escalated Alerts" value={activeEscalated} index={0} isLive={activeEscalated > 0} liveTone="danger" />
      <RiskKpiCard title="Critical Priority" value={criticalEscalated} index={1} isLive={criticalEscalated > 0} liveTone="danger" />
      <RiskKpiCard title="Awaiting Review" value={awaitingReview} index={2} />
    </div>
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
