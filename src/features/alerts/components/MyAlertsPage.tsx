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

  const [activeTab, setActiveTab] = useState('All');

  // Summary Metrics
  const myActiveAlerts = alerts.filter(a => a.status !== 'RESOLVED').length;
  const inProgress = alerts.filter(a => a.status === 'IN_PROGRESS').length;
  const atRisk = alerts.filter(a => a.slaStatus === 'AT_RISK' && a.status !== 'RESOLVED').length;
  const escalatedCount = alerts.filter(a => a.escalated).length;

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return alert.status !== 'RESOLVED';
    if (activeTab === 'In Progress') return alert.status === 'IN_PROGRESS';
    if (activeTab === 'At Risk') return alert.slaStatus === 'AT_RISK' && alert.status !== 'RESOLVED';
    if (activeTab === 'Escalated') return alert.escalated;
    return true;
  });

  const tabs = [
    { id: 'All', label: 'All', count: alerts.length, color: 'bg-primary/20 text-primary', activeColor: 'bg-primary text-primary-foreground' },
    { id: 'Active', label: 'Active', count: myActiveAlerts, color: 'bg-card text-muted-foreground', activeColor: 'bg-blue-500/20 text-blue-500' },
    { id: 'In Progress', label: 'In Progress', count: inProgress, color: 'bg-card text-muted-foreground', activeColor: 'bg-purple-500/20 text-purple-500' },
    { id: 'At Risk', label: 'At Risk', count: atRisk, color: 'bg-card text-muted-foreground', activeColor: 'bg-yellow-500/20 text-yellow-500' },
    { id: 'Escalated', label: 'Escalated', count: escalatedCount, color: 'bg-card text-muted-foreground', activeColor: 'bg-orange-500/20 text-orange-500' },
  ];

  const SummaryCards = (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-4">
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
          <div className="text-2xl font-bold">{escalatedCount}</div>
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
        title="My Alerts"
        subtitle="Alerts currently assigned to you."
        alerts={filteredAlerts}
        isLoading={isLoading}
        onRefresh={() => refetch()}
        onAlertClick={handleAlertClick}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        summaryCards={SummaryCards}
        hideFilters={['alertType', 'sla', 'assignedTo']}
      />
      <AlertDetailsDrawer 
        alert={selectedAlert}
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </div>
  );
}
