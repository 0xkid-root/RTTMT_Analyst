import { Transaction, RiskLevel, TransactionStatus, PaymentMethod, TransactionType } from '../types/transaction';

const CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 
  'Surat', 'Indore', 'Noida', 'Gurugram'
];

const MERCHANTS = [
  'Amazon India', 'Flipkart', 'Zomato', 'Swiggy', 'Uber', 
  'Ola', 'Myntra', 'Nykaa', 'Reliance Digital', 'Croma', 
  'MakeMyTrip', 'IRCTC', 'BookMyShow', 'Blinkit', 'Zepto'
];

const PAYMENT_METHODS: PaymentMethod[] = ['UPI', 'CARD', 'NETBANKING', 'WALLET', 'BANK_TRANSFER'];
const TRANSACTION_TYPES: TransactionType[] = ['PAYMENT', 'TRANSFER', 'WITHDRAWAL', 'REFUND'];

const RULES = [
  'Velocity Anomaly', 'Device Mismatch', 'Geographic Anomaly', 
  'High Value Transfer', 'New Device Login', 'IP Blacklist Match', 
  'Suspicious Merchant', 'Off-hours Transaction'
];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(arr: T[]): T {
  return arr[getRandomInt(0, arr.length - 1)];
}

function generateTransaction(idSuffix: number, offsetMinutes = 0): Transaction {
  const isHighRisk = Math.random() > 0.85;
  const isCritical = isHighRisk && Math.random() > 0.7;
  
  const riskScore = isCritical ? getRandomInt(85, 100) : isHighRisk ? getRandomInt(65, 84) : getRandomInt(5, 64);
  const maliScore = isCritical ? getRandomInt(80, 100) : isHighRisk ? getRandomInt(60, 79) : getRandomInt(0, 59);
  
  let riskLevel: RiskLevel = 'LOW';
  let status: TransactionStatus = 'CLEAR';
  
  if (riskScore >= 85) {
    riskLevel = 'CRITICAL';
    status = Math.random() > 0.5 ? 'BLOCKED' : 'ALERT';
  } else if (riskScore >= 65) {
    riskLevel = 'HIGH';
    status = Math.random() > 0.4 ? 'ALERT' : 'REVIEW';
  } else if (riskScore >= 40) {
    riskLevel = 'MEDIUM';
    status = Math.random() > 0.7 ? 'REVIEW' : 'CLEAR';
  }

  const detectionRules = [];
  if (riskLevel !== 'LOW') {
    const numRules = riskLevel === 'CRITICAL' ? getRandomInt(2, 4) : riskLevel === 'HIGH' ? getRandomInt(1, 2) : 1;
    for (let i = 0; i < numRules; i++) {
      const rule = getRandomItem(RULES);
      if (!detectionRules.includes(rule)) detectionRules.push(rule);
    }
  }

  const date = new Date();
  date.setMinutes(date.getMinutes() - offsetMinutes);
  
  return {
    id: `TXN-${98000 + idSuffix}`,
    timestamp: date.toISOString(),
    merchant: getRandomItem(MERCHANTS),
    merchantId: `M-${getRandomInt(1000, 9999)}`,
    amount: riskLevel === 'CRITICAL' ? getRandomInt(50000, 500000) : getRandomInt(100, 20000),
    currency: 'INR',
    paymentMethod: getRandomItem(PAYMENT_METHODS),
    transactionType: getRandomItem(TRANSACTION_TYPES),
    location: getRandomItem(CITIES),
    riskScore,
    maliScore,
    riskLevel,
    status,
    detectionRules,
    deviceId: `DEV-${getRandomInt(10000, 99999)}`,
    ipAddress: `${getRandomInt(1, 255)}.${getRandomInt(1, 255)}.${getRandomInt(1, 255)}.${getRandomInt(1, 255)}`,
    accountReference: `ACC-${getRandomInt(10000, 99999)}`
  };
}

// Generate 150 transactions for explorer, first few are most recent
export const mockHistoricalTransactions: Transaction[] = Array.from({ length: 150 }, (_, i) => 
  generateTransaction(i, i * getRandomInt(1, 15))
).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export const generateNewLiveTransaction = (idSuffix: number): Transaction => {
  return generateTransaction(2000 + idSuffix, 0); // 0 offset, representing "now"
};
