import { Alert, AlertSeverity, AlertStatus, SlaStatus } from '../types/alert';

function getPastTime(minutesAgo: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutesAgo);
  return d.toISOString();
}

function getFutureTime(minutesAhead: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutesAhead);
  return d.toISOString();
}

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-2026-008421',
    title: 'UPI Transaction Anomaly',
    description: 'Transaction amount exceeds standard deviation for this merchant by 400% in a short velocity window.',
    severity: 'CRITICAL',
    status: 'NEW',
    transactionId: 'TXN-100483',
    merchantId: 'MID-8812',
    merchantName: 'ABC Payments',
    amount: 145000,
    currency: 'INR',
    paymentMethod: 'UPI',
    riskScore: 92,
    ruleId: 'RULE-VEL-01',
    ruleName: 'Velocity Spike > 300%',
    slaTargetTime: getFutureTime(8),
    slaStatus: 'ON_TRACK',
    createdAt: getPastTime(7),
    escalated: false,
  },
  {
    id: 'ALT-2026-008422',
    title: 'Multiple Failed Logins before Payment',
    description: 'User attempted to login 6 times before a high-value card transaction.',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    transactionId: 'TXN-100490',
    merchantId: 'MID-4211',
    merchantName: 'Global Retailers',
    amount: 1250,
    currency: 'USD',
    paymentMethod: 'Credit Card',
    riskScore: 85,
    ruleId: 'RULE-BEH-04',
    ruleName: 'Failed Login Followed by Payment',
    assignedTo: 'Analyst A',
    assignedAt: getPastTime(25),
    slaTargetTime: getPastTime(12),
    slaStatus: 'BREACHED',
    slaBreachedByMinutes: 12,
    createdAt: getPastTime(42),
    escalated: false,
  },
  {
    id: 'ALT-2026-008423',
    title: 'Known Fraud IP Subnet',
    description: 'Transaction originated from an ASN associated with a recent botnet attack.',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    transactionId: 'TXN-100511',
    merchantId: 'MID-9012',
    merchantName: 'Crypto Exchange Ltd',
    amount: 5000,
    currency: 'EUR',
    paymentMethod: 'Bank Transfer',
    riskScore: 98,
    ruleId: 'RULE-NET-02',
    ruleName: 'Fraud IP Match',
    assignedTo: 'Senior Analyst B',
    assignedAt: getPastTime(120),
    slaTargetTime: getPastTime(45),
    slaStatus: 'BREACHED',
    slaBreachedByMinutes: 45,
    createdAt: getPastTime(135),
    escalated: true,
    escalatedTo: 'Lead Investigator',
    escalationReason: 'Requires IP blacklisting review across merchant portfolio',
    escalatedAt: getPastTime(20),
  },
  {
    id: 'ALT-2026-008424',
    title: 'Impossible Travel Indicator',
    description: 'User initiated payment from Mumbai and 10 minutes later from London.',
    severity: 'MEDIUM',
    status: 'NEW',
    transactionId: 'TXN-100522',
    merchantId: 'MID-1102',
    merchantName: 'Travel Booking Co',
    amount: 320,
    currency: 'USD',
    paymentMethod: 'Wallet',
    riskScore: 65,
    ruleId: 'RULE-GEO-01',
    ruleName: 'Impossible Travel',
    slaTargetTime: getFutureTime(2),
    slaStatus: 'AT_RISK',
    createdAt: getPastTime(28),
    escalated: false,
  },
  {
    id: 'ALT-2026-008425',
    title: 'New Device Registration Risk',
    description: 'High-value transaction immediately after a new device was registered to the account.',
    severity: 'HIGH',
    status: 'ACKNOWLEDGED',
    transactionId: 'TXN-100600',
    merchantId: 'MID-7731',
    merchantName: 'Premium Electronics',
    amount: 2100,
    currency: 'USD',
    paymentMethod: 'Credit Card',
    riskScore: 78,
    ruleId: 'RULE-DEV-03',
    ruleName: 'New Device + High Value',
    assignedTo: 'Analyst A',
    assignedAt: getPastTime(5),
    slaTargetTime: getFutureTime(40),
    slaStatus: 'ON_TRACK',
    createdAt: getPastTime(20),
    escalated: false,
  }
];

// Generate more to test pagination (about 45 more items)
for (let i = 6; i <= 50; i++) {
  const isEscalated = i % 8 === 0;
  const isBreached = i % 5 === 0;
  const severityValue = i % 4;
  const severity: AlertSeverity = severityValue === 0 ? 'CRITICAL' : severityValue === 1 ? 'HIGH' : severityValue === 2 ? 'MEDIUM' : 'LOW';
  
  mockAlerts.push({
    id: `ALT-2026-0084${20 + i}`,
    title: `Suspicious Pattern ${i}`,
    description: 'System generated alert based on combined risk signals.',
    severity,
    status: isEscalated ? 'IN_PROGRESS' : i % 3 === 0 ? 'NEW' : 'RESOLVED',
    transactionId: `TXN-100${400 + i}`,
    merchantId: `MID-${1000 + i}`,
    merchantName: `Merchant ${i}`,
    amount: 100 * i,
    currency: 'USD',
    paymentMethod: 'Card',
    riskScore: 50 + (i % 40),
    ruleId: `RULE-GEN-${i % 5}`,
    ruleName: `General Risk Rule ${i % 5}`,
    assignedTo: i % 2 === 0 ? 'Analyst A' : undefined,
    assignedAt: i % 2 === 0 ? getPastTime(i * 10) : undefined,
    slaTargetTime: isBreached ? getPastTime(i * 5) : getFutureTime(i * 10),
    slaStatus: isBreached ? 'BREACHED' : 'ON_TRACK',
    slaBreachedByMinutes: isBreached ? (i * 5) : undefined,
    createdAt: getPastTime(i * 15),
    escalated: isEscalated,
    escalatedTo: isEscalated ? 'Tier 2 Support' : undefined,
    escalationReason: isEscalated ? 'Complex fraud ring investigation' : undefined,
    escalatedAt: isEscalated ? getPastTime(i * 2) : undefined,
  });
}
