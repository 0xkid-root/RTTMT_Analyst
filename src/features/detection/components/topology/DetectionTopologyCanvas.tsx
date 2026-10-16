'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  TOPOLOGY_NODES,
  TOPOLOGY_EDGES,
  SIMULATION_VECTORS,
  CANVAS_DIMENSIONS,
} from './detectionTopologyData';
import {
  TopologyNodeDefinition,
  TopologyStageId,
  SimulationVector,
} from './detectionTopologyTypes';
import { TopologyNode } from './TopologyNode';
import { TopologyEdge } from './TopologyEdge';
import { TopologyControls } from './TopologyControls';
import { TopologyInspector } from './TopologyInspector';
import {
  ShieldAlert,
  CheckCircle2,
  RotateCcw,
  Play,
  Pause,
  FastForward,
} from 'lucide-react';

const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = CANVAS_DIMENSIONS;

export function DetectionTopologyCanvas({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion();

  // Canvas Viewport State (Zoom & Pan)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanEnabled, setIsPanEnabled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Selected Node for Detailed Inspector
  const [selectedNode, setSelectedNode] = useState<TopologyNodeDefinition | null>(null);

  // Simulation State
  const [currentVectorIndex, setCurrentVectorIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [simulationPhase, setSimulationPhase] = useState<'ingress' | 'features' | 'engines' | 'aggregation'>('ingress');

  const currentVector: SimulationVector = SIMULATION_VECTORS[currentVectorIndex];

  // Auto-fit canvas on container mount/resize
  const fitView = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;

    // Available space inside container
    const availW = clientWidth - 24;
    const availH = clientHeight - 90; // Space for top bar & bottom controls

    const scaleX = availW / CANVAS_WIDTH;
    const scaleY = availH / CANVAS_HEIGHT;
    const optimalScale = Math.min(1.05, Math.max(0.65, Math.min(scaleX, scaleY)));

    setZoom(optimalScale);
    setPan({
      x: (clientWidth - CANVAS_WIDTH * optimalScale) / 2,
      y: 44 + (availH - CANVAS_HEIGHT * optimalScale) / 2,
    });
  }, []);

  useEffect(() => {
    fitView();
    const handleResize = () => fitView();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fitView]);

  // Simulation Sequence Timer
  useEffect(() => {
    if (!isPlaying) return;

    const basePhaseDuration = 1450 / speedMultiplier;

    const timer = setInterval(() => {
      setSimulationPhase((prev) => {
        if (prev === 'ingress') return 'features';
        if (prev === 'features') return 'engines';
        if (prev === 'engines') return 'aggregation';
        
        // Loop to next vector
        setCurrentVectorIndex((idx) => (idx + 1) % SIMULATION_VECTORS.length);
        return 'ingress';
      });
    }, basePhaseDuration);

    return () => clearInterval(timer);
  }, [isPlaying, speedMultiplier]);

  // Calculate active nodes based on current simulation phase & vector
  const { activeNodeIds, matchedNodeIds } = useMemo(() => {
    const active: TopologyStageId[] = [];
    const matched: TopologyStageId[] = [];

    if (simulationPhase === 'ingress') {
      active.push('stage-ingress');
    } else if (simulationPhase === 'features') {
      active.push('stage-ingress', 'stage-features');
    } else if (simulationPhase === 'engines') {
      active.push('stage-features');
      // All 4 parallel engines evaluate in parallel
      active.push('engine-velocity', 'engine-device-ip', 'engine-behavioral', 'engine-merchant');

      // Highlight matched engines from current vector
      if (currentVector.activeEngines.includes('velocity')) matched.push('engine-velocity');
      if (currentVector.activeEngines.includes('deviceIp')) matched.push('engine-device-ip');
      if (currentVector.activeEngines.includes('behavioral')) matched.push('engine-behavioral');
      if (currentVector.activeEngines.includes('merchant')) matched.push('engine-merchant');
    } else if (simulationPhase === 'aggregation') {
      active.push('stage-aggregation');
      if (currentVector.emittedSignalCount > 0) {
        matched.push('stage-aggregation');
        if (currentVector.activeEngines.includes('velocity')) matched.push('engine-velocity');
        if (currentVector.activeEngines.includes('deviceIp')) matched.push('engine-device-ip');
        if (currentVector.activeEngines.includes('behavioral')) matched.push('engine-behavioral');
        if (currentVector.activeEngines.includes('merchant')) matched.push('engine-merchant');
      }
    }

    return { activeNodeIds: active, matchedNodeIds: matched };
  }, [simulationPhase, currentVector]);

  // Handle Pan and Zoom Mouse Events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPanEnabled) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isPanEnabled) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (!containerRef.current) return;
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((z) => Math.min(1.8, Math.max(0.6, z * zoomFactor)));
  };

  const handleZoomIn = () => setZoom((z) => Math.min(1.8, z + 0.15));
  const handleZoomOut = () => setZoom((z) => Math.max(0.6, z - 0.15));
  const handleReset = () => fitView();

  const handleSelectVector = (index: number) => {
    setCurrentVectorIndex(index);
    setSimulationPhase('ingress');
  };

  const handleReplayCurrent = () => {
    setSimulationPhase('ingress');
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full h-[500px] bg-[#101010] border border-[#262626] rounded-xl overflow-hidden shadow-2xl select-none ${
        isPanEnabled ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      } ${className}`}
    >
      {/* Top Header & Simulation Live Stream Bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#141414]/95 backdrop-blur-md border-b border-[#242424]">
        {/* Left: Topology Title & Simulation Badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-[#F5F5F5] tracking-tight">
              Parallel Detection Topology
            </span>
          </div>

          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
            Mock Simulation Mode
          </span>

          <span className="hidden xl:inline-flex text-[11px] font-mono text-[#808080]">
            Deterministic Flow • ~2.4ms Avg
          </span>
        </div>

        {/* Center/Right: Scenario Vector Tabs & Replay */}
        <div className="flex items-center gap-2">
          {/* Quick Scenario Selector Tabs */}
          <div className="hidden md:flex items-center bg-[#1A1A1A] p-0.5 rounded-lg border border-[#282828] text-[10px] font-mono">
            {SIMULATION_VECTORS.map((vec, idx) => (
              <button
                key={vec.id}
                type="button"
                onClick={() => handleSelectVector(idx)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  currentVectorIndex === idx
                    ? 'bg-[#2A2A2A] text-white font-semibold shadow-xs'
                    : 'text-[#808080] hover:text-[#D4D4D4]'
                }`}
              >
                {idx + 1}. {vec.label}
              </button>
            ))}
          </div>

          {/* Replay Current Scenario Button */}
          <button
            type="button"
            onClick={handleReplayCurrent}
            title="Replay Current Scenario Sequence"
            className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-md bg-[#222222] hover:bg-[#2B2B2B] text-[#D4D4D4] hover:text-white border border-[#2E2E2E] transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-[#A3A3A3]" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Grid & Edges */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
        }}
        className="absolute left-0 top-0 transition-transform duration-75 ease-out"
      >
        <svg
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="absolute inset-0 pointer-events-none"
        >
          <defs>
            {/* Background Dot Grid */}
            <pattern
              id="dot-grid"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="#202020" />
            </pattern>

            {/* Glowing filter */}
            <filter id="glow-edge" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Canvas Dot Pattern */}
          <rect width="100%" height="100%" fill="url(#dot-grid)" opacity={0.8} />

          {/* Stage Branching Connectors */}
          {TOPOLOGY_EDGES.map((edge) => {
            const isFromActive = activeNodeIds.includes(edge.fromNodeId);
            const isToActive = activeNodeIds.includes(edge.toNodeId);
            const isEdgeActive = isFromActive && isToActive;
            const isMatched = edge.engineKey
              ? currentVector.activeEngines.includes(edge.engineKey) && (simulationPhase === 'engines' || simulationPhase === 'aggregation')
              : false;

            return (
              <TopologyEdge
                key={edge.id}
                edge={edge}
                isActive={isEdgeActive}
                isMatched={isMatched}
                reducedMotion={Boolean(isReducedMotion)}
                speedMultiplier={speedMultiplier}
              />
            );
          })}
        </svg>

        {/* Nodes Layer */}
        {TOPOLOGY_NODES.map((node) => {
          const isSelected = selectedNode?.id === node.id;
          const isActive = activeNodeIds.includes(node.id);
          const isMatched = matchedNodeIds.includes(node.id);

          return (
            <TopologyNode
              key={node.id}
              node={node}
              isSelected={isSelected}
              isActive={isActive}
              isMatched={isMatched}
              onSelect={(n) => setSelectedNode(n)}
              reducedMotion={Boolean(isReducedMotion)}
            />
          );
        })}
      </div>

      {/* Bottom Left: Canvas Navigation Toolbar */}
      <TopologyControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={fitView}
        onReset={handleReset}
        isPanEnabled={isPanEnabled}
        onTogglePan={() => setIsPanEnabled(!isPanEnabled)}
      />

      {/* Bottom Right: Stream Playback & Telemetry Status (No Collision!) */}
      <div className="absolute bottom-3 right-4 z-20 flex items-center gap-2 bg-[#161616]/95 backdrop-blur-md border border-[#282828] rounded-lg px-2.5 py-1 shadow-lg text-xs font-mono">
        {/* Play / Pause Toggle */}
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'Pause Stream' : 'Resume Stream'}
          className={`px-2 py-0.5 rounded flex items-center gap-1.5 transition-colors ${
            isPlaying
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-[#888888] hover:text-[#E5E5E5] bg-[#222222]'
          }`}
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
          <span className="text-[11px]">{isPlaying ? 'Streaming' : 'Paused'}</span>
        </button>

        {/* Speed Multiplier Toggle */}
        <button
          type="button"
          onClick={() => setSpeedMultiplier((s) => (s === 1 ? 2 : 1))}
          title="Animation Speed Multiplier"
          className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#262626] transition-colors"
        >
          <FastForward className="w-3 h-3" />
          <span>{speedMultiplier}x</span>
        </button>

        <span className="text-[#3A3A3A]">•</span>

        {/* Active Stage Indicator */}
        <span className="text-[11px] text-[#888888]">
          Stage: <span className="text-[#E5E5E5] font-semibold uppercase">{simulationPhase}</span>
        </span>

        {/* Signal Outcome Tag */}
        {currentVector.emittedSignalCount > 0 ? (
          <span className="flex items-center gap-1 text-[10px] text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
            <ShieldAlert className="w-3 h-3" />
            {currentVector.emittedSignalCount} Signal
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Clean
          </span>
        )}
      </div>

      {/* Slide-out Inspector Drawer */}
      {selectedNode && (
        <TopologyInspector
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}
