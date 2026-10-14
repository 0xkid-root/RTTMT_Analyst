'use client';

import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { useDetectionStore } from '../../store/useDetectionStore';
import { DetectionRule, RuleCategory, SignalSeverity } from '../../types/detection';
import { createRulesColumns } from './rules-columns';
import { RuleDetailsDrawer } from './RuleDetailsDrawer';
import { RuleFormModal } from './RuleFormModal';
import { RuleDeleteConfirmModal } from './RuleDeleteConfirmModal';
import { RuleSimulationSandbox } from '../simulation/RuleSimulationSandbox';
import { DataTable, DataTablePagination, DataTableColumnVisibility } from '@/components/data-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';
import { RiskKpiCard } from '@/features/command-center/components/RiskKpiCard';
import { DetectionToast } from '../shared/DetectionToast';
import {
  Search,
  Plus,
  PlayCircle,
  RefreshCw,
  Filter,
  Sliders,
  Shield,
  Layers,
  CheckCircle2,
  XCircle,
  X,
} from 'lucide-react';

const CATEGORY_TABS: { value: RuleCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Categories' },
  { value: 'VELOCITY', label: 'Velocity' },
  { value: 'AMOUNT_ANOMALY', label: 'Amount Anomaly' },
  { value: 'GEOLOCATION', label: 'Geolocation' },
  { value: 'NETWORK_REPUTATION', label: 'Network Threat' },
  { value: 'DEVICE_INTELLIGENCE', label: 'Device Signals' },
  { value: 'BEHAVIORAL', label: 'Behavioral' },
];

const SEVERITIES: { value: SignalSeverity | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Severities' },
  { value: 'CRITICAL', label: 'Critical' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

export function DetectionRulesPage() {
  const {
    rules,
    selectedRule,
    isRuleDrawerOpen,
    setSelectedRule,
    closeRuleDrawer,
    toggleRuleEnabled,
    openCreateRuleModal,
    openEditRuleModal,
    openSimulationModal,
    promptDeleteRule,
    showToast,
  } = useDetectionStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RuleCategory | 'ALL'>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<SignalSeverity | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'ENABLED' | 'DISABLED'>('ALL');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'stats_hits24h', desc: true }]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Filtered rules
  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = rule.id.toLowerCase().includes(query);
        const matchesName = rule.name.toLowerCase().includes(query);
        const matchesDesc = rule.description.toLowerCase().includes(query);
        const matchesAuthor = rule.updatedBy.toLowerCase().includes(query);

        if (!matchesId && !matchesName && !matchesDesc && !matchesAuthor) {
          return false;
        }
      }

      // Category tab
      if (selectedCategory !== 'ALL' && rule.category !== selectedCategory) {
        return false;
      }

      // Severity
      if (selectedSeverity !== 'ALL' && rule.severity !== selectedSeverity) {
        return false;
      }

      // Status
      if (selectedStatus === 'ENABLED' && !rule.enabled) return false;
      if (selectedStatus === 'DISABLED' && rule.enabled) return false;

      return true;
    });
  }, [rules, searchQuery, selectedCategory, selectedSeverity, selectedStatus]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedSeverity('ALL');
    setSelectedStatus('ALL');
  };

  const hasActiveFilters =
    searchQuery !== '' || selectedCategory !== 'ALL' || selectedSeverity !== 'ALL' || selectedStatus !== 'ALL';

  const columns = useMemo(
    () =>
      createRulesColumns({
        onInspect: (rule) => setSelectedRule(rule),
        onEdit: (rule) => openEditRuleModal(rule),
        onSimulate: (rule) => openSimulationModal(rule.id),
        onToggleStatus: (ruleId) => toggleRuleEnabled(ruleId),
        onDelete: (rule) => promptDeleteRule(rule),
      }),
    [setSelectedRule, openEditRuleModal, openSimulationModal, toggleRuleEnabled, promptDeleteRule]
  );

  const table = useReactTable({
    data: filteredRules,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  // KPI Metrics
  const totalRules = rules.length;
  const activeRules = rules.filter((r) => r.enabled).length;
  const disabledRules = totalRules - activeRules;
  const avgLatency = (rules.reduce((acc, r) => acc + r.stats.avgLatencyMs, 0) / (rules.length || 1)).toFixed(1);

  return (
    <StaggerContainer className="flex flex-col space-y-6 pb-6 w-full max-w-[1600px] mx-auto">
      {/* Header */}
      <StaggerItem className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Detection Rules Registry
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure, calibrate, and simulate conditions used to detect anomalies across real-time transaction streams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openSimulationModal()}
            className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
          >
            <PlayCircle className="w-4 h-4" />
            Rule Simulator Sandbox
          </Button>

          <Button
            size="sm"
            onClick={openCreateRuleModal}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            New Detection Rule
          </Button>
        </div>
      </StaggerItem>

      {/* KPI Summary */}
      <StaggerItem>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <RiskKpiCard title="Total Configured Rules" value={totalRules} index={0} />
          <RiskKpiCard
            title="Active / Enabled"
            value={activeRules}
            index={1}
            isLive={true}
            liveTone="success"
            subtext="Evaluating in real-time"
          />
          <RiskKpiCard
            title="Inactive / Disabled"
            value={disabledRules}
            index={2}
            liveTone="neutral"
            subtext="Offloaded from stream"
          />
          <RiskKpiCard
            title="Average Latency"
            value={Number(avgLatency)}
            index={3}
            subtext="ms per rule evaluation"
          />
        </div>
      </StaggerItem>

      {/* Category Tabs */}
      <StaggerItem className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const active = selectedCategory === tab.value;
          const count =
            tab.value === 'ALL'
              ? rules.length
              : rules.filter((r) => r.category === tab.value).length;

          return (
            <button
              key={tab.value}
              onClick={() => setSelectedCategory(tab.value)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                active
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                  : 'bg-card hover:bg-muted text-muted-foreground border-border'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  active ? 'bg-black/30 text-current' : 'bg-muted/80 text-muted-foreground'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </StaggerItem>

      {/* Filters Bar */}
      <StaggerItem className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Rule ID, Name, Description, or Author..."
              className="pl-9 bg-background/50 border-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Severity Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium">Severity:</span>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value as any)}
                className="h-8 rounded-md border border-input bg-background/50 px-2 py-1 text-xs text-foreground focus:outline-none [&>option]:bg-card [&>option]:text-foreground"
              >
                {SEVERITIES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="h-8 rounded-md border border-input bg-background/50 px-2 py-1 text-xs text-foreground focus:outline-none [&>option]:bg-card [&>option]:text-foreground"
              >
                <option value="ALL">All Statuses</option>
                <option value="ENABLED">Enabled Only</option>
                <option value="DISABLED">Disabled Only</option>
              </select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
              >
                <X className="w-3.5 h-3.5" />
                Reset
              </Button>
            )}

            <DataTableColumnVisibility table={table} />
          </div>
        </div>
      </StaggerItem>

      {/* Rules Table */}
      <StaggerItem>
        <DataTable
          table={table}
          onRowClick={(row) => setSelectedRule(row)}
          emptyMessage={
            hasActiveFilters
              ? 'No detection rules match the selected filter criteria.'
              : 'No detection rules configured.'
          }
        />
        <DataTablePagination table={table} />
      </StaggerItem>

      {/* Rule Details Drawer */}
      <RuleDetailsDrawer
        rule={selectedRule}
        isOpen={isRuleDrawerOpen}
        onClose={closeRuleDrawer}
      />

      {/* Rule Create/Edit Modal */}
      <RuleFormModal />

      {/* Rule Delete Confirm Modal */}
      <RuleDeleteConfirmModal />

      {/* Simulation Sandbox Modal */}
      <RuleSimulationSandbox />

      {/* Toast Feedback */}
      <DetectionToast />
    </StaggerContainer>
  );
}
