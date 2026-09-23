export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TransactionStatus = 'CLEAR' | 'ALERT' | 'REVIEW' | 'BLOCKED';
export type PaymentMethod = 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'BANK_TRANSFER';
export type TransactionType = 'PAYMENT' | 'TRANSFER' | 'WITHDRAWAL' | 'REFUND';

export interface Transaction {
  id: string;
  timestamp: string; // ISO format or formatted string
  merchant: string;
  merchantId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  transactionType: TransactionType;
  location: string;
  riskScore: number;
  maliScore: number;
  riskLevel: RiskLevel;
  status: TransactionStatus;
  detectionRules: string[];
  deviceId: string;
  ipAddress: string;
  accountReference: string;
}
