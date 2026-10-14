'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDetectionStore } from '../../store/useDetectionStore';
import { RuleSimulationInput, RuleSimulationResult } from '../../types/detection';
import { SeverityBadge, SignalTypeBadge, RuleCategoryBadge } from '../shared/DetectionBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';
import { HoverBorderRay } from '@/features/command-center/components/HoverBorderRay';
import { DetectionToast } from '../shared/DetectionToast';
import {
  PlayCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sliders,
  Terminal,
  Info,
  Clock,
  Layers,
  Shield,
  Zap,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export function StandaloneRuleSimulationPage() {
  const { rules, simulationPresets, runSimulation } = useDetectionStore();

  const [selectedRuleId, setSelectedRuleId] = useState<string>(rules[0]?.id || '');
  const [activePresetId, setActivePresetId] = useState<string>(simulationPresets[0]?.id || '');
  const [inputAttributes, setInputAttributes] = useState<RuleSimulationInput>(simulationPresets[0]?.input || {
    amount: 14500,
    currency: 'INR',
    paymentMethod: 'UPI',
    location: 'Mumbai',
    velocity10m: 5,
    velocity1h: 6,
    isNewDevice: true,
    ipRiskScore: 35,
    distanceKm: 850,
    hoursSinceLastSeen: 0.5,
    merchantCategory: 'Consumer Electronics',
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<RuleSimulationResult | null>(null);

  const currentRule = rules.find((r) => r.id === selectedRuleId) || rules[0];

  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    const preset = simulationPresets.find((p) => p.id === presetId);
    if (preset) {
      setInputAttributes(preset.input);
      if (preset.targetRuleId) {
        setSelectedRuleId(preset.targetRuleId);
      }
      setResult(null);
    }
  };

  const handleExecute = () => {
    if (!currentRule) return;

    setIsSimulating(true);
    setResult(null);

    setTimeout(() => {
      const simResult = runSimulation(currentRule.id, inputAttributes);
      setResult(simResult);
      setIsSimulating(false);
    }, 300);
  };

  return (
    <StaggerContainer className="flex flex-col space-y-6 pb-6 w-full max-w-[1400px] mx-auto">
      {/* Header */}
      <StaggerItem className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PlayCircle className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Detection Rule Simulation Workbench
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Test and verify detection rules logic against synthetic or historical test vectors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/detection/rules">
            <Button variant="outline" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Rules Registry
            </Button>
          </Link>
          <Link href="/detection/signals">
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              Live Signals Queue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </StaggerItem>

      {/* Mock Sandbox Notice */}
      <StaggerItem>
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-3 shadow-xs">
          <Info className="w-5 h-5 shrink-0 text-amber-400" />
          <div>
            <strong>Frontend Simulation Sandbox:</strong> This workbench evaluates rules client-side using deterministic evaluation logic. It does not dispatch events to real production Kafka/Flink ingestion clusters.
          </div>
        </div>
      </StaggerItem>

      {/* Main Grid: Left Controls, Right Results */}
      <StaggerItem className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration & Vector Inputs */}
        <div className="lg:col-span-6 space-y-6">
          {/* Preset Selector */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" />
              Preset Test Scenarios
            </h3>

            <div className="space-y-2">
              {simulationPresets.map((preset) => {
                const active = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                      active
                        ? 'bg-primary/10 border-primary text-foreground'
                        : 'bg-muted/20 border-border text-muted-foreground hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span className={active ? 'text-primary' : 'text-foreground'}>
                        {preset.name}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {preset.targetRuleId}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-85">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rule Selection & Input Attributes */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-primary" />
              Target Rule & Transaction Attributes
            </h3>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                Target Detection Rule
              </label>
              <select
                value={selectedRuleId}
                onChange={(e) => {
                  setSelectedRuleId(e.target.value);
                  setResult(null);
                }}
                className="w-full h-10 rounded-lg border border-input bg-background/50 px-3 text-xs text-foreground focus:outline-none [&>option]:bg-card [&>option]:text-foreground font-medium"
              >
                {rules.map((rule) => (
                  <option key={rule.id} value={rule.id}>
                    [{rule.id}] {rule.name}
                  </option>
                ))}
              </select>

              {currentRule && (
                <div className="flex items-center gap-2 pt-2 text-xs">
                  <RuleCategoryBadge category={currentRule.category} />
                  <SeverityBadge severity={currentRule.severity} />
                  <span className="text-muted-foreground text-[11px]">
                    Logic: <strong>{currentRule.logic}</strong> ({currentRule.conditions.length} conditions)
                  </span>
                </div>
              )}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div>
                <label className="text-muted-foreground block mb-1">Amount (INR)</label>
                <Input
                  type="number"
                  value={inputAttributes.amount}
                  onChange={(e) =>
                    setInputAttributes({ ...inputAttributes, amount: Number(e.target.value) })
                  }
                  className="h-8 font-mono bg-background/50"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">10m Velocity Count</label>
                <Input
                  type="number"
                  value={inputAttributes.velocity10m}
                  onChange={(e) =>
                    setInputAttributes({ ...inputAttributes, velocity10m: Number(e.target.value) })
                  }
                  className="h-8 font-mono bg-background/50"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">1h Velocity Count</label>
                <Input
                  type="number"
                  value={inputAttributes.velocity1h}
                  onChange={(e) =>
                    setInputAttributes({ ...inputAttributes, velocity1h: Number(e.target.value) })
                  }
                  className="h-8 font-mono bg-background/50"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Displacement (km)</label>
                <Input
                  type="number"
                  value={inputAttributes.distanceKm}
                  onChange={(e) =>
                    setInputAttributes({ ...inputAttributes, distanceKm: Number(e.target.value) })
                  }
                  className="h-8 font-mono bg-background/50"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Elapsed Hours</label>
                <Input
                  type="number"
                  step="0.1"
                  value={inputAttributes.hoursSinceLastSeen}
                  onChange={(e) =>
                    setInputAttributes({
                      ...inputAttributes,
                      hoursSinceLastSeen: Number(e.target.value),
                    })
                  }
                  className="h-8 font-mono bg-background/50"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">IP Threat (0-100)</label>
                <Input
                  type="number"
                  value={inputAttributes.ipRiskScore}
                  onChange={(e) =>
                    setInputAttributes({ ...inputAttributes, ipRiskScore: Number(e.target.value) })
                  }
                  className="h-8 font-mono bg-background/50"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Device Registration</label>
                <select
                  value={String(inputAttributes.isNewDevice)}
                  onChange={(e) =>
                    setInputAttributes({
                      ...inputAttributes,
                      isNewDevice: e.target.value === 'true',
                    })
                  }
                  className="w-full h-8 rounded border border-input bg-background/50 px-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="true">Unregistered (New)</option>
                  <option value="false">Registered (Known)</option>
                </select>
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Payment Method</label>
                <select
                  value={inputAttributes.paymentMethod}
                  onChange={(e) =>
                    setInputAttributes({ ...inputAttributes, paymentMethod: e.target.value })
                  }
                  className="w-full h-8 rounded border border-input bg-background/50 px-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="UPI">UPI</option>
                  <option value="CARD">Card</option>
                  <option value="NETBANKING">Netbanking</option>
                  <option value="IMPS">IMPS</option>
                </select>
              </div>
            </div>

            <Button
              onClick={handleExecute}
              disabled={isSimulating}
              className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
            >
              <PlayCircle className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              {isSimulating ? 'Simulating Evaluation Engine...' : 'Run Simulation Against Rule'}
            </Button>
          </div>
        </div>

        {/* Right Column: Simulation Results */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs min-h-[500px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <h3 className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-primary" />
                  Simulation Evaluation Report
                </h3>
                {result && (
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Latency: {result.executionDurationMs} ms
                  </span>
                )}
              </div>

              {!result && (
                <div className="py-24 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-muted/40 border border-border flex items-center justify-center mx-auto text-muted-foreground">
                    <PlayCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Simulation Ready
                    </h4>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                      Choose a preset scenario on the left or enter custom transaction parameters, then click &quot;Run Simulation Against Rule&quot;.
                    </p>
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      result.matched
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {result.matched ? (
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                          <AlertTriangle className="w-5 h-5 animate-pulse" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-base font-bold">
                          {result.matched ? 'RULE MATCHED (TRIGGERED)' : 'RULE NOT TRIGGERED (PASSED)'}
                        </h4>
                        <p className="text-xs opacity-80 mt-0.5">
                          {result.matched
                            ? `All conditions for rule ${result.ruleId} were satisfied.`
                            : `Parameters did not exceed thresholds defined in rule ${result.ruleId}.`}
                        </p>
                      </div>
                    </div>

                    <span className="font-mono text-xs font-bold uppercase px-2.5 py-1 rounded bg-black/40">
                      {result.matched ? 'MATCHED' : 'CLEAR'}
                    </span>
                  </div>

                  {/* Conditions Checklist */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-foreground">
                      Condition-by-Condition Evaluation:
                    </h4>

                    <div className="space-y-2">
                      {result.conditionResults.map((cr, idx) => (
                        <div
                          key={cr.conditionId || idx}
                          className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 ${
                            cr.passed
                              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                              : 'bg-muted/20 border-border text-muted-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {cr.passed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                            )}
                            <div>
                              <span className="font-semibold text-foreground">
                                {cr.label}
                              </span>
                              <span className="text-[11px] font-mono block opacity-80">
                                {cr.field} {cr.operator} {String(cr.expectedValue)} (Actual: <strong>{String(cr.actualValue)}</strong>)
                              </span>
                            </div>
                          </div>

                          <span
                            className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                              cr.passed
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {cr.passed ? 'PASSED' : 'FAILED'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generated Signal Preview */}
                  {result.simulatedSignal && (
                    <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          Generated Simulated Finding
                        </span>
                        <span className="font-mono text-xs text-primary font-bold">
                          {result.simulatedSignal.id}
                        </span>
                      </div>

                      <p className="text-xs text-foreground font-mono">
                        {result.simulatedSignal.evidence.summary}
                      </p>

                      <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-muted-foreground pt-1">
                        <div>
                          <span>Signal Type:</span>{' '}
                          <strong className="text-foreground">{result.simulatedSignal.signalType}</strong>
                        </div>
                        <div>
                          <span>Severity:</span>{' '}
                          <strong className="text-foreground">{result.simulatedSignal.severity}</strong>
                        </div>
                        <div>
                          <span>Status:</span> <strong className="text-emerald-400">ACTIVE</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Target Rule Version: {currentRule?.version}</span>
              <span>Updated By: {currentRule?.updatedBy}</span>
            </div>
          </div>
        </div>
      </StaggerItem>

      <DetectionToast />
    </StaggerContainer>
  );
}
