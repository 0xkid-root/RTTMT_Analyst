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
import { DetectionSignal, SignalSeverity, SignalType } from '../../types/detection';
import { createSignalsColumns } from './signals-columns';
import { SignalDetailsDrawer } from './SignalDetailsDrawer';
import { DataTable, DataTablePagination, DataTableColumnVisibility } from '@/components/data-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';
import { RiskKpiCard } from '@/features/command-center/components/RiskKpiCard';
import { DetectionToast } from '../shared/DetectionToast';
import {
  Search,
  RefreshCw,
  Download,
  Filter,
  Radio,
  SlidersHorizontal,
  X,
  ShieldAlert,
  Zap,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

const SIGNAL_TYPES: { value: SignalType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Signal Types' },
  { value: 'HIGH_VELOCITY', label: 'High Velocity' },
  { value: 'UNUSUAL_AMOUNT', label: 'Unusual Amount' },
  { value: 'IMPOSSIBLE_TRAVEL', label: 'Impossible Travel' },
  { value: 'IP_RISK', label: 'IP Risk / Tor' },
  { value: 'NEW_DEVICE', label: 'New Device' },
  { value: 'MERCHANT_RISK', label: 'Merchant Risk' },
  { value: 'GEO_MISMATCH', label: 'Geo Mismatch' },
  { value: 'OFF_HOURS_ACTIVITY', label: 'Off-Hours Activity' },
];

const SEVERITIES: { value: SignalSeverity | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Severities' },
  { value: 'CRITICAL', label: 'Critical' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

const TIME_RANGES = [
  { value: 'ALL', label: 'All Time' },
  { value: '1H', label: 'Last 1 Hour' },
  { value: '24H', label: 'Last 24 Hours' },
  { value: '7D', label: 'Last 7 Days' },
];

export function DetectionSignalsPage() {
  const {
    signals,
    selectedSignal,
    isSignalDrawerOpen,
    newlyArrivedSignalId,
    setSelectedSignal,
    closeSignalDrawer,
    emitMockSignal,
    showToast,
  } = useDetectionStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<SignalSeverity | 'ALL'>('ALL');
  const [selectedSignalType, setSelectedSignalType] = useState<SignalType | 'ALL'>('ALL');
  const [selectedTimeRange, setSelectedTimeRange] = useState('ALL');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'timestamp', desc: true }]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter signals
  const filteredSignals = useMemo(() => {
    return signals.filter((signal) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = signal.id.toLowerCase().includes(query);
        const matchesTxn = signal.transactionId.toLowerCase().includes(query);
        const matchesRule = signal.ruleName.toLowerCase().includes(query) || signal.ruleId.toLowerCase().includes(query);
        const matchesEvidence = signal.evidence.summary.toLowerCase().includes(query);
        const matchesEntity = signal.relatedEntity.id.toLowerCase().includes(query);

        if (!matchesId && !matchesTxn && !matchesRule && !matchesEvidence && !matchesEntity) {
          return false;
        }
      }

      // Severity
      if (selectedSeverity !== 'ALL' && signal.severity !== selectedSeverity) {
        return false;
      }

      // Signal Type
      if (selectedSignalType !== 'ALL' && signal.signalType !== selectedSignalType) {
        return false;
      }

      // Time Range
      if (selectedTimeRange !== 'ALL') {
        const now = Date.now();
        const signalTime = new Date(signal.timestamp).getTime();
        const diffMs = now - signalTime;

        if (selectedTimeRange === '1H' && diffMs > 60 * 60 * 1000) return false;
        if (selectedTimeRange === '24H' && diffMs > 24 * 60 * 60 * 1000) return false;
        if (selectedTimeRange === '7D' && diffMs > 7 * 24 * 60 * 60 * 1000) return false;
      }

      return true;
    });
  }, [signals, searchQuery, selectedSeverity, selectedSignalType, selectedTimeRange]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Detection signals feed refreshed', 'info');
    }, 400);
  };

  const handleExportCsv = () => {
    const headers = ['Signal ID', 'Transaction ID', 'Signal Type', 'Severity', 'Rule ID', 'Rule Name', 'Summary', 'Timestamp'];
    const rows = filteredSignals.map((s) => [
      s.id,
      s.transactionId,
      s.signalType,
      s.severity,
      s.ruleId,
      `"${s.ruleName.replace(/"/g, '""')}"`,
      `"${s.evidence.summary.replace(/"/g, '""')}"`,
      s.timestamp,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `detection-signals-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredSignals.length} signals to CSV`, 'success');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSeverity('ALL');
    setSelectedSignalType('ALL');
    setSelectedTimeRange('ALL');
  };

  const hasActiveFilters = searchQuery !== '' || selectedSeverity !== 'ALL' || selectedSignalType !== 'ALL' || selectedTimeRange !== 'ALL';

  const columns = useMemo(
    () => createSignalsColumns((signal) => setSelectedSignal(signal), newlyArrivedSignalId),
    [setSelectedSignal, newlyArrivedSignalId]
  );

  const table = useReactTable({
    data: filteredSignals,
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
  const totalSignals = signals.length;
  const criticalCount = signals.filter((s) => s.severity === 'CRITICAL').length;
  const highCount = signals.filter((s) => s.severity === 'HIGH').length;
  const uniqueRulesCount = new Set(signals.map((s) => s.ruleId)).size;

  return (
    <StaggerContainer className="flex flex-col space-y-6 pb-6 w-full max-w-[1600px] mx-auto">
      {/* Page Header */}
      <StaggerItem className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Detection Signals
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Technical findings and risk signals emitted in real time by the detection rules engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => emitMockSignal()}
            className="gap-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Simulate Inbound Signal
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </StaggerItem>

      {/* Summary KPI Cards */}
      <StaggerItem>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <RiskKpiCard
            title="Total Signals"
            value={totalSignals}
            index={0}
            subtext="Recorded events"
          />
          <RiskKpiCard
            title="Critical Signals"
            value={criticalCount}
            index={1}
            isLive={criticalCount > 0}
            liveTone="danger"
            subtext="Immediate evaluation"
          />
          <RiskKpiCard
            title="High Severity"
            value={highCount}
            index={2}
            isLive={highCount > 0}
            liveTone="warning"
            subtext="Elevated anomaly"
          />
          <RiskKpiCard
            title="Rules Triggered"
            value={uniqueRulesCount}
            index={3}
            subtext="Distinct rules active"
          />
        </div>
      </StaggerItem>

      {/* Filters Toolbar */}
      <StaggerItem className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Signal ID, Transaction ID, Rule Name, Entity, or Evidence..."
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

          {/* Severity Pills / Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {SEVERITIES.map((sev) => {
              const active = selectedSeverity === sev.value;
              return (
                <button
                  key={sev.value}
                  onClick={() => setSelectedSeverity(sev.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background/40 hover:bg-muted text-muted-foreground border-border'
                  }`}
                >
                  {sev.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Signal Type dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground font-medium">Type:</span>
              <select
                value={selectedSignalType}
                onChange={(e) => setSelectedSignalType(e.target.value as any)}
                className="h-8 rounded-md border border-input bg-background/50 px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring [&>option]:bg-card [&>option]:text-foreground"
              >
                {SIGNAL_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Time range dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground font-medium">Window:</span>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="h-8 rounded-md border border-input bg-background/50 px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring [&>option]:bg-card [&>option]:text-foreground"
              >
                {TIME_RANGES.map((tr) => (
                  <option key={tr.value} value={tr.value}>
                    {tr.label}
                  </option>
                ))}
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
                Reset Filters
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              Showing <strong className="text-foreground">{filteredSignals.length}</strong> of {signals.length} signals
            </span>
            <DataTableColumnVisibility table={table} />
          </div>
        </div>
      </StaggerItem>

      {/* Signals Table */}
      <StaggerItem>
        <DataTable
          table={table}
          onRowClick={(row) => setSelectedSignal(row)}
          getRowProps={(row) => {
            const isNew = row.original.id === newlyArrivedSignalId;
            return {
              className: isNew
                ? 'animate-in fade-in duration-500 bg-emerald-500/10 border-l-2 border-emerald-500 hover:bg-emerald-500/15'
                : 'hover:bg-muted/50 transition-colors',
            };
          }}
          emptyMessage={
            hasActiveFilters
              ? 'No detection signals match the selected filters. Try broadening your criteria.'
              : 'No detection signals logged in the detection pipeline.'
          }
        />
        <DataTablePagination table={table} />
      </StaggerItem>

      {/* Detail Drawer */}
      <SignalDetailsDrawer
        signal={selectedSignal}
        isOpen={isSignalDrawerOpen}
        onClose={closeSignalDrawer}
      />

      {/* Toast Feedback */}
      <DetectionToast />
    </StaggerContainer>
  );
}
