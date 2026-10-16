'use client';

import Link from 'next/link';
import { useDetectionStore } from '../../store/useDetectionStore';
import { SeverityBadge } from '../shared/DetectionBadge';
import { RuleDetailsDrawer } from '../rules/RuleDetailsDrawer';
import { RuleSimulationSandbox } from '../simulation/RuleSimulationSandbox';
import { DetectionToast } from '../shared/DetectionToast';
import { RiskKpiCard } from '@/features/command-center/components/RiskKpiCard';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';
import { HoverBorderRay } from '@/features/command-center/components/HoverBorderRay';
import { Button } from '@/components/ui/button';
import {
  Fingerprint,
  Radio,
  PlayCircle,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Clock,
  Activity,
} from 'lucide-react';

export function DetectionPatternsPage() {
  const {
    patterns,
    rules,
    setSelectedRule,
    selectedRule,
    isRuleDrawerOpen,
    closeRuleDrawer,
    openSimulationModal,
  } = useDetectionStore();

  const handleOpenRule = (ruleId: string) => {
    const matched = rules.find((r) => r.id === ruleId);
    if (matched) {
      setSelectedRule(matched);
    }
  };

  return (
    <StaggerContainer className="flex flex-col space-y-6 pb-6 w-full max-w-[1600px] mx-auto">
      {/* Header */}
      <StaggerItem className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Fingerprint className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Detection Patterns & Anomaly Signatures
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Correlated multi-event signatures and behavioral clusters identified by composite detection heuristics.
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
            Test Signature in Sandbox
          </Button>

          <Link href="/detection/signals">
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Radio className="w-4 h-4" />
              View Correlated Signals
            </Button>
          </Link>
        </div>
      </StaggerItem>

      {/* KPI Cards */}
      <StaggerItem>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <RiskKpiCard title="Active Signatures" value={patterns.length} index={0} />
          <RiskKpiCard
            title="Correlated Clusters"
            value={patterns.reduce((acc, p) => acc + p.detectedClusters, 0)}
            index={1}
            isLive={true}
            liveTone="danger"
            subtext="Live recurring clusters"
          />
          <RiskKpiCard
            title="Tagged Signals"
            value={patterns.reduce((acc, p) => acc + p.signalsCount, 0)}
            index={2}
            subtext="Signals linked to signatures"
          />
          <RiskKpiCard
            title="Mean Confidence"
            value={94}
            index={3}
            subtext="% correlation precision"
          />
        </div>
      </StaggerItem>

      {/* Patterns Grid */}
      <StaggerItem className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patterns.map((pattern) => (
          <div
            key={pattern.id}
            className="relative group overflow-hidden bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all duration-300 hover:border-foreground/20"
          >
            <HoverBorderRay />

            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-xs font-bold text-primary">
                  {pattern.id}
                </span>
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={pattern.severity} />
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {pattern.status}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground">
                  {pattern.name}
                </h3>
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block mt-0.5">
                  Category: {pattern.category.replace(/_/g, ' ')}
                </span>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {pattern.description}
                </p>
              </div>

              {/* Heuristic Summary */}
              <div className="p-3 bg-muted/30 border border-border rounded-lg text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Heuristic Signature Logic:
                </span>
                <p className="text-muted-foreground font-mono text-[11px] leading-relaxed">
                  {pattern.heuristicSummary}
                </p>
              </div>

              {/* Associated Rules */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Contributing Detection Rules:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {pattern.associatedRules.map((ruleId) => (
                    <button
                      key={ruleId}
                      onClick={() => handleOpenRule(ruleId)}
                      className="px-2 py-0.5 rounded bg-secondary/60 hover:bg-secondary text-secondary-foreground text-[11px] font-mono font-medium border border-border transition-colors flex items-center gap-1"
                      title="Inspect rule specification"
                    >
                      <Shield className="w-3 h-3 text-primary" />
                      <span>{ruleId}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pattern Metrics Footer */}
              <div className="flex items-center justify-between text-xs pt-3 border-t border-border/60">
                <span className="text-muted-foreground">
                  Clusters: <strong className="text-foreground">{pattern.detectedClusters}</strong> active
                </span>
                <span className="text-muted-foreground">
                  Tagged: <strong className="text-primary font-mono">{pattern.signalsCount}</strong> signals
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="relative z-10 pt-4 mt-2 border-t border-border/40 flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {pattern.lastDetected}
              </span>

              <Link
                href={`/detection/signals?search=${pattern.name.split(' ')[0]}`}
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
              >
                Inspect Signals <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </StaggerItem>

      {/* Drawers & Modals */}
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
