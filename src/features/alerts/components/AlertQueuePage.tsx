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
  const [activeTab, setActiveTab] = useState('All');

  // Summary Metrics
  const activeAlertsCount = alerts.filter(a => a.status !== 'RESOLVED').length;
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length;
  const highRiskCount = alerts.filter(a => a.severity === 'HIGH' && a.status !== 'RESOLVED').length;
  const mediumRiskCount = alerts.filter(a => a.severity === 'MEDIUM' && a.status !== 'RESOLVED').length;
  const lowRiskCount = alerts.filter(a => a.severity === 'LOW' && a.status !== 'RESOLVED').length;
  const slaBreached = alerts.filter(a => a.slaStatus === 'BREACHED' && a.status !== 'RESOLVED').length;

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Critical') return alert.severity === 'CRITICAL';
    if (activeTab === 'High') return alert.severity === 'HIGH';
    if (activeTab === 'Medium') return alert.severity === 'MEDIUM';
    if (activeTab === 'Low') return alert.severity === 'LOW';
    return true;
  });

  const tabs = [
    { id: 'All', label: 'All', count: activeAlertsCount, color: 'bg-primary/20 text-primary', activeColor: 'bg-primary text-primary-foreground' },
    { id: 'Critical', label: 'Critical', count: criticalCount, color: 'bg-card text-muted-foreground', activeColor: 'bg-red-500/20 text-red-500' },
    { id: 'High', label: 'High', count: highRiskCount, color: 'bg-card text-muted-foreground', activeColor: 'bg-orange-500/20 text-orange-500' },
    { id: 'Medium', label: 'Medium', count: mediumRiskCount, color: 'bg-card text-muted-foreground', activeColor: 'bg-yellow-500/20 text-yellow-500' },
    { id: 'Low', label: 'Low', count: lowRiskCount, color: 'bg-card text-muted-foreground', activeColor: 'bg-green-500/20 text-green-500' },
  ];

  const SummaryCards = (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
          <div className="text-sm text-muted-foreground font-medium mb-1">Active Alerts</div>
          <div className="text-2xl font-bold">{activeAlertsCount}</div>
        </div>
        <div className="bg-card border border-red-500/30 p-4 rounded-xl shadow-sm">
          <div className="text-sm text-red-500 font-medium mb-1">Critical</div>
          <div className="text-2xl font-bold">{criticalCount}</div>
        </div>
        <div className="bg-card border border-orange-500/30 p-4 rounded-xl shadow-sm">
          <div className="text-sm text-orange-500 font-medium mb-1">High Risk</div>
          <div className="text-2xl font-bold">{highRiskCount}</div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
          <div className="text-sm text-muted-foreground font-medium mb-1">SLA Breached</div>
          <div className="text-2xl font-bold">{slaBreached}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-border/50
                ${isActive ? tab.activeColor : 'bg-transparent hover:bg-white/5 text-muted-foreground'}`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-md text-xs font-semibold
                ${isActive ? 'bg-black/20 text-current' : 'bg-white/10 text-muted-foreground'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <AlertsTable
        title="Alert Queue"
        subtitle="Monitor and manage risk alerts detected across the platform."
        alerts={filteredAlerts}
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
