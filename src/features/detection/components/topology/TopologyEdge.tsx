'use client';

import React from 'react';
import { TopologyEdgeDefinition } from './detectionTopologyTypes';

interface TopologyEdgeProps {
  edge: TopologyEdgeDefinition;
  isActive: boolean;
  isMatched?: boolean;
  reducedMotion?: boolean;
  speedMultiplier?: number;
}

export function TopologyEdge({
  edge,
  isActive,
  isMatched = false,
  reducedMotion = false,
  speedMultiplier = 1,
}: TopologyEdgeProps) {
  const { fromHandle, toHandle } = edge;

  const dx = toHandle.x - fromHandle.x;
  const cp1x = fromHandle.x + dx * 0.5;
  const cp1y = fromHandle.y;
  const cp2x = toHandle.x - dx * 0.5;
  const cp2y = toHandle.y;

  const pathData = `M ${fromHandle.x} ${fromHandle.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${toHandle.x} ${toHandle.y}`;

  // Unique durations to create natural asynchronous flow without chaotic jitter
  const getDuration = () => {
    const base = edge.engineKey === 'velocity' ? 2.0
      : edge.engineKey === 'deviceIp' ? 2.4
      : edge.engineKey === 'behavioral' ? 2.8
      : edge.engineKey === 'merchant' ? 2.2
      : 1.8;
    return `${(base / speedMultiplier).toFixed(2)}s`;
  };

  const activeColor = isMatched 
    ? '#EF4444' // Match red/coral
    : isActive 
      ? '#3B82F6' // Telemetry blue
      : '#242424'; // Idle border

  const particleColor = isMatched ? '#F87171' : '#60A5FA';

  return (
    <g className="transition-opacity duration-300">
      {/* Background static track */}
      <path
        d={pathData}
        fill="none"
        stroke="#222222"
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Active illuminated path */}
      {isActive && (
        <path
          d={pathData}
          fill="none"
          stroke={activeColor}
          strokeWidth={isMatched ? 2.5 : 1.8}
          strokeDasharray={isMatched ? 'none' : '4 4'}
          className={isActive && !reducedMotion ? 'animate-[dash_1s_linear_infinite]' : ''}
          opacity={isMatched ? 0.95 : 0.65}
          style={{
            filter: isMatched
              ? 'drop-shadow(0 0 6px rgba(239,68,68,0.7))'
              : 'drop-shadow(0 0 4px rgba(59,130,246,0.5))',
            transition: 'stroke 0.3s ease, opacity 0.3s ease',
          }}
        />
      )}

      {/* Traveling photon particle */}
      {isActive && !reducedMotion && (
        <g>
          {/* Outer glow blur */}
          <circle r={isMatched ? 5.5 : 4} fill={particleColor} opacity={0.4}>
            <animateMotion
              path={pathData}
              dur={getDuration()}
              repeatCount="indefinite"
              rotate="auto"
              calcMode="linear"
            />
          </circle>

          {/* Crisp center core */}
          <circle r={isMatched ? 2.8 : 2.2} fill="#FFFFFF">
            <animateMotion
              path={pathData}
              dur={getDuration()}
              repeatCount="indefinite"
              rotate="auto"
              calcMode="linear"
            />
          </circle>
        </g>
      )}
    </g>
  );
}
