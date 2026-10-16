'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { DetectionRule } from '../../types/detection';
import { useDetectionStore } from '../../store/useDetectionStore';
import { SeverityBadge, RuleCategoryBadge, StatusBadge } from '../shared/DetectionBadge';
import {
  Shield,
  PlayCircle,
  Edit3,
  Trash2,
  Clock,
  Activity,
  History,
  CheckCircle2,
  FileCode,
  Sliders,
  Copy,
  Check,
  Power
} from 'lucide-react';

interface RuleDetailsDrawerProps {
  rule: DetectionRule | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RuleDetailsDrawer({ rule, isOpen, onClose }: RuleDetailsDrawerProps) {
  const { toggleRuleEnabled, openEditRuleModal, openSimulationModal, promptDeleteRule, showToast } =
    useDetectionStore();
  const [copied, setCopied] = useState(false);

  if (!rule) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(rule.id);
    setCopied(true);
    showToast(`Rule ID ${rule.id} copied to clipboard`, 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    onClose();
    openEditRuleModal(rule);
  };

  const handleSimulate = () => {
    onClose();
    openSimulationModal(rule.id);
  };

  const handleDelete = () => {
    onClose();
    promptDeleteRule(rule);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-[560px] overflow-y-auto border-border bg-card p-0 flex flex-col">
        {/* Sticky Header */}
        <div className="p-6 border-b border-border bg-card sticky top-0 z-20 shadow-xs">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-primary font-bold">
                {rule.id}
              </span>
              <button
                onClick={handleCopyId}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                title="Copy Rule ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <RuleCategoryBadge category={rule.category} />
              <SeverityBadge severity={rule.severity} />
            </div>
          </div>

          <SheetTitle className="text-lg font-semibold text-foreground leading-snug">
            {rule.name}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {rule.description}
          </SheetDescription>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-border/60">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSimulate}
                className="h-8 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                Simulate Rule
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleEdit}
                className="h-8 text-xs gap-1.5 border-border hover:bg-muted"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Spec
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleRuleEnabled(rule.id)}
                className={`h-8 text-xs gap-1.5 ${
                  rule.enabled
                    ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                    : 'border-muted-foreground/30 text-muted-foreground hover:bg-muted'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                {rule.enabled ? 'Enabled' : 'Disabled'}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                title="Delete rule"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Performance Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-muted/20 border border-border rounded-lg p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                24h Hits
              </span>
              <span className="text-base font-bold font-mono text-foreground mt-0.5 block">
                {rule.stats.hits24h.toLocaleString()}
              </span>
            </div>

            <div className="bg-muted/20 border border-border rounded-lg p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                7d Hits
              </span>
              <span className="text-base font-bold font-mono text-foreground mt-0.5 block">
                {rule.stats.hits7d.toLocaleString()}
              </span>
            </div>

            <div className="bg-muted/20 border border-border rounded-lg p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                False Positives
              </span>
              <span className="text-base font-bold font-mono text-emerald-400 mt-0.5 block">
                {rule.stats.falsePositiveRate}%
              </span>
            </div>

            <div className="bg-muted/20 border border-border rounded-lg p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Eval Latency
              </span>
              <span className="text-base font-bold font-mono text-foreground mt-0.5 block">
                {rule.stats.avgLatencyMs}ms
              </span>
            </div>
          </div>

          {/* Structured Detection Conditions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-primary" />
                Detection Conditions & Thresholds
              </h4>
              <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                Logic: {rule.logic}
              </span>
            </div>

            <div className="space-y-2.5">
              {rule.conditions.map((condition, idx) => (
                <div
                  key={condition.id}
                  className="bg-card border border-border rounded-xl p-3.5 space-y-2 relative transition-all duration-200 hover:border-border/80"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      Condition #{idx + 1}: {condition.label}
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-foreground border border-border">
                      {condition.operator} {String(condition.value)} {condition.unit || ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                    <span className="text-primary font-medium">{condition.field}</span>
                    <span>{condition.operator}</span>
                    <span className="text-foreground font-semibold">{String(condition.value)}</span>
                  </div>

                  {condition.description && (
                    <p className="text-xs text-muted-foreground pt-1 border-t border-border/40">
                      {condition.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSimulate}
              className="w-full text-xs gap-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              Simulate & Evaluate Conditions in Sandbox
            </Button>
          </div>

          {/* Triggered Output Signal */}
          <div className="bg-muted/20 border border-border rounded-xl p-3.5 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Emitted Finding Profile
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">Signal Emitted:</span>
              <span className="font-mono text-xs font-semibold text-primary">
                {rule.actionSignalType}
              </span>
            </div>
          </div>

          {/* Example Evidence Snippets */}
          {rule.exampleEvidence?.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                Example Trigger Evidence
              </h4>
              <div className="space-y-2">
                {rule.exampleEvidence.map((example, idx) => (
                  <div
                    key={idx}
                    className="text-xs bg-muted/30 border border-border rounded-lg p-3 text-muted-foreground font-mono leading-relaxed"
                  >
                    • {example}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Version Audit & Change History */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              Version History & Change Log
            </h4>

            <div className="space-y-3 relative pl-4 border-l border-border/80">
              {rule.history.map((hist, idx) => (
                <div key={idx} className="relative space-y-1">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-card" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-foreground">
                      {hist.version}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {hist.date} • {hist.author}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {hist.changes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
