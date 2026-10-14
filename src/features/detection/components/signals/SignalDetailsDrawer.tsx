'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { DetectionSignal } from '../../types/detection';
import { useDetectionStore } from '../../store/useDetectionStore';
import { SeverityBadge, SignalTypeBadge } from '../shared/DetectionBadge';
import {
  Clock,
  Shield,
  Layers,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  PlayCircle,
  AlertTriangle,
  Building,
  CreditCard,
  MapPin,
  Smartphone,
  Globe,
  Radio,
  FileCode,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface SignalDetailsDrawerProps {
  signal: DetectionSignal | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SignalDetailsDrawer({ signal, isOpen, onClose }: SignalDetailsDrawerProps) {
  const { setSelectedRule, rules, openSimulationModal, showToast } = useDetectionStore();
  const [copied, setCopied] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  if (!signal) return null;

  const matchedRule = rules.find((r) => r.id === signal.ruleId);

  const handleCopyId = () => {
    navigator.clipboard.writeText(signal.id);
    setCopied(true);
    showToast(`Signal ID ${signal.id} copied to clipboard`, 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewRule = () => {
    if (matchedRule) {
      onClose();
      setSelectedRule(matchedRule);
    }
  };

  const handleSimulateRule = () => {
    onClose();
    openSimulationModal(signal.ruleId);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-[560px] overflow-y-auto border-border bg-card p-0 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border bg-card sticky top-0 z-20 shadow-xs">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-primary font-bold tracking-wide">
                {signal.id}
              </span>
              <button
                onClick={handleCopyId}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                title="Copy Signal ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <SeverityBadge severity={signal.severity} />
              <SignalTypeBadge type={signal.signalType} />
            </div>
          </div>

          <SheetTitle className="text-lg font-semibold text-foreground leading-snug">
            {signal.evidence.summary}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Detected at {new Date(signal.timestamp).toLocaleString()}</span>
          </SheetDescription>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-border/60">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSimulateRule}
              className="h-8 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              Test Rule with Event
            </Button>

            {matchedRule && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleViewRule}
                className="h-8 text-xs gap-1.5 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Layers className="w-3.5 h-3.5" />
                View Rule Spec
              </Button>
            )}

            <Link
              href={`/monitor/explorer?search=${signal.transactionId}`}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Explorer
            </Link>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* 1. Triggering Rule Section */}
          <div className="bg-muted/20 border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-primary" />
                Triggering Detection Rule
              </span>
              <span className="font-mono text-xs text-primary font-semibold">
                {signal.ruleId}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {signal.ruleName}
              </h4>
              {matchedRule && (
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {matchedRule.description}
                </p>
              )}
            </div>

            {/* Conditions that fired */}
            {signal.evidence.triggerConditionsPassed?.length > 0 && (
              <div className="pt-2 border-t border-border/50">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Conditions Evaluated True:
                </span>
                <div className="space-y-1.5">
                  {signal.evidence.triggerConditionsPassed.map((cond, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs bg-emerald-500/5 border border-emerald-500/20 text-emerald-300 px-2.5 py-1.5 rounded-md font-mono"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{cond}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Key Evidence Metrics */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              Technical Evidence Metrics
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {signal.evidence.metrics?.map((metric, idx) => (
                <div key={idx} className="bg-card border border-border rounded-lg p-3">
                  <span className="text-[11px] text-muted-foreground block mb-1">
                    {metric.label}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold font-mono text-foreground">
                      {metric.value}
                    </span>
                    {metric.baseline && (
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Base: {metric.baseline}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Correlated Transaction Snapshot */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-primary" />
                Correlated Transaction
              </h4>
              <span className="font-mono text-xs text-foreground font-medium">
                {signal.transactionSnapshot?.id}
              </span>
            </div>

            <div className="bg-muted/20 border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <span className="text-xs text-muted-foreground block">Amount</span>
                  <span className="text-lg font-bold font-mono text-foreground">
                    {signal.transactionSnapshot?.currency} {signal.transactionSnapshot?.amount?.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block">Method</span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-secondary rounded text-secondary-foreground">
                    {signal.transactionSnapshot?.paymentMethod}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Merchant:</span>
                  <p className="font-medium text-foreground">{signal.transactionSnapshot?.merchant}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <p className="font-medium text-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    {signal.transactionSnapshot?.location}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">IP Address:</span>
                  <p className="font-mono text-foreground flex items-center gap-1">
                    <Globe className="w-3 h-3 text-muted-foreground" />
                    {signal.transactionSnapshot?.ipAddress}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Device Fingerprint:</span>
                  <p className="font-mono text-foreground flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-muted-foreground" />
                    {signal.transactionSnapshot?.deviceId}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Entity Context */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-cyan-400" />
              Related Entity Target
            </h4>

            <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                  Entity Category: {signal.relatedEntity.type}
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  {signal.relatedEntity.id}
                </span>
                {signal.relatedEntity.name && (
                  <span className="text-xs text-muted-foreground block">
                    {signal.relatedEntity.name}
                  </span>
                )}
              </div>
              <span className="text-xs text-primary font-medium">Entity 360 Available →</span>
            </div>
          </div>

          {/* 5. Raw Evidence JSON Inspector */}
          <div className="pt-2 border-t border-border/60">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="flex items-center justify-between w-full text-xs font-medium text-muted-foreground hover:text-foreground py-2"
            >
              <span className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5" />
                Raw Technical Signal Payload (JSON)
              </span>
              <span>{showRawJson ? 'Hide ▲' : 'Inspect ▼'}</span>
            </button>

            {showRawJson && (
              <pre className="mt-2 p-3 bg-black/60 rounded-lg text-[11px] font-mono text-muted-foreground border border-border overflow-x-auto max-h-60">
                {JSON.stringify(signal, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
