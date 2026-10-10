import React from 'react';
import { motion } from 'framer-motion';

export interface ScanConnectionProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isHighlighted: boolean;
  isSignalActive: boolean;
  prefersReducedMotion: boolean;
  signalDuration?: number;
  signalDelay?: number;
}

export function ScanConnection({
  startX, startY, endX, endY,
  isHighlighted, isSignalActive, prefersReducedMotion, signalDuration = 0.8, signalDelay = 0
}: ScanConnectionProps) {
  
  // Calculate path length for the dash array
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);

  return (
    <g>
      {/* Base subtle line */}
      <line 
        x1={startX} y1={startY} 
        x2={endX} y2={endY} 
        stroke="#292929" strokeWidth="1" 
      />
      
      {/* Active highlight line */}
      <motion.line 
        x1={startX} y1={startY} 
        x2={endX} y2={endY} 
        stroke={isHighlighted ? "#404040" : "#292929"} 
        strokeWidth="1" 
        initial={false}
        animate={{ 
          stroke: isHighlighted ? "#404040" : "#292929",
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Thin directional intelligence signal (always moving data ray) */}
      {!prefersReducedMotion && (
        <motion.line 
          x1={startX} y1={startY} 
          x2={endX} y2={endY}
          stroke="#F5F5F5"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 4px #F5F5F5)" }}
          // We use strokeDasharray to make it a short line (e.g. 35px long)
          strokeDasharray={`35 ${length}`}
          initial={{ strokeDashoffset: length + 35, opacity: 0 }}
          animate={{ 
            strokeDashoffset: [-35], 
            opacity: [0, 1, 1, 0]
          }}
          transition={{ 
            strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: "linear", delay: signalDelay },
            opacity: { duration: 1.5, repeat: Infinity, ease: "linear", delay: signalDelay, times: [0, 0.1, 0.9, 1] }
          }}
        />
      )}
    </g>
  );
}
