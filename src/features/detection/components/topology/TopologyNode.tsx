'use client';

import React from 'react';
import {
  ArrowLeftRight,
  Cpu,
  Gauge,
  ShieldAlert,
  Sparkles,
  Store,
  Zap,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { TopologyNodeDefinition } from './detectionTopologyTypes';

interface TopologyNodeProps {
  node: TopologyNodeDefinition;
  isSelected: boolean;
  isActive: boolean;
  isMatched?: boolean;
  onSelect: (node: TopologyNodeDefinition) => void;
  reducedMotion?: boolean;
}

const ICON_MAP = {
  ArrowLeftRight,
  Cpu,
  Gauge,
  ShieldAlert,
  Sparkles,
  Store,
  Zap,
};

export function TopologyNode({
  node,
  isSelected,
  isActive,
  isMatched = false,
  onSelect,
  reducedMotion = false,
}: TopologyNodeProps) {
  const Icon = ICON_MAP[node.iconName] || Activity;
  const isStage4 = node.id === 'stage-aggregation';

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node);
      }}
      style={{
        position: 'absolute',
        left: node.x,
        top: node.y,
        width: node.width,
        height: node.height,
        cursor: 'pointer',
      }}
      className={`group select-none rounded-xl border transition-all duration-200 z-10 flex flex-col justify-between px-3 py-2.5
        ${
          isSelected
            ? 'border-blue-400 bg-[#1F1F1F] shadow-[0_0_24px_rgba(59,130,246,0.35)] ring-1 ring-blue-500/50'
            : isMatched
            ? 'border-red-500/80 bg-[#1B1616] shadow-[0_0_20px_rgba(239,68,68,0.28)]'
            : isActive
            ? 'border-blue-500/60 bg-[#191919] shadow-[0_0_16px_rgba(59,130,246,0.18)]'
            : 'border-[#292929] bg-[#171717] hover:border-[#3A3A3A] hover:bg-[#1C1C1C]'
        }
      `}
    >
      {/* Restrained Ambient Radial Glow when Active/Matched */}
      {!reducedMotion && (isActive || isMatched) && (
        <div
          className="absolute -inset-2 rounded-2xl pointer-events-none opacity-40 blur-md transition-opacity duration-300 -z-10"
          style={{
            background: isMatched
              ? 'radial-gradient(circle, rgba(239,68,68,0.25) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Top subtle highlight border line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none rounded-t-xl" />

      {/* Input Handle Port (Left) */}
      {node.inHandle && (
        <div
          className={`absolute -left-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border flex items-center justify-center transition-colors
            ${
              isMatched
                ? 'bg-red-500 border-red-300 shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                : isActive
                ? 'bg-blue-500 border-blue-300 shadow-[0_0_6px_rgba(59,130,246,0.8)]'
                : 'bg-[#121212] border-[#383838] group-hover:border-[#525252]'
            }
          `}
        >
          <div className="w-1 h-1 rounded-full bg-white/60" />
        </div>
      )}

      {/* Output Handle Port (Right) */}
      {node.outHandle && (
        <div
          className={`absolute -right-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border flex items-center justify-center transition-colors
            ${
              isMatched
                ? 'bg-red-500 border-red-300 shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                : isActive
                ? 'bg-blue-500 border-blue-300 shadow-[0_0_6px_rgba(59,130,246,0.8)]'
                : 'bg-[#121212] border-[#383838] group-hover:border-[#525252]'
            }
          `}
        >
          <div className="w-1 h-1 rounded-full bg-white/60" />
        </div>
      )}

      {/* Row 1: Category Tag & Status Pill */}
      <div className="flex items-center justify-between gap-1 leading-none">
        <span className="text-[9px] font-mono tracking-wider font-semibold uppercase text-[#737373] group-hover:text-[#A3A3A3] transition-colors">
          {node.categoryLabel}
        </span>

        {isMatched ? (
          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            <AlertTriangle className="w-2.5 h-2.5" />
            MATCH
          </span>
        ) : isActive ? (
          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <span className={`w-1.5 h-1.5 rounded-full bg-blue-400 ${!reducedMotion ? 'animate-ping' : ''}`} />
            ACTIVE
          </span>
        ) : (
          <span className="text-[9px] font-mono text-[#666666]">
            {node.badgeText}
          </span>
        )}
      </div>

      {/* Row 2: Icon & Title */}
      <div className="flex items-center gap-2 mt-1">
        <div
          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors
            ${
              isMatched
                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                : isStage4
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : isActive
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                : 'bg-[#222222] text-[#A3A3A3] border-[#2E2E2E] group-hover:text-[#F5F5F5]'
            }
          `}
        >
          <Icon className="w-3 h-3" />
        </div>

        <h4 className="text-[12px] font-semibold text-[#F5F5F5] tracking-tight leading-snug">
          {node.title}
        </h4>
      </div>

      {/* Row 3: Metrics Footer */}
      <div className="flex items-center justify-between border-t border-[#262626] pt-1.5 mt-1 text-[10px] font-mono">
        <span className="text-[#666666]">{node.metricLabel}</span>
        <span
          className={`font-semibold ${
            isMatched
              ? 'text-red-400'
              : isStage4
              ? 'text-amber-400 font-bold'
              : isActive
              ? 'text-blue-300'
              : 'text-[#D4D4D4]'
          }`}
        >
          {node.metricValue}
        </span>
      </div>
    </div>
  );
}
