'use client';

import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Move,
} from 'lucide-react';

interface TopologyControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onReset: () => void;
  isPanEnabled: boolean;
  onTogglePan: () => void;
}

export function TopologyControls({
  onZoomIn,
  onZoomOut,
  onFitView,
  onReset,
  isPanEnabled,
  onTogglePan,
}: TopologyControlsProps) {
  return (
    <div className="absolute bottom-3 left-4 z-20 flex items-center gap-1 bg-[#161616]/90 backdrop-blur-md border border-[#282828] rounded-lg p-1 shadow-lg">
      <button
        type="button"
        onClick={onZoomIn}
        title="Zoom In (+)"
        className="w-7 h-7 rounded-md flex items-center justify-center text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#262626] transition-colors"
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={onZoomOut}
        title="Zoom Out (-)"
        className="w-7 h-7 rounded-md flex items-center justify-center text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#262626] transition-colors"
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={onFitView}
        title="Fit to View"
        className="w-7 h-7 rounded-md flex items-center justify-center text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#262626] transition-colors"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={onReset}
        title="Reset Coordinates"
        className="w-7 h-7 rounded-md flex items-center justify-center text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#262626] transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      <div className="w-[1px] h-3.5 bg-[#2C2C2C] mx-0.5" />

      {/* Pan Drag Toggle */}
      <button
        type="button"
        onClick={onTogglePan}
        title={isPanEnabled ? 'Pan Mode Enabled (Click & Drag)' : 'Enable Pan Canvas'}
        className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
          isPanEnabled
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
            : 'text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#262626]'
        }`}
      >
        <Move className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
