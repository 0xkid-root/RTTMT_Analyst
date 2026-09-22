import {
  RiskSummary,
  RiskLocation,
  RuleTrigger,
  RecentAlert,
  RecentCase,
  MaliScoreDistribution,
  TransactionVolumeData,
  AlertTrendData,
  NetworkEdge
} from '../types/command-center-types';

export const mockRiskSummary: RiskSummary = {
  totalTransactions: { total: 125842, trendPercent: 12 },
  highRiskTransactions: { total: 1248, trendPercent: 8 },
  openAlerts: { total: 627, trendPercent: -15 },
  openCases: { total: 143, trendPercent: -10 },
  resolvedToday: { total: 312, trendPercent: 22 },
  slaBreached: { total: 28, trendPercent: 40 },
};

export const mockRiskLocations: RiskLocation[] = [
  { id: 'loc-1', city: 'Delhi', latitude: 28.7041, longitude: 77.1025, riskLevel: 'CRITICAL', transactions: 8421, alerts: 142, cases: 18 },
  { id: 'loc-2', city: 'Mumbai', latitude: 19.076, longitude: 72.8777, riskLevel: 'HIGH', transactions: 12420, alerts: 89, cases: 12 },
  { id: 'loc-3', city: 'Bengaluru', latitude: 12.9716, longitude: 77.5946, riskLevel: 'MEDIUM', transactions: 15050, alerts: 45, cases: 5 },
  { id: 'loc-4', city: 'Hyderabad', latitude: 17.3850, longitude: 78.4867, riskLevel: 'LOW', transactions: 9400, alerts: 12, cases: 1 },
  { id: 'loc-5', city: 'Chennai', latitude: 13.0827, longitude: 80.2707, riskLevel: 'LOW', transactions: 11800, alerts: 14, cases: 2 },
  { id: 'loc-6', city: 'Pune', latitude: 18.5204, longitude: 73.8567, riskLevel: 'HIGH', transactions: 8200, alerts: 61, cases: 8 },
  { id: 'loc-7', city: 'Kolkata', latitude: 22.5726, longitude: 88.3639, riskLevel: 'MEDIUM', transactions: 7400, alerts: 33, cases: 4 },
  { id: 'loc-8', city: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714, riskLevel: 'CRITICAL', transactions: 6200, alerts: 105, cases: 14 },
];

export const mockNetworkEdges: NetworkEdge[] = [
  { id: 'edge-1', sourceId: 'loc-1', targetId: 'loc-2' },
  { id: 'edge-2', sourceId: 'loc-1', targetId: 'loc-8' },
  { id: 'edge-3', sourceId: 'loc-2', targetId: 'loc-3' },
  { id: 'edge-4', sourceId: 'loc-3', targetId: 'loc-5' },
  { id: 'edge-5', sourceId: 'loc-3', targetId: 'loc-4' },
  { id: 'edge-6', sourceId: 'loc-2', targetId: 'loc-6' },
  { id: 'edge-7', sourceId: 'loc-1', targetId: 'loc-7' },
  { id: 'edge-8', sourceId: 'loc-4', targetId: 'loc-7' },
  { id: 'edge-9', sourceId: 'loc-4', targetId: 'loc-1' },
];

export const mockTopRules: RuleTrigger[] = [
  { id: 'rule-1', ruleName: 'High Transaction Velocity', hits24h: 3284, iconType: 'lock' },
  { id: 'rule-2', ruleName: 'Unusual Amount', hits24h: 2761, iconType: 'monitor' },
  { id: 'rule-3', ruleName: 'Geographic Anomaly', hits24h: 1982, iconType: 'globe' },
  { id: 'rule-4', ruleName: 'Device Fingerprint', hits24h: 1421, iconType: 'shield' },
  { id: 'rule-5', ruleName: 'Multiple Accounts', hits24h: 1203, iconType: 'users' },
];

export const mockRecentAlerts: RecentAlert[] = [
  { id: 'A-78452', riskLevel: 'CRITICAL', merchant: 'Flipkart', amount: 245000, time: '10:42 AM' },
  { id: 'A-78451', riskLevel: 'HIGH', merchant: 'Amazon', amount: 78000, time: '10:37 AM' },
  { id: 'A-78450', riskLevel: 'HIGH', merchant: 'BigBasket', amount: 120000, time: '10:21 AM' },
  { id: 'A-78448', riskLevel: 'MEDIUM', merchant: 'Ola', amount: 32000, time: '09:58 AM' },
  { id: 'A-78447', riskLevel: 'MEDIUM', merchant: 'Uber', amount: 45000, time: '09:43 AM' },
];

export const mockRecentCases: RecentCase[] = [
  { id: 'C-1024', priority: 'HIGH', merchant: 'Flipkart', status: 'Investigating' },
  { id: 'C-1022', priority: 'HIGH', merchant: 'Amazon', status: 'Assigned' },
  { id: 'C-1018', priority: 'MEDIUM', merchant: 'BigBasket', status: 'Pending Review' },
  { id: 'C-1016', priority: 'MEDIUM', merchant: 'Ola', status: 'Open' },
  { id: 'C-1012', priority: 'LOW', merchant: 'Uber', status: 'Closed' },
];

export const mockMaliScoreDistribution: MaliScoreDistribution[] = [
  { range: '0-20', percentage: 52 },
  { range: '21-40', percentage: 28 },
  { range: '41-60', percentage: 12 },
  { range: '61-80', percentage: 6 },
  { range: '81-100', percentage: 2 },
];

export const mockTransactionVolume: TransactionVolumeData = {
  times: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
  successful: [22000, 18000, 35000, 42000, 38000, 45000],
  failed: [8000, 5000, 12000, 15000, 10000, 18000],
};

export const mockAlertTrend: AlertTrendData = {
  dates: ['Apr 21', 'Apr 22', 'Apr 23', 'Apr 24', 'Apr 25', 'Apr 26', 'Apr 27', 'Apr 28'],
  critical: [15, 20, 18, 25, 22, 19, 28, 30],
  high: [30, 35, 32, 40, 38, 35, 45, 50],
  medium: [40, 45, 42, 50, 48, 45, 55, 60],
  low: [25, 30, 28, 35, 32, 30, 38, 40],
};
