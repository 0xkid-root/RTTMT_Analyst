'use client';

import React from 'react';
import { X, ArrowRight, ShieldCheck, Zap, ExternalLink, Activity, Info } from 'lucide-react';
import { TopologyNodeDefinition } from './detectionTopologyTypes';
import { useDetectionStore } from '../../store/useDetectionStore';

interface TopologyInspectorProps {
  node: TopologyNodeDefinition | null;
  onClose: () => void;
}

export function TopologyInspector({ node, onClose }: TopologyInspectorProps) {
  const { rules, signals, setSelectedRule, setSelectedSignal } = useDetectionStore();

  if (!node) return null;

  // Find corresponding rules if this is an engine node
  const associatedRules = node.ruleIds
    ? rules.filter((r) => node.ruleIds?.includes(r.id))
    : [];

  const handleOpenRule = (ruleId: string) => {
    const target = rules.find((r) => r.id === ruleId);
    if (target) {
      setSelectedRule(target);
    }
  };

  const handleOpenSignal = (signalId?: string) => {
    const target = signalId ? signals.find((s) => s.id === signalId) : signals[0];
    if (target) {
      setSelectedSignal(target);
    }
  };

  return (
    <div className="absolute top-3 right-3 bottom-3 w-80 z-30 bg-[#161616]/95 backdrop-blur-lg border border-[#2B2B2B] rounded-xl p-4 shadow-2xl flex flex-col justify-between overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200">
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#262626] pb-3">
          <div>
            <span className="text-[10px] font-mono tracking-wider uppercase text-blue-400 font-semibold block mb-0.5">
              {node.categoryLabel}
            </span>
            <h3 className="text-sm font-bold text-[#F5F5F5]">{node.title}</h3>
            <p className="text-[11px] text-[#8C8C8C] mt-0.5">{node.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-md flex items-center justify-center text-[#737373] hover:text-[#F5F5F5] hover:bg-[#262626] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Purpose / Architecture Description */}
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#737373] mb-1.5 flex items-center gap-1.5">
            <Info className="w-3 h-3 text-[#525252]" />
            Stage Purpose
          </h4>
          <p className="text-[#B5B5B5] leading-relaxed text-[11px] bg-[#1B1B1B] p-2.5 rounded-lg border border-[#242424]">
            {node.description}
          </p>
        </div>

        {/* Specifications */}
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#737373] mb-1.5">
            Operational Telemetry
          </h4>
          <div className="divide-y divide-[#222222] bg-[#1B1B1B] rounded-lg border border-[#242424] px-2.5">
            {node.specs.map((spec, i) => (
              <div key={i} className="py-2 flex items-center justify-between text-[11px]">
                <span className="text-[#808080]">{spec.label}</span>
                <span className="font-mono font-medium text-[#E5E5E5]">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Associated Rules (For Engine Nodes) */}
        {associatedRules.length > 0 && (
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#737373] mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Active Detection Rules ({associatedRules.length})
            </h4>
            <div className="space-y-1.5">
              {associatedRules.map((rule) => (
                <div
                  key={rule.id}
                  onClick={() => handleOpenRule(rule.id)}
                  className="p-2.5 bg-[#1B1B1B] hover:bg-[#222222] border border-[#242424] hover:border-blue-500/40 rounded-lg cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-blue-400">
                      {rule.id}
                    </span>
                    <span className="text-[9px] font-mono font-semibold px-1 rounded bg-[#262626] text-[#A3A3A3]">
                      {rule.severity}
                    </span>
                  </div>
                  <h5 className="text-[11px] font-medium text-[#E5E5E5] truncate group-hover:text-blue-300">
                    {rule.name}
                  </h5>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#262626] text-[10px] text-[#737373]">
                    <span>Hits: {rule.stats.hits24h}</span>
                    <span className="flex items-center gap-1 text-blue-400 group-hover:underline">
                      View Rule <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 4: Signal Aggregation deep-dive */}
        {node.id === 'stage-aggregation' && (
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#737373] mb-1.5 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" />
              Recent Aggregated Findings
            </h4>
            <div className="space-y-1.5">
              {signals.slice(0, 3).map((sig) => (
                <div
                  key={sig.id}
                  onClick={() => handleOpenSignal(sig.id)}
                  className="p-2 bg-[#1B1B1B] hover:bg-[#222222] border border-[#242424] hover:border-amber-500/40 rounded-lg cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono font-bold text-amber-400">{sig.id}</span>
                    <span className="font-mono text-[#808080]">{sig.signalType}</span>
                  </div>
                  <p className="text-[10px] text-[#A3A3A3] truncate mt-1">
                    {sig.evidence.summary}
                  </p>
                  <div className="flex items-center justify-end mt-1 text-[10px] text-amber-400 group-hover:underline gap-1">
                    <span>Inspect Signal</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-[#262626]">
        {node.id === 'stage-aggregation' ? (
          <button
            type="button"
            onClick={() => handleOpenSignal()}
            className="w-full py-1.5 px-3 rounded-lg bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Open Latest Signal in Drawer</span>
          </button>
        ) : associatedRules.length > 0 ? (
          <button
            type="button"
            onClick={() => handleOpenRule(associatedRules[0].id)}
            className="w-full py-1.5 px-3 rounded-lg bg-[#262626] hover:bg-[#303030] text-[#F5F5F5] font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#333333]"
          >
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>Open {associatedRules[0].id} in Drawer</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="w-full py-1.5 px-3 rounded-lg bg-[#222222] hover:bg-[#292929] text-[#A3A3A3] text-xs transition-colors"
          >
            Close Inspector
          </button>
        )}
      </div>
    </div>
  );
}
