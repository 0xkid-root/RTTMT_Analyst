'use client';

import React from 'react';
import { DetectionTopologyCanvas } from '../topology/DetectionTopologyCanvas';

export function DetectionSignalPipeline({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full ${className}`}>
      <DetectionTopologyCanvas />
    </div>
  );
}

export { DetectionTopologyCanvas };
