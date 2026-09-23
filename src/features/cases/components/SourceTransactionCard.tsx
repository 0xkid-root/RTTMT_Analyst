import { Transaction } from '@/features/monitor/types/transaction';
import { RiskBadge } from '@/features/monitor/components/shared/RiskBadge';
import { CreditCard, MapPin, Store, Calendar, Fingerprint } from 'lucide-react';

interface SourceTransactionCardProps {
  transaction: Transaction;
}

export function SourceTransactionCard({ transaction }: SourceTransactionCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
          Source Transaction
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Details */}
        <div className="space-y-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Transaction ID</div>
            <div className="font-mono text-sm">{transaction.id}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Date & Time
            </div>
            <div className="text-sm">
              {new Date(transaction.timestamp).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              })}
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="space-y-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Store className="w-3 h-3" /> Merchant
            </div>
            <div className="text-sm font-medium">{transaction.merchant}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Amount & Method</div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-foreground">
                ₹{transaction.amount.toLocaleString('en-IN')}
              </span>
              <span className="text-muted-foreground flex items-center gap-1 text-sm">
                <CreditCard className="w-3 h-3" /> {transaction.paymentMethod}
              </span>
            </div>
          </div>
        </div>

        {/* Risk Details */}
        <div className="space-y-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Fingerprint className="w-3 h-3" /> Risk Profile
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Risk</span>
                <span className={`font-mono font-semibold ${
                  transaction.riskScore >= 85 ? 'text-red-500' :
                  transaction.riskScore >= 65 ? 'text-orange-500' :
                  transaction.riskScore >= 40 ? 'text-yellow-500' : 'text-green-500'
                }`}>{transaction.riskScore}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">MALi</span>
                <span className={`font-mono font-semibold ${
                  transaction.maliScore >= 80 ? 'text-red-500' :
                  transaction.maliScore >= 60 ? 'text-orange-500' : 'text-green-500'
                }`}>{transaction.maliScore}</span>
              </div>
              <RiskBadge level={transaction.riskLevel} />
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location
            </div>
            <div className="text-sm">{transaction.location}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
