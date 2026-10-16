import {
  DetectionRule,
  DetectionSignal,
  DetectionPattern,
  SimulationPreset,
  RuleSimulationInput,
  RuleSimulationResult,
  ConditionEvaluationResult,
} from '../types/detection';
import { mockHistoricalTransactions } from '@/features/monitor/data/mockTransactions';

// ---------------------------------------------------------------------------
// 1. Detection Rules Mock Data
// ---------------------------------------------------------------------------
export const mockDetectionRules: DetectionRule[] = [
  {
    id: 'RUL-VEL-001',
    name: 'Excessive Velocity in Short Window',
    category: 'VELOCITY',
    description: 'Triggers when a customer account initiates more than 4 transactions within a 10-minute rolling timeframe.',
    severity: 'HIGH',
    enabled: true,
    version: 'v2.4.1',
    lastUpdated: '2026-10-12T14:20:00Z',
    updatedBy: 'Ananya Sharma (Senior Detection Engineer)',
    logic: 'AND',
    actionSignalType: 'HIGH_VELOCITY',
    conditions: [
      {
        id: 'c-vel-1',
        field: 'tx.velocity_10m',
        label: 'Transactions in last 10m',
        operator: '>',
        value: 4,
        unit: 'txns',
        description: 'Rapid succession payment counter for the same source account.'
      },
      {
        id: 'c-vel-2',
        field: 'tx.amount',
        label: 'Transaction Amount',
        operator: '>',
        value: 1000,
        unit: 'INR',
        description: 'Excludes micro fee payments.'
      }
    ],
    stats: {
      hits24h: 184,
      hits7d: 1240,
      falsePositiveRate: 1.6,
      avgLatencyMs: 2.4,
    },
    history: [
      {
        version: 'v2.4.1',
        date: '2026-10-12',
        author: 'Ananya Sharma',
        changes: 'Increased velocity threshold from 3 to 4 txns to reduce benign batch refunds.'
      },
      {
        version: 'v2.3.0',
        date: '2026-08-15',
        author: 'Rahul Verma',
        changes: 'Added minimum amount filter (> 1,000 INR).'
      },
      {
        version: 'v2.0.0',
        date: '2026-05-01',
        author: 'System Initializer',
        changes: 'Migrated from v1 legacy stream listener to stateful rolling window.'
      }
    ],
    exampleEvidence: [
      '5 transactions totaling ₹48,200 recorded in 6m 12s across 3 separate merchant terminals.',
      '7 rapid transfers initiated within 4m 50s via UPI payment rails.'
    ]
  },
  {
    id: 'RUL-AMT-002',
    name: 'Extreme Amount Exceeding 30-Day Median',
    category: 'AMOUNT_ANOMALY',
    description: 'Identifies single transaction values exceeding 10x the entity median spend profile over the prior 30 days.',
    severity: 'CRITICAL',
    enabled: true,
    version: 'v3.1.0',
    lastUpdated: '2026-10-10T09:15:00Z',
    updatedBy: 'Priya Singh (Lead Risk Strategist)',
    logic: 'AND',
    actionSignalType: 'UNUSUAL_AMOUNT',
    conditions: [
      {
        id: 'c-amt-1',
        field: 'tx.amount',
        label: 'Transaction Amount',
        operator: '>',
        value: 50000,
        unit: 'INR',
        description: 'Absolute minimum amount threshold for spike detection.'
      },
      {
        id: 'c-amt-2',
        field: 'tx.velocity_1h',
        label: 'Hourly Velocity Count',
        operator: '>=',
        value: 1,
        unit: 'txns',
        description: 'Validates active transaction context.'
      }
    ],
    stats: {
      hits24h: 42,
      hits7d: 318,
      falsePositiveRate: 2.1,
      avgLatencyMs: 3.8,
    },
    history: [
      {
        version: 'v3.1.0',
        date: '2026-10-10',
        author: 'Priya Singh',
        changes: 'Fine-tuned baseline calculation window to adapt to festive seasonal spikes.'
      },
      {
        version: 'v3.0.0',
        date: '2026-07-20',
        author: 'Ananya Sharma',
        changes: 'Upgraded dynamic baseline lookup table.'
      }
    ],
    exampleEvidence: [
      'Transaction ₹184,000 exceeds account 30-day median (₹2,100) by 87.6x.',
      'First-time international transfer of ₹320,000 on student account.'
    ]
  },
  {
    id: 'RUL-GEO-003',
    name: 'Impossible Geographic Travel Speed',
    category: 'GEOLOCATION',
    description: 'Detects consecutive transactions originating from geographic coordinates whose physical travel speed exceeds 800 km/h.',
    severity: 'CRITICAL',
    enabled: true,
    version: 'v1.8.2',
    lastUpdated: '2026-10-11T16:45:00Z',
    updatedBy: 'Vikram Joshi (Fraud Analytics)',
    logic: 'AND',
    actionSignalType: 'IMPOSSIBLE_TRAVEL',
    conditions: [
      {
        id: 'c-geo-1',
        field: 'tx.distance_km',
        label: 'Distance from Prior Transaction',
        operator: '>',
        value: 600,
        unit: 'km',
        description: 'Physical straight-line displacement between IP geolocations.'
      },
      {
        id: 'c-geo-2',
        field: 'tx.hours_since_last_seen',
        label: 'Elapsed Time Since Last Seen',
        operator: '<',
        value: 1,
        unit: 'hours',
        description: 'Short elapsed window rendering commercial flight or transit physically impossible.'
      }
    ],
    stats: {
      hits24h: 27,
      hits7d: 194,
      falsePositiveRate: 0.8,
      avgLatencyMs: 4.1,
    },
    history: [
      {
        version: 'v1.8.2',
        date: '2026-10-11',
        author: 'Vikram Joshi',
        changes: 'Added exclusion for trusted cellular roaming gateway ISP ranges.'
      },
      {
        version: 'v1.8.0',
        date: '2026-06-14',
        author: 'Vikram Joshi',
        changes: 'Integrated MaxMind GeoIP Precision database.'
      }
    ],
    exampleEvidence: [
      'Displacement of 1,180 km (Mumbai to Delhi) logged in 22 minutes (Effective speed: 3,218 km/h).',
      'Transaction in London 45 minutes after Bengaluru checkout.'
    ]
  },
  {
    id: 'RUL-NET-004',
    name: 'Tor Exit Node / Bulletproof Hosting IP',
    category: 'NETWORK_REPUTATION',
    description: 'Flags transactions initiated from active Tor exit nodes, high-anonymity VPN proxies, or flagged hosting provider ASNs.',
    severity: 'HIGH',
    enabled: true,
    version: 'v4.0.0',
    lastUpdated: '2026-10-13T08:30:00Z',
    updatedBy: 'Priya Singh (Lead Risk Strategist)',
    logic: 'AND',
    actionSignalType: 'IP_RISK',
    conditions: [
      {
        id: 'c-net-1',
        field: 'tx.ip_risk_score',
        label: 'IP Threat & Proxy Score',
        operator: '>=',
        value: 80,
        unit: '/100',
        description: 'Intelligence score derived from composite IP reputation feeds.'
      }
    ],
    stats: {
      hits24h: 112,
      hits7d: 870,
      falsePositiveRate: 1.2,
      avgLatencyMs: 1.9,
    },
    history: [
      {
        version: 'v4.0.0',
        date: '2026-10-13',
        author: 'Priya Singh',
        changes: 'Automated 15-minute Tor relay consensus feed synchronization.'
      }
    ],
    exampleEvidence: [
      'Inbound connection matched public Tor exit node 185.220.101.5 with Tor Consensus ID #8129.',
      'Bulletproof VPS hosting range 45.154.255.0/24 with active spam/botnet flags.'
    ]
  },
  {
    id: 'RUL-DEV-005',
    name: 'Unrecognized Device with OS Fingerprint Mismatch',
    category: 'DEVICE_INTELLIGENCE',
    description: 'Signals when an unfamiliar device ID logs in with conflicting browser/OS user agent headers and canvas fingerprint hashes.',
    severity: 'MEDIUM',
    enabled: true,
    version: 'v2.1.0',
    lastUpdated: '2026-10-09T11:00:00Z',
    updatedBy: 'Ananya Sharma (Senior Detection Engineer)',
    logic: 'AND',
    actionSignalType: 'NEW_DEVICE',
    conditions: [
      {
        id: 'c-dev-1',
        field: 'tx.is_new_device',
        label: 'Is Unregistered Device',
        operator: '==',
        value: true,
        description: 'Hardware fingerprint not present in historical entity device graph.'
      },
      {
        id: 'c-dev-2',
        field: 'tx.amount',
        label: 'Transaction Amount',
        operator: '>',
        value: 5000,
        unit: 'INR',
        description: 'Limits noise on small recurring micro-purchases.'
      }
    ],
    stats: {
      hits24h: 96,
      hits7d: 680,
      falsePositiveRate: 3.4,
      avgLatencyMs: 2.1,
    },
    history: [
      {
        version: 'v2.1.0',
        date: '2026-10-09',
        author: 'Ananya Sharma',
        changes: 'Adjusted device cookie binding verification to support WebAuthn keys.'
      }
    ],
    exampleEvidence: [
      'New Linux User-Agent on account previously 100% iOS mobile app authenticated.',
      'WebGL canvas hash entropy anomaly detected on newly bound device DEV-94812.'
    ]
  },
  {
    id: 'RUL-MER-006',
    name: 'High-Risk Merchant Category Surge',
    category: 'BEHAVIORAL',
    description: 'Monitors sudden volume or amount shifts directed to crypto on-ramps, unregulated gaming platforms, or offshore remittance hubs.',
    severity: 'HIGH',
    enabled: true,
    version: 'v1.4.0',
    lastUpdated: '2026-10-08T17:10:00Z',
    updatedBy: 'Vikram Joshi (Fraud Analytics)',
    logic: 'AND',
    actionSignalType: 'MERCHANT_RISK',
    conditions: [
      {
        id: 'c-mer-1',
        field: 'tx.amount',
        label: 'Transaction Amount',
        operator: '>',
        value: 25000,
        unit: 'INR',
        description: 'Threshold for high-risk MCC transactions.'
      },
      {
        id: 'c-mer-2',
        field: 'tx.velocity_1h',
        label: '1-Hour Merchant Velocity',
        operator: '>=',
        value: 2,
        unit: 'txns',
        description: 'Multi-round deposit attempts within 60 minutes.'
      }
    ],
    stats: {
      hits24h: 53,
      hits7d: 410,
      falsePositiveRate: 2.9,
      avgLatencyMs: 2.7,
    },
    history: [
      {
        version: 'v1.4.0',
        date: '2026-10-08',
        author: 'Vikram Joshi',
        changes: 'Expanded high-risk MCC dictionary with newly licensed offshore operators.'
      }
    ],
    exampleEvidence: [
      '3 consecutive ₹30,000 deposits to offshore P2P crypto liquidity provider within 18 minutes.',
      'Rapid withdrawals from multiple accounts to single aggregator merchant ID M-4091.'
    ]
  },
  {
    id: 'RUL-BEH-007',
    name: 'Dormant Account Sudden High-Value Transfer',
    category: 'BEHAVIORAL',
    description: 'Triggers when an account with zero outgoing transactions in >60 days suddenly initiates a high-value transfer.',
    severity: 'HIGH',
    enabled: true,
    version: 'v2.0.1',
    lastUpdated: '2026-10-05T13:00:00Z',
    updatedBy: 'Priya Singh (Lead Risk Strategist)',
    logic: 'AND',
    actionSignalType: 'UNUSUAL_AMOUNT',
    conditions: [
      {
        id: 'c-beh-1',
        field: 'tx.hours_since_last_seen',
        label: 'Inactivity Period',
        operator: '>',
        value: 1440, // 60 days
        unit: 'hours',
        description: 'Account dormancy period before sudden activity.'
      },
      {
        id: 'c-beh-2',
        field: 'tx.amount',
        label: 'Transaction Amount',
        operator: '>',
        value: 40000,
        unit: 'INR',
        description: 'High-value outflow threshold.'
      }
    ],
    stats: {
      hits24h: 19,
      hits7d: 142,
      falsePositiveRate: 1.1,
      avgLatencyMs: 3.2,
    },
    history: [
      {
        version: 'v2.0.1',
        date: '2026-10-05',
        author: 'Priya Singh',
        changes: 'Reduced minimum dormancy hours from 2160h (90d) to 1440h (60d).'
      }
    ],
    exampleEvidence: [
      'Account inactive for 82 days executed NEFT transfer of ₹125,000 within 4 minutes of password reset.',
      'Dormant savings account drained via 2 rapid IMPS transfers.'
    ]
  },
  {
    id: 'RUL-VEL-008',
    name: 'Rapid Micro-Charge Card Testing Pattern',
    category: 'VELOCITY',
    description: 'Identifies bot-driven card validity tests characterized by rapid micro-charges under ₹100.',
    severity: 'MEDIUM',
    enabled: true,
    version: 'v3.0.0',
    lastUpdated: '2026-10-01T10:00:00Z',
    updatedBy: 'Ananya Sharma (Senior Detection Engineer)',
    logic: 'AND',
    actionSignalType: 'HIGH_VELOCITY',
    conditions: [
      {
        id: 'c-mic-1',
        field: 'tx.velocity_10m',
        label: '10m Velocity Count',
        operator: '>=',
        value: 3,
        unit: 'txns',
        description: 'High frequency automated requests.'
      },
      {
        id: 'c-mic-2',
        field: 'tx.amount',
        label: 'Transaction Amount',
        operator: '<',
        value: 100,
        unit: 'INR',
        description: 'Micro charges used for BIN testing.'
      }
    ],
    stats: {
      hits24h: 145,
      hits7d: 1120,
      falsePositiveRate: 0.9,
      avgLatencyMs: 1.8,
    },
    history: [
      {
        version: 'v3.0.0',
        date: '2026-10-01',
        author: 'Ananya Sharma',
        changes: 'Unified micro-charge thresholds for Card and UPI payment methods.'
      }
    ],
    exampleEvidence: [
      '6 transactions of ₹10, ₹15, ₹20 attempted within 48s against e-commerce merchant M-1092.',
      'Automated bin brute-force script testing 4 authorization tokens.'
    ]
  },
  {
    id: 'RUL-DEV-009',
    name: 'Headless Browser / Automation Emulator Signature',
    category: 'DEVICE_INTELLIGENCE',
    description: 'Identifies automation frameworks like Puppeteer, Playwright, or Selenium operating in headless display mode.',
    severity: 'CRITICAL',
    enabled: false,
    version: 'v1.1.0',
    lastUpdated: '2026-09-28T15:20:00Z',
    updatedBy: 'Vikram Joshi (Fraud Analytics)',
    logic: 'AND',
    actionSignalType: 'NEW_DEVICE',
    conditions: [
      {
        id: 'c-emu-1',
        field: 'tx.is_new_device',
        label: 'Is Unregistered Device',
        operator: '==',
        value: true,
        description: 'Fresh emulator session.'
      },
      {
        id: 'c-emu-2',
        field: 'tx.ip_risk_score',
        label: 'IP Threat Score',
        operator: '>',
        value: 65,
        unit: '/100',
        description: 'Data center hosting IP typical for script execution.'
      }
    ],
    stats: {
      hits24h: 0,
      hits7d: 14,
      falsePositiveRate: 4.2,
      avgLatencyMs: 2.9,
    },
    history: [
      {
        version: 'v1.1.0',
        date: '2026-09-28',
        author: 'Vikram Joshi',
        changes: 'Temporarily disabled for model calibration due to false positives from Brave browser.'
      }
    ],
    exampleEvidence: [
      'navigator.webdriver flag true with missing plugins array and 0x0 screen depth.',
      'HeadlessChrome/124.0.0.0 user-agent detected with spoofed audio context.'
    ]
  },
  {
    id: 'RUL-GEO-010',
    name: 'Cross-Border Location Mismatch with Domestic Payment',
    category: 'GEOLOCATION',
    description: 'Signals domestic UPI/RuPay payment requests dispatched from overseas IP address ranges without travel notification.',
    severity: 'HIGH',
    enabled: true,
    version: 'v2.2.0',
    lastUpdated: '2026-10-07T12:00:00Z',
    updatedBy: 'Rahul Verma (Security Systems)',
    logic: 'AND',
    actionSignalType: 'GEO_MISMATCH',
    conditions: [
      {
        id: 'c-gmm-1',
        field: 'tx.distance_km',
        label: 'Distance from Registered Base',
        operator: '>',
        value: 2000,
        unit: 'km',
        description: 'Significant geographic variance from account home location.'
      },
      {
        id: 'c-gmm-2',
        field: 'tx.amount',
        label: 'Transaction Amount',
        operator: '>',
        value: 10000,
        unit: 'INR',
        description: 'Excludes minor subscription renewals.'
      }
    ],
    stats: {
      hits24h: 38,
      hits7d: 280,
      falsePositiveRate: 2.3,
      avgLatencyMs: 3.1,
    },
    history: [
      {
        version: 'v2.2.0',
        date: '2026-10-07',
        author: 'Rahul Verma',
        changes: 'Added international student corridor whitelist exemption.'
      }
    ],
    exampleEvidence: [
      'Domestic UPI payment of ₹24,000 originating from Romanian IP range 185.191.0.0.',
      'RuPay debit card transaction presented with Russian Federation client geo-header.'
    ]
  }
];

// ---------------------------------------------------------------------------
// 2. Detection Signals Mock Data
// ---------------------------------------------------------------------------
// Helper to construct realistic Detection Signals referencing real mock transactions
const signalTemplates = [
  {
    signalType: 'HIGH_VELOCITY' as const,
    severity: 'HIGH' as const,
    ruleId: 'RUL-VEL-001',
    ruleName: 'Excessive Velocity in Short Window',
    summary: '5 transactions totaling ₹64,200 recorded within 7 minutes from same account reference.',
    metrics: [
      { key: 'velocity_10m', label: '10m Velocity Count', value: '5 txns', baseline: '1 txn' },
      { key: 'window_seconds', label: 'Elapsed Window', value: '420s', baseline: '600s max' },
      { key: 'aggregate_val', label: 'Total Value', value: '₹64,200', baseline: '₹12,000' },
    ],
    evidenceDetails: {
      burstType: 'Burst Sequential Execution',
      targetEndpoints: ['UPI P2P', 'Instant IMPS'],
      rateLimitExceededBy: '250%',
      clientDeviceIds: ['DEV-88412', 'DEV-88412', 'DEV-88412'],
    },
    conditionsPassed: ['tx.velocity_10m > 4 (Value: 5)', 'tx.amount > 1000 (Value: 14500)']
  },
  {
    signalType: 'UNUSUAL_AMOUNT' as const,
    severity: 'CRITICAL' as const,
    ruleId: 'RUL-AMT-002',
    ruleName: 'Extreme Amount Exceeding 30-Day Median',
    summary: 'Transaction amount ₹245,000 is 58.3x higher than historical 30-day median (₹4,200).',
    metrics: [
      { key: 'amount', label: 'Observed Amount', value: '₹245,000', baseline: '₹4,200' },
      { key: 'deviation_factor', label: 'Z-Score Deviation', value: '7.8σ', baseline: '< 2.5σ' },
      { key: 'balance_drain_pct', label: 'Available Balance Ratio', value: '94.2%', baseline: '< 30%' },
    ],
    evidenceDetails: {
      baselineCalculationWindow: '30 rolling days (18 transactions)',
      spendingPattern: 'Sudden high ticket luxury electronics transfer',
      priorMaxAmount: '₹18,500'
    },
    conditionsPassed: ['tx.amount > 50000 (Value: 245000)', 'tx.velocity_1h >= 1 (Value: 2)']
  },
  {
    signalType: 'IMPOSSIBLE_TRAVEL' as const,
    severity: 'CRITICAL' as const,
    ruleId: 'RUL-GEO-003',
    ruleName: 'Impossible Geographic Travel Speed',
    summary: 'Physical displacement of 1,420 km between Mumbai and Delhi recorded in 18 minutes (Effective Speed: 4,733 km/h).',
    metrics: [
      { key: 'distance', label: 'Distance Covered', value: '1,420 km', baseline: 'Local radius' },
      { key: 'elapsed_time', label: 'Time Elapsed', value: '18 mins', baseline: '> 150 mins' },
      { key: 'effective_speed', label: 'Computed Speed', value: '4,733 km/h', baseline: '< 800 km/h' },
    ],
    evidenceDetails: {
      originGeo: { city: 'Mumbai', lat: 19.0760, lon: 72.8777, ip: '103.21.144.12' },
      targetGeo: { city: 'Delhi', lat: 28.6139, lon: 77.2090, ip: '49.36.128.91' },
      carrierCheck: 'Both hops logged over broadband wireline, ruling out cell tower handoff'
    },
    conditionsPassed: ['tx.distance_km > 600 (Value: 1420)', 'tx.hours_since_last_seen < 1 (Value: 0.3)']
  },
  {
    signalType: 'IP_RISK' as const,
    severity: 'HIGH' as const,
    ruleId: 'RUL-NET-004',
    ruleName: 'Tor Exit Node / Bulletproof Hosting IP',
    summary: 'Source IP 185.220.101.5 confirmed as verified Tor Relay / Anonymous Exit Node with IP Risk 96/100.',
    metrics: [
      { key: 'ip_risk_score', label: 'IP Threat Score', value: '96 / 100', baseline: '< 40' },
      { key: 'proxy_type', label: 'Connection Profile', value: 'Tor Exit Node', baseline: 'Residential Broadband' },
      { key: 'fraud_reports_30d', label: 'Abuse Reports', value: '412 reports', baseline: '0' }
    ],
    evidenceDetails: {
      ip: '185.220.101.5',
      reverseDns: 'tor-exit-relay-5.dfri.se',
      asn: 'AS200052 (Tor Project Relay Host)',
      country: 'SE (Sweden)'
    },
    conditionsPassed: ['tx.ip_risk_score >= 80 (Value: 96)']
  },
  {
    signalType: 'NEW_DEVICE' as const,
    severity: 'MEDIUM' as const,
    ruleId: 'RUL-DEV-005',
    ruleName: 'Unrecognized Device with OS Fingerprint Mismatch',
    summary: 'Transaction submitted from new Linux hardware fingerprint DEV-98124 with canvas entropy variance.',
    metrics: [
      { key: 'is_new_device', label: 'Device Known', value: 'Unregistered', baseline: 'Known Device' },
      { key: 'os_mismatch', label: 'Client Signature', value: 'Linux x86_64', baseline: 'iOS 17.5.1' },
      { key: 'confidence_score', label: 'Binding Score', value: '18%', baseline: '> 85%' }
    ],
    evidenceDetails: {
      canvasHash: '0x94f1c93a8910e1b2',
      hardwareConcurrency: 16,
      screenResolution: '1920x1080 (headless ratio)'
    },
    conditionsPassed: ['tx.is_new_device == true (Value: true)', 'tx.amount > 5000 (Value: 12400)']
  },
  {
    signalType: 'MERCHANT_RISK' as const,
    severity: 'HIGH' as const,
    ruleId: 'RUL-MER-006',
    ruleName: 'High-Risk Merchant Category Surge',
    summary: '3 consecutive payments totaling ₹92,000 sent to flagged crypto merchant M-4912 within 24 minutes.',
    metrics: [
      { key: 'merchant_category', label: 'Merchant Profile', value: 'Crypto On-Ramp P2P', baseline: 'Retail Goods' },
      { key: 'batch_count', label: 'Velocity Count', value: '3 txns', baseline: '< 2 txns' },
      { key: 'aggregate_sum', label: 'Cumulative Sum', value: '₹92,000', baseline: '₹15,000' }
    ],
    evidenceDetails: {
      mccCode: '6051 (Non-Financial Institutions - Foreign Currency/Crypto)',
      merchantFraudRate: '4.8% chargeback ratio over last 14 days'
    },
    conditionsPassed: ['tx.amount > 25000 (Value: 35000)', 'tx.velocity_1h >= 2 (Value: 3)']
  },
  {
    signalType: 'GEO_MISMATCH' as const,
    severity: 'HIGH' as const,
    ruleId: 'RUL-GEO-010',
    ruleName: 'Cross-Border Location Mismatch with Domestic Payment',
    summary: 'Domestic RuPay transaction presented from Frankfurt IP range (6,700 km from registered residence in Bengaluru).',
    metrics: [
      { key: 'distance', label: 'Geo Variance', value: '6,720 km', baseline: '< 50 km' },
      { key: 'ip_country', label: 'Origin Country', value: 'Germany (DE)', baseline: 'India (IN)' },
      { key: 'travel_notice', label: 'Travel Flag', value: 'None Reported', baseline: 'Explicit Notification' }
    ],
    evidenceDetails: {
      originAsn: 'AS24940 (Hetzner Online GmbH)',
      latencyMs: '184ms roundtrip (indicative of cross-continental pipe)'
    },
    conditionsPassed: ['tx.distance_km > 2000 (Value: 6720)', 'tx.amount > 10000 (Value: 28900)']
  },
  {
    signalType: 'OFF_HOURS_ACTIVITY' as const,
    severity: 'MEDIUM' as const,
    ruleId: 'RUL-BEH-007',
    ruleName: 'Dormant Account Sudden High-Value Transfer',
    summary: 'Account inactive for 78 days initiated outbound transfer of ₹68,000 at 03:42 AM local time.',
    metrics: [
      { key: 'dormancy_days', label: 'Inactivity Duration', value: '78 days', baseline: '< 14 days' },
      { key: 'time_window', label: 'Local Hour', value: '03:42 AM', baseline: '08:00 - 22:00' },
      { key: 'amount', label: 'Outbound Amount', value: '₹68,000', baseline: '₹0' }
    ],
    evidenceDetails: {
      previousActivityDate: '2026-07-28T18:14:00Z',
      authenticationMethod: 'Password reset via SMS OTP followed immediately by payment'
    },
    conditionsPassed: ['tx.hours_since_last_seen > 1440 (Value: 1872)', 'tx.amount > 40000 (Value: 68000)']
  }
];

export const mockDetectionSignals: DetectionSignal[] = Array.from({ length: 36 }, (_, i) => {
  const template = signalTemplates[i % signalTemplates.length];
  const linkedTxn = mockHistoricalTransactions[i % mockHistoricalTransactions.length] || {
    id: `TXN-${99000 + i}`,
    amount: 32000,
    currency: 'INR',
    merchant: 'Amazon India',
    merchantId: 'M-1042',
    paymentMethod: 'UPI',
    transactionType: 'PAYMENT',
    location: 'Mumbai',
    status: 'ALERT',
    ipAddress: '103.21.144.12',
    deviceId: 'DEV-88412',
    accountReference: 'ACC-19042',
    timestamp: new Date(Date.now() - i * 14 * 60 * 1000).toISOString()
  };

  const signalDate = new Date(Date.now() - (i * 12 + Math.floor(Math.random() * 8)) * 60 * 1000);

  return {
    id: `SIG-${89000 - i}`,
    transactionId: linkedTxn.id,
    signalType: template.signalType,
    severity: template.severity,
    ruleId: template.ruleId,
    ruleName: template.ruleName,
    timestamp: signalDate.toISOString(),
    evidence: {
      summary: template.summary,
      metrics: template.metrics,
      details: template.evidenceDetails,
      triggerConditionsPassed: template.conditionsPassed
    },
    relatedEntity: {
      type: i % 4 === 0 ? 'ACCOUNT' : i % 4 === 1 ? 'DEVICE' : i % 4 === 2 ? 'IP' : 'MERCHANT',
      id: i % 4 === 0 ? linkedTxn.accountReference : i % 4 === 1 ? linkedTxn.deviceId : i % 4 === 2 ? linkedTxn.ipAddress : linkedTxn.merchantId,
      name: i % 4 === 3 ? linkedTxn.merchant : undefined
    },
    transactionSnapshot: {
      id: linkedTxn.id,
      amount: linkedTxn.amount,
      currency: linkedTxn.currency,
      merchant: linkedTxn.merchant,
      merchantId: linkedTxn.merchantId,
      paymentMethod: linkedTxn.paymentMethod,
      transactionType: linkedTxn.transactionType,
      location: linkedTxn.location,
      status: linkedTxn.status,
      ipAddress: linkedTxn.ipAddress,
      deviceId: linkedTxn.deviceId,
      accountReference: linkedTxn.accountReference,
      timestamp: linkedTxn.timestamp
    },
    status: i < 15 ? 'ACTIVE' : i < 28 ? 'CORRELATED' : 'EVALUATED'
  };
});

// ---------------------------------------------------------------------------
// 3. Detection Patterns Mock Data
// ---------------------------------------------------------------------------
export const mockDetectionPatterns: DetectionPattern[] = [
  {
    id: 'PAT-001',
    name: 'Card Testing Micro-Bursts',
    category: 'VELOCITY_AUTOMATION',
    severity: 'HIGH',
    description: 'Distributed automated scripts attempting repeated authorization requests under ₹50 to enumerate valid CVV and expiry parameters.',
    signalsCount: 142,
    associatedRules: ['RUL-VEL-008', 'RUL-VEL-001', 'RUL-DEV-005'],
    heuristicSummary: 'High-frequency low-value charges from dynamic proxy pools with uniform interval timestamps (< 3.2s jitter).',
    detectedClusters: 8,
    lastDetected: '12 minutes ago',
    status: 'ACTIVE'
  },
  {
    id: 'PAT-002',
    name: 'Cross-Border Impossible Travel Cluster',
    category: 'GEOGRAPHIC_ANOMALY',
    severity: 'CRITICAL',
    description: 'Coordinated credential reuse incidents where disparate international IPs access Indian retail banking accounts within minutes.',
    signalsCount: 38,
    associatedRules: ['RUL-GEO-003', 'RUL-GEO-010', 'RUL-NET-004'],
    heuristicSummary: 'Simultaneous sessions logged across Tier-1 Indian ISPs and European VPS hosting ASNs (Hetzner, OVH, DigitalOcean).',
    detectedClusters: 5,
    lastDetected: '24 minutes ago',
    status: 'ACTIVE'
  },
  {
    id: 'PAT-003',
    name: 'Tor Node Aggregation Surge',
    category: 'NETWORK_REPUTATION',
    severity: 'HIGH',
    description: 'Spike in high-anonymity relay nodes targeting P2P UPI payment endpoints to facilitate fast mule transfers.',
    signalsCount: 89,
    associatedRules: ['RUL-NET-004', 'RUL-AMT-002'],
    heuristicSummary: 'Concentration of transactions exceeding ₹30,000 routed through verified Tor Exit consensus IPs.',
    detectedClusters: 12,
    lastDetected: '4 minutes ago',
    status: 'ACTIVE'
  },
  {
    id: 'PAT-004',
    name: 'Dormant Account Credential Stuffing Takeover',
    category: 'ACCOUNT_TAKEOVER',
    severity: 'CRITICAL',
    description: 'Inactive consumer accounts exhibiting sudden credentials changes (password/email) followed swiftly by maximum allowable daily limit transfer.',
    signalsCount: 24,
    associatedRules: ['RUL-BEH-007', 'RUL-AMT-002', 'RUL-DEV-005'],
    heuristicSummary: 'Dormancy > 60 days + newly registered device + balance drain > 85% within 15 minutes of re-authentication.',
    detectedClusters: 4,
    lastDetected: '1 hour ago',
    status: 'MONITORING'
  },
  {
    id: 'PAT-005',
    name: 'Offshore Crypto Aggregator Funneling',
    category: 'MERCHANT_FLOW',
    severity: 'HIGH',
    description: 'Multi-account funneling of rapid deposits into newly onboarded peer-to-peer cryptocurrency escrow merchants.',
    signalsCount: 67,
    associatedRules: ['RUL-MER-006', 'RUL-VEL-001'],
    heuristicSummary: 'Multiple distinct customer accounts routing identical denominations (e.g. ₹25,000, ₹50,000) to single merchant ID.',
    detectedClusters: 6,
    lastDetected: '38 minutes ago',
    status: 'ACTIVE'
  }
];

// ---------------------------------------------------------------------------
// 4. Simulation Presets
// ---------------------------------------------------------------------------
export const mockSimulationPresets: SimulationPreset[] = [
  {
    id: 'pre-impossible-travel',
    name: 'Impossible Travel Flight Simulation',
    description: 'Delhi to London displacement (6,720 km) with only 35 minutes elapsed time.',
    scenario: 'Account logged in Bengaluru, then immediately submits high-value payment via Frankfurt VPS.',
    targetRuleId: 'RUL-GEO-003',
    input: {
      amount: 45000,
      currency: 'INR',
      paymentMethod: 'UPI',
      location: 'Delhi',
      velocity10m: 1,
      velocity1h: 2,
      isNewDevice: true,
      ipRiskScore: 32,
      distanceKm: 6720,
      hoursSinceLastSeen: 0.58, // 35 minutes
      merchantCategory: 'Digital Goods'
    }
  },
  {
    id: 'pre-velocity-burst',
    name: 'High-Frequency Velocity Spike',
    description: '7 transactions in 8 minutes totaling ₹89,000 across multiple retail stores.',
    scenario: 'Compromised card being rapidly tapped or transacted at POS terminals before owner notice.',
    targetRuleId: 'RUL-VEL-001',
    input: {
      amount: 14500,
      currency: 'INR',
      paymentMethod: 'CARD',
      location: 'Mumbai',
      velocity10m: 7,
      velocity1h: 9,
      isNewDevice: false,
      ipRiskScore: 15,
      distanceKm: 8,
      hoursSinceLastSeen: 0.1,
      merchantCategory: 'Retail Electronics'
    }
  },
  {
    id: 'pre-tor-node',
    name: 'Anonymous Tor Proxy Transfer',
    description: '₹55,000 UPI outbound payment originated through verified Tor Exit Relay.',
    scenario: 'Fraudster routing payment through Onion network to conceal physical origin.',
    targetRuleId: 'RUL-NET-004',
    input: {
      amount: 55000,
      currency: 'INR',
      paymentMethod: 'UPI',
      location: 'Unknown (Tor)',
      velocity10m: 2,
      velocity1h: 2,
      isNewDevice: true,
      ipRiskScore: 94,
      distanceKm: 4500,
      hoursSinceLastSeen: 1.2,
      merchantCategory: 'P2P Escrow'
    }
  },
  {
    id: 'pre-amount-spike',
    name: 'Extreme Value Anomaly',
    description: 'Single transfer of ₹380,000 from account with normal median spend of ₹2,500.',
    scenario: 'Unauthorized account liquidation or extortion payment attempt.',
    targetRuleId: 'RUL-AMT-002',
    input: {
      amount: 380000,
      currency: 'INR',
      paymentMethod: 'NETBANKING',
      location: 'Bengaluru',
      velocity10m: 1,
      velocity1h: 1,
      isNewDevice: false,
      ipRiskScore: 22,
      distanceKm: 12,
      hoursSinceLastSeen: 4.5,
      merchantCategory: 'Jewelry & Bullion'
    }
  },
  {
    id: 'pre-benign-retail',
    name: 'Normal Everyday Retail Payment',
    description: 'Routine grocery purchase of ₹680 on trusted home mobile device.',
    scenario: 'Benign baseline transaction that should cleanly pass all rules with zero matches.',
    targetRuleId: 'RUL-VEL-001',
    input: {
      amount: 680,
      currency: 'INR',
      paymentMethod: 'UPI',
      location: 'Pune',
      velocity10m: 1,
      velocity1h: 1,
      isNewDevice: false,
      ipRiskScore: 8,
      distanceKm: 3,
      hoursSinceLastSeen: 18,
      merchantCategory: 'Supermarket'
    }
  }
];

// ---------------------------------------------------------------------------
// 5. Frontend Rule Simulation Evaluator
// ---------------------------------------------------------------------------
export function evaluateRuleSimulation(
  rule: DetectionRule,
  input: RuleSimulationInput
): RuleSimulationResult {
  const startTime = performance.now();
  const conditionResults: ConditionEvaluationResult[] = [];

  for (const condition of rule.conditions) {
    let actualValue: string | number | boolean = 0;

    switch (condition.field) {
      case 'tx.velocity_10m':
        actualValue = input.velocity10m;
        break;
      case 'tx.velocity_1h':
        actualValue = input.velocity1h;
        break;
      case 'tx.amount':
        actualValue = input.amount;
        break;
      case 'tx.distance_km':
        actualValue = input.distanceKm;
        break;
      case 'tx.hours_since_last_seen':
        actualValue = input.hoursSinceLastSeen;
        break;
      case 'tx.ip_risk_score':
        actualValue = input.ipRiskScore;
        break;
      case 'tx.is_new_device':
        actualValue = input.isNewDevice;
        break;
      default:
        actualValue = 0;
    }

    let passed = false;
    const expected = condition.value;

    switch (condition.operator) {
      case '>':
        passed = Number(actualValue) > Number(expected);
        break;
      case '>=':
        passed = Number(actualValue) >= Number(expected);
        break;
      case '<':
        passed = Number(actualValue) < Number(expected);
        break;
      case '<=':
        passed = Number(actualValue) <= Number(expected);
        break;
      case '==':
        passed = String(actualValue).toLowerCase() === String(expected).toLowerCase();
        break;
      case '!=':
        passed = String(actualValue).toLowerCase() !== String(expected).toLowerCase();
        break;
      default:
        passed = false;
    }

    const explanation = passed
      ? `Condition PASSED: Actual ${actualValue}${condition.unit ? ' ' + condition.unit : ''} ${condition.operator} Expected ${expected}${condition.unit ? ' ' + condition.unit : ''}`
      : `Condition FAILED: Actual ${actualValue}${condition.unit ? ' ' + condition.unit : ''} does not satisfy ${condition.operator} ${expected}${condition.unit ? ' ' + condition.unit : ''}`;

    conditionResults.push({
      conditionId: condition.id,
      field: condition.field,
      label: condition.label,
      operator: condition.operator,
      expectedValue: condition.value,
      actualValue,
      passed,
      explanation
    });
  }

  // Determine overall match based on rule logic (default: AND)
  const matched = rule.logic === 'OR'
    ? conditionResults.some(c => c.passed)
    : conditionResults.every(c => c.passed);

  const duration = Math.round((performance.now() - startTime) * 10) / 10;

  // Generate simulated signal if matched
  let simulatedSignal: DetectionSignal | undefined = undefined;
  if (matched) {
    simulatedSignal = {
      id: `SIM-SIG-${Math.floor(10000 + Math.random() * 90000)}`,
      transactionId: `SIM-TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      signalType: rule.actionSignalType,
      severity: rule.severity,
      ruleId: rule.id,
      ruleName: rule.name,
      timestamp: new Date().toISOString(),
      evidence: {
        summary: `Simulated trigger of rule ${rule.id} [${rule.name}] against test vector attributes.`,
        metrics: conditionResults.map(cr => ({
          key: cr.field,
          label: cr.label,
          value: `${cr.actualValue}`,
          baseline: `${cr.expectedValue}`
        })),
        details: {
          simulationVector: input,
          evaluatedRuleVersion: rule.version,
          executionMode: 'Client-side In-Memory Mock Engine'
        },
        triggerConditionsPassed: conditionResults.filter(c => c.passed).map(c => c.explanation)
      },
      relatedEntity: {
        type: 'ACCOUNT',
        id: 'ACC-SIMULATED-VECTOR',
        name: 'Simulated Target Entity'
      },
      transactionSnapshot: {
        id: `SIM-TXN-TEMP`,
        amount: input.amount,
        currency: input.currency,
        merchant: input.merchantCategory,
        merchantId: 'M-SIM-TEST',
        paymentMethod: input.paymentMethod,
        transactionType: 'PAYMENT',
        location: input.location,
        status: 'ALERT',
        ipAddress: '198.51.100.42 (Simulated)',
        deviceId: input.isNewDevice ? 'DEV-NEW-SIMULATED' : 'DEV-KNOWN-SIMULATED',
        accountReference: 'ACC-SIMULATED-VECTOR',
        timestamp: new Date().toISOString()
      },
      status: 'ACTIVE'
    };
  }

  return {
    ruleId: rule.id,
    ruleName: rule.name,
    matched,
    evaluatedAt: new Date().toISOString(),
    executionDurationMs: duration,
    conditionResults,
    simulatedSignal
  };
}
