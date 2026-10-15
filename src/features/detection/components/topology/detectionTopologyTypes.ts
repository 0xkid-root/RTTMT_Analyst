export type TopologyStageId = 
  | 'stage-ingress' 
  | 'stage-features' 
  | 'engine-velocity' 
  | 'engine-device-ip' 
  | 'engine-behavioral' 
  | 'engine-merchant' 
  | 'stage-aggregation';

export interface TopologyNodeDefinition {
  id: TopologyStageId;
  stageNumber: 1 | 2 | 3 | 4;
  title: string;
  categoryLabel: string;
  subtitle: string;
  description: string;
  iconName: 'ArrowLeftRight' | 'Cpu' | 'Gauge' | 'ShieldAlert' | 'Sparkles' | 'Store' | 'Zap';
  x: number;
  y: number;
  width: number;
  height: number;
  inHandle?: { x: number; y: number };
  outHandle?: { x: number; y: number };
  badgeText?: string;
  metricLabel: string;
  metricValue: string;
  ruleIds?: string[];
  specs: { label: string; value: string }[];
}

export interface TopologyEdgeDefinition {
  id: string;
  fromNodeId: TopologyStageId;
  toNodeId: TopologyStageId;
  fromHandle: { x: number; y: number };
  toHandle: { x: number; y: number };
  label?: string;
  engineKey?: 'velocity' | 'deviceIp' | 'behavioral' | 'merchant';
}

export interface SimulationVector {
  id: string;
  label: string;
  scenarioTitle: string;
  description: string;
  transaction: {
    id: string;
    amount: string;
    channel: string;
    account: string;
    location: string;
  };
  features: string[];
  activeEngines: ('velocity' | 'deviceIp' | 'behavioral' | 'merchant')[];
  matchedRules: {
    ruleId: string;
    engine: 'velocity' | 'deviceIp' | 'behavioral' | 'merchant';
    name: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    signalType: string;
  }[];
  emittedSignalCount: number;
  highestSeverity?: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}
