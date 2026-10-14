'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import type { EChartsOption } from 'echarts';
import { useDetectionStore } from '../../store/useDetectionStore';
import { SeverityBadge, SignalTypeBadge, RuleCategoryBadge } from '../shared/DetectionBadge';
import { SignalDetailsDrawer } from '../signals/SignalDetailsDrawer';
import { RuleDetailsDrawer } from '../rules/RuleDetailsDrawer';
import { RuleSimulationSandbox } from '../simulation/RuleSimulationSandbox';
import { DetectionToast } from '../shared/DetectionToast';
import { RiskKpiCard } from '@/features/command-center/components/RiskKpiCard';
import { BaseChart } from '@/components/charts/base-chart';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';
import { HoverBorderRay } from '@/features/command-center/components/HoverBorderRay';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Radio,
  Sliders,
  PlayCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  Sparkles,
  Eye,
} from 'lucide-react';

export function DetectionOverviewPage() {
  const {
    signals,
    rules,
    patterns,
    selectedSignal,
    isSignalDrawerOpen,
    setSelectedSignal,
    closeSignalDrawer,
    selectedRule,
    isRuleDrawerOpen,
    setSelectedRule,
    closeRuleDrawer,
    openSimulationModal,
  } = useDetectionStore();

  // Metrics
  const totalSignals24h = signals.length;
  const criticalSignals = signals.filter((s) => s.severity === 'CRITICAL').length;
  const activeRulesCount = rules.filter((r) => r.enabled).length;
  const avgLatency = (rules.reduce((acc, r) => acc + r.stats.avgLatencyMs, 0) / (rules.length || 1)).toFixed(1);

  // Top Triggered Rules
  const topRules = useMemo(() => {
    return [...rules].sort((a, b) => b.stats.hits24h - a.stats.hits24h).slice(0, 5);
  }, [rules]);

  // Recent Signals
  const recentSignals = useMemo(() => {
    return [...signals].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
  }, [signals]);

  // Chart 1: Hourly Signal Velocity Trend
  const hourlyChartOption: EChartsOption = useMemo(() => {
    const hours = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', 'Now'];
    const velocityCounts = [28, 45, 92, 134, 185, 142, 168, 120, 94];
    const criticalCounts = [2, 6, 14, 22, 38, 19, 27, 18, 12];

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1f1f1f',
        borderColor: '#292929',
        textStyle: { color: '#f5f5f5', fontSize: 12 },
      },
      legend: {
        data: ['Total Signals', 'Critical Anomaly'],
        textStyle: { color: '#a3a3a3', fontSize: 11 },
        top: 0,
        right: 10,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '18%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: hours,
        axisLine: { lineStyle: { color: '#292929' } },
        axisLabel: { color: '#737373', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#242424', type: 'dashed' } },
        axisLabel: { color: '#737373', fontSize: 11 },
      },
      series: [
        {
          name: 'Total Signals',
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: velocityCounts,
          itemStyle: { color: '#3b82f6' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.35)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.0)' },
              ],
            },
          },
        },
        {
          name: 'Critical Anomaly',
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: criticalCounts,
          itemStyle: { color: '#ef4444' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(239, 68, 68, 0.3)' },
                { offset: 1, color: 'rgba(239, 68, 68, 0.0)' },
              ],
            },
          },
        },
      ],
    };
  }, []);

  // Chart 2: Signal Distribution by Type
  const signalTypeChartOption: EChartsOption = useMemo(() => {
    const countsByType: Record<string, number> = {};
    signals.forEach((s) => {
      const typeLabel = s.signalType.replace(/_/g, ' ');
      countsByType[typeLabel] = (countsByType[typeLabel] || 0) + 1;
    });

    const data = Object.entries(countsByType).map(([name, value]) => ({ name, value }));

    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#1f1f1f',
        borderColor: '#292929',
        textStyle: { color: '#f5f5f5', fontSize: 12 },
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: '2%',
        top: 'middle',
        textStyle: { color: '#a3a3a3', fontSize: 10 },
        itemWidth: 10,
        itemHeight: 10,
      },
      series: [
        {
          name: 'Signal Type',
          type: 'pie',
          radius: ['45%', '72%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#171717',
            borderWidth: 2,
          },
          label: { show: false },
          data,
        },
      ],
    };
  }, [signals]);

  return (
    <StaggerContainer className="flex flex-col space-y-6 pb-6 w-full max-w-[1600px] mx-auto">
      {/* Header */}
      <StaggerItem className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Detection Engine Overview
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time telemetry, signal ingestion velocity, and detection rules performance monitoring.
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
            Simulation Sandbox
          </Button>

          <Link href="/detection/signals">
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Radio className="w-4 h-4" />
              Signals Queue
            </Button>
          </Link>
        </div>
      </StaggerItem>

      {/* Engine Status Banner */}
      <StaggerItem>
        <div className="relative group overflow-hidden bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <HoverBorderRay />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">
                  Stream Detection Pipeline Active
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  HEALTHY
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ingesting Kafka events @ 14,280 ops/sec across 10 active rule clusters with {avgLatency}ms mean evaluation latency.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground relative z-10">
            <div>
              <span className="block text-muted-foreground">Rule Sets:</span>
              <span className="font-mono font-semibold text-foreground">v2.4 Production</span>
            </div>
            <div>
              <span className="block text-muted-foreground">MALi Feedback:</span>
              <span className="font-mono font-semibold text-emerald-400">Sync Active</span>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* KPI Cards */}
      <StaggerItem>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <RiskKpiCard
            title="Signals Generated (24h)"
            value={totalSignals24h}
            index={0}
            subtext="+14.2% from prior period"
          />
          <RiskKpiCard
            title="Critical Findings"
            value={criticalSignals}
            index={1}
            isLive={criticalSignals > 0}
            liveTone="danger"
            subtext="Severe risk indicators"
          />
          <RiskKpiCard
            title="Active Detection Rules"
            value={activeRulesCount}
            index={2}
            isLive={true}
            liveTone="success"
            subtext={`${rules.length - activeRulesCount} rules currently disabled`}
          />
          <RiskKpiCard
            title="Avg Engine Latency"
            value={Number(avgLatency)}
            index={3}
            subtext="ms per transaction event"
          />
        </div>
      </StaggerItem>

      {/* Charts Grid */}
      <StaggerItem className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Volume Chart */}
        <div className="lg:col-span-8 bg-card border border-border rounded-xl p-5 shadow-xs relative group overflow-hidden">
          <HoverBorderRay />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Signal Emission Velocity
              </h3>
              <p className="text-xs text-muted-foreground">
                Hourly telemetry of emitted detection signals and critical anomaly spikes
              </p>
            </div>
            <Link
              href="/detection/signals"
              className="text-xs text-primary hover:underline font-medium"
            >
              View all signals →
            </Link>
          </div>

          <div className="relative z-10">
            <BaseChart option={hourlyChartOption} height={260} />
          </div>
        </div>

        {/* Signal Type Distribution */}
        <div className="lg:col-span-4 bg-card border border-border rounded-xl p-5 shadow-xs relative group overflow-hidden">
          <HoverBorderRay />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Signal Taxonomy
              </h3>
              <p className="text-xs text-muted-foreground">
                Breakdown by technical finding category
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <BaseChart option={signalTypeChartOption} height={260} />
          </div>
        </div>
      </StaggerItem>

      {/* Tables Grid: Top Rules & Recent Signals */}
      <StaggerItem className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Triggered Rules */}
        <div className="lg:col-span-6 bg-card border border-border rounded-xl p-5 shadow-xs relative group overflow-hidden flex flex-col">
          <HoverBorderRay />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Top Active Detection Rules
              </h3>
              <p className="text-xs text-muted-foreground">
                Rules with highest signal emission volume over last 24h
              </p>
            </div>
            <Link
              href="/detection/rules"
              className="text-xs text-primary hover:underline font-medium"
            >
              Manage registry →
            </Link>
          </div>

          <div className="divide-y divide-border relative z-10 flex-1">
            {topRules.map((rule) => (
              <div
                key={rule.id}
                onClick={() => setSelectedRule(rule)}
                className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-muted/40 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-primary shrink-0">
                    {rule.id}
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground truncate max-w-[240px]">
                      {rule.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <RuleCategoryBadge category={rule.category} />
                      <span className="text-[10px] text-muted-foreground">
                        FP: {rule.stats.falsePositiveRate}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-xs font-bold text-foreground block">
                    {rule.stats.hits24h.toLocaleString()} hits
                  </span>
                  <SeverityBadge severity={rule.severity} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Real-Time Signals */}
        <div className="lg:col-span-6 bg-card border border-border rounded-xl p-5 shadow-xs relative group overflow-hidden flex flex-col">
          <HoverBorderRay />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Recent Detection Signals Stream
              </h3>
              <p className="text-xs text-muted-foreground">
                Live technical findings captured from transaction flows
              </p>
            </div>
            <Link
              href="/detection/signals"
              className="text-xs text-primary hover:underline font-medium"
            >
              Signals queue →
            </Link>
          </div>

          <div className="divide-y divide-border relative z-10 flex-1">
            {recentSignals.map((signal) => (
              <div
                key={signal.id}
                onClick={() => setSelectedSignal(signal)}
                className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-muted/40 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-primary font-bold shrink-0">
                    {signal.id}
                  </span>
                  <div>
                    <span className="text-xs font-medium text-foreground block truncate max-w-[250px]">
                      {signal.evidence.summary}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <SignalTypeBadge type={signal.signalType} />
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {signal.transactionId}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <SeverityBadge severity={signal.severity} />
                  <span className="text-[10px] text-muted-foreground block mt-1">
                    {new Date(signal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </StaggerItem>

      {/* Drawers & Modals */}
      <SignalDetailsDrawer
        signal={selectedSignal}
        isOpen={isSignalDrawerOpen}
        onClose={closeSignalDrawer}
      />

      <RuleDetailsDrawer
        rule={selectedRule}
        isOpen={isRuleDrawerOpen}
        onClose={closeRuleDrawer}
      />

      <RuleSimulationSandbox />

      <DetectionToast />
    </StaggerContainer>
  );
}
