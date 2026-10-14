'use client';

import { useState, useEffect } from 'react';
import { useDetectionStore } from '../../store/useDetectionStore';
import { RuleSimulationInput, RuleSimulationResult } from '../../types/detection';
import { SeverityBadge, SignalTypeBadge, RuleCategoryBadge } from '../shared/DetectionBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  PlayCircle,
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sliders,
  Terminal,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  Layers,
  Shield,
  Zap,
} from 'lucide-react';

export function RuleSimulationSandbox() {
  const {
    rules,
    simulationPresets,
    isSimulationModalOpen,
    closeSimulationModal,
    simulationTargetRuleId,
    setSimulationTargetRuleId,
    activeSimulationPreset,
    setActiveSimulationPreset,
    runSimulation,
    lastSimulationResult,
  } = useDetectionStore();

  const [selectedRuleId, setSelectedRuleId] = useState<string>('');
  const [inputAttributes, setInputAttributes] = useState<RuleSimulationInput>({
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

  // Sync rule ID on open or preset change
  useEffect(() => {
    if (simulationTargetRuleId) {
      setSelectedRuleId(simulationTargetRuleId);
    } else if (rules.length > 0) {
      setSelectedRuleId(rules[0].id);
    }
  }, [simulationTargetRuleId, rules]);

  // Sync input on preset select
  useEffect(() => {
    if (activeSimulationPreset) {
      setInputAttributes(activeSimulationPreset.input);
      if (activeSimulationPreset.targetRuleId) {
        setSelectedRuleId(activeSimulationPreset.targetRuleId);
      }
    }
  }, [activeSimulationPreset]);

  // Sync last result from store
  useEffect(() => {
    if (lastSimulationResult) {
      setResult(lastSimulationResult);
    }
  }, [lastSimulationResult]);

  if (!isSimulationModalOpen) return null;

  const currentRule = rules.find((r) => r.id === selectedRuleId) || rules[0];

  const handleSelectPreset = (presetId: string) => {
    const preset = simulationPresets.find((p) => p.id === presetId);
    if (preset) {
      setActiveSimulationPreset(preset);
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
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-card">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Rule Testing & Simulation Sandbox
              </h2>
              <span className="text-xs text-muted-foreground">
                Client-side verification of detection rules against mock test vectors
              </span>
            </div>
          </div>

          <button
            onClick={closeSimulationModal}
            className="text-muted-foreground hover:text-foreground p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Banner */}
        <div className="px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            <strong>Frontend Simulation Sandbox:</strong> Evaluated in-browser for rule condition verification; does not execute against production ingestion pipelines.
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Controls: Preset selector & Target Rule selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Rule Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Target Detection Rule
              </label>
              <select
                value={selectedRuleId}
                onChange={(e) => {
                  setSelectedRuleId(e.target.value);
                  setSimulationTargetRuleId(e.target.value);
                  setResult(null);
                }}
                className="w-full h-10 rounded-lg border border-input bg-background/50 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring [&>option]:bg-card [&>option]:text-foreground font-medium"
              >
                {rules.map((rule) => (
                  <option key={rule.id} value={rule.id}>
                    [{rule.id}] {rule.name} ({rule.category})
                  </option>
                ))}
              </select>

              {currentRule && (
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <RuleCategoryBadge category={currentRule.category} />
                  <SeverityBadge severity={currentRule.severity} />
                  <span className="text-muted-foreground text-[11px]">
                    {currentRule.conditions.length} condition(s) • Logic: {currentRule.logic}
                  </span>
                </div>
              )}
            </div>

            {/* Simulation Preset Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Load Mock Test Scenario
              </label>
              <select
                value={activeSimulationPreset?.id || ''}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="w-full h-10 rounded-lg border border-input bg-background/50 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring [&>option]:bg-card [&>option]:text-foreground font-medium"
              >
                {simulationPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>

              {activeSimulationPreset && (
                <p className="text-[11px] text-muted-foreground pt-1 leading-snug">
                  {activeSimulationPreset.description}
                </p>
              )}
            </div>
          </div>

          {/* Test Vector Attributes Inputs */}
          <div className="bg-muted/20 border border-border rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-primary" />
                Input Transaction Attributes
              </h3>
              <span className="text-[11px] text-muted-foreground">
                Tweak attributes to test boundary conditions
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
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
                <label className="text-muted-foreground block mb-1">Velocity in 10m</label>
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
                <label className="text-muted-foreground block mb-1">Velocity in 1h</label>
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
                <label className="text-muted-foreground block mb-1">Distance (km)</label>
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
                <label className="text-muted-foreground block mb-1">Device Known?</label>
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

            <div className="flex items-center justify-end pt-2">
              <Button
                onClick={handleExecute}
                disabled={isSimulating}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <PlayCircle className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
                {isSimulating ? 'Simulating Evaluation...' : 'Run Frontend Simulation'}
              </Button>
            </div>
          </div>

          {/* Simulation Output Section */}
          {result && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-primary" />
                  Simulation Evaluation Report
                </h3>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Latency: {result.executionDurationMs} ms • Evaluated at {new Date(result.evaluatedAt).toLocaleTimeString()}
                </span>
              </div>

              {/* Match Banner */}
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
                      {result.matched
                        ? `SIGNAL TRIGGERED: Rule ${result.ruleId} MATCHED`
                        : `RULE PASSED: ${result.ruleId} NOT TRIGGERED`}
                    </h4>
                    <p className="text-xs opacity-80 mt-0.5">
                      {result.matched
                        ? `All required ${currentRule.logic} criteria were satisfied by the test vector.`
                        : `Test vector did not satisfy the triggering threshold criteria.`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-bold uppercase px-2.5 py-1 rounded bg-black/40">
                    {result.matched ? 'MATCHED' : 'CLEAR'}
                  </span>
                </div>
              </div>

              {/* Step-by-step Condition Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-foreground">
                  Condition Evaluation Breakdown:
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
                            {cr.field} {cr.operator} Expected {String(cr.expectedValue)} (Actual:{' '}
                            <strong className="text-foreground">{String(cr.actualValue)}</strong>)
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
                        {cr.passed ? 'PASSED (TRUE)' : 'FAILED (FALSE)'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generated Mock Signal Preview if matched */}
              {result.simulatedSignal && (
                <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Generated Simulated Signal Finding
                    </span>
                    <span className="font-mono text-xs text-primary font-bold">
                      {result.simulatedSignal.id}
                    </span>
                  </div>

                  <p className="text-xs text-foreground font-mono">
                    {result.simulatedSignal.evidence.summary}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono text-muted-foreground">
                    <div>
                      <span>Signal Type:</span>{' '}
                      <strong className="text-foreground">
                        {result.simulatedSignal.signalType}
                      </strong>
                    </div>
                    <div>
                      <span>Severity:</span>{' '}
                      <strong className="text-foreground">
                        {result.simulatedSignal.severity}
                      </strong>
                    </div>
                    <div>
                      <span>Status:</span>{' '}
                      <strong className="text-emerald-400">ACTIVE</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-card text-xs text-muted-foreground">
          <span>
            Target Rule Version: <strong className="text-foreground">{currentRule?.version}</strong>
          </span>
          <Button variant="outline" size="sm" onClick={closeSimulationModal}>
            Close Sandbox
          </Button>
        </div>
      </div>
    </div>
  );
}
