import {
  PriorityActivity,
  RecentEvent,
  RiskLocation,
  RiskSummary,
  RiskDistributionSummary,
  TransactionActivitySummary
} from '../types/command-center-types';

export const mockRiskSummary: RiskSummary = {
  activeAlerts: {
    total: 128,
    trend: 12,
  },
  highRisk: {
    total: 34,
    critical: 8,
  },
  transactions: {
    total: 1280000,
    trendPercent: 4.8,
  },
  riskRate: {
    value: 2.7,
    trendPercent: -0.4,
  },
  openCases: {
    total: 46,
    priority: 7,
  },
};

export const mockRiskLocations: RiskLocation[] = [
  { id: 'loc-1', city: 'Mumbai', latitude: 19.076, longitude: 72.8777, riskLevel: 'HIGH', transactions: 18420, riskEvents: 43 },
  { id: 'loc-2', city: 'Delhi', latitude: 28.7041, longitude: 77.1025, riskLevel: 'CRITICAL', transactions: 24100, riskEvents: 89 },
  { id: 'loc-3', city: 'Bengaluru', latitude: 12.9716, longitude: 77.5946, riskLevel: 'MEDIUM', transactions: 31050, riskEvents: 15 },
  { id: 'loc-4', city: 'Hyderabad', latitude: 17.3850, longitude: 78.4867, riskLevel: 'LOW', transactions: 12400, riskEvents: 2 },
  { id: 'loc-5', city: 'Chennai', latitude: 13.0827, longitude: 80.2707, riskLevel: 'LOW', transactions: 15800, riskEvents: 4 },
  { id: 'loc-6', city: 'Pune', latitude: 18.5204, longitude: 73.8567, riskLevel: 'MEDIUM', transactions: 9200, riskEvents: 11 },
  { id: 'loc-7', city: 'Kolkata', latitude: 22.5726, longitude: 88.3639, riskLevel: 'LOW', transactions: 8400, riskEvents: 3 },
  { id: 'loc-8', city: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714, riskLevel: 'HIGH', transactions: 11200, riskEvents: 27 },
];

export const mockPriorityActivity: PriorityActivity[] = [
  {
    id: 'pa-1',
    riskLevel: 'HIGH',
    type: 'Unusual transaction velocity',
    merchant: 'Demo Merchant A',
    location: 'Mumbai',
    timestamp: '2 min ago'
  },
  {
    id: 'pa-2',
    riskLevel: 'CRITICAL',
    type: 'Multiple device anomalies',
    merchant: 'Demo Merchant B',
    location: 'Delhi',
    timestamp: '6 min ago'
  },
  {
    id: 'pa-3',
    riskLevel: 'HIGH',
    type: 'Unusual transaction amount',
    merchant: 'Demo Merchant C',
    location: 'Bengaluru',
    timestamp: '11 min ago'
  },
  {
    id: 'pa-4',
    riskLevel: 'MEDIUM',
    type: 'Velocity limit approaching',
    merchant: 'Demo Merchant D',
    location: 'Pune',
    timestamp: '18 min ago'
  },
];

export const mockTransactionActivity: TransactionActivitySummary = {
  successful: 1180000,
  underReview: 3200,
  declined: 8400,
  riskFlagged: 2700
};

export const mockRiskDistribution: RiskDistributionSummary = {
  low: 72,
  medium: 18,
  high: 8,
  critical: 2
};

export const mockRecentEvents: RecentEvent[] = [
  { id: 're-1', time: '16:42', type: 'Alert', description: 'High-risk transaction detected', status: 'error' },
  { id: 're-2', time: '16:39', type: 'Alert', description: 'New alert created', status: 'warning' },
  { id: 're-3', time: '16:35', type: 'System', description: 'Merchant risk profile updated', status: 'info' },
  { id: 're-4', time: '16:31', type: 'Detection', description: 'Detection rule triggered', status: 'warning' },
  { id: 're-5', time: '16:27', type: 'Case', description: 'Case priority changed', status: 'success' },
];

export const mockRiskChartData = {
  times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'],
  values: [12, 15, 45, 20, 89, 34, 18]
};
