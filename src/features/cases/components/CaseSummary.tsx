import { CaseType, CasePriority } from '../types/case';
import { Transaction } from '@/features/monitor/types/transaction';
import { Hash, AlertCircle, Fingerprint, Activity, User } from 'lucide-react';

interface CaseSummaryProps {
  type: CaseType;
  priority: CasePriority;
  transaction: Transaction | null;
  assignedTo: string;
}

export function CaseSummary({ type, priority, transaction, assignedTo }: CaseSummaryProps) {
  if (!transaction) return null;

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm sticky top-24 overflow-hidden">
      <div className="bg-muted/50 p-4 border-b border-border">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          Case Summary
        </h3>
      </div>
      
      <div className="p-5 space-y-5">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Type</span>
          <span className="font-medium text-sm">{type}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Priority</span>
          <span className={`font-medium text-sm ${
            priority === 'Critical' ? 'text-red-500' :
            priority === 'High' ? 'text-orange-500' :
            priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'
          }`}>{priority}</span>
        </div>

        <hr className="border-border" />

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Source</span>
          <div className="flex items-center gap-2 text-sm">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono">{transaction.id}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Risk Profile</span>
          <div className="flex items-center gap-4 text-sm mt-1">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
              <span className={`font-mono font-medium ${
                transaction.riskScore >= 85 ? 'text-red-500' :
                transaction.riskScore >= 65 ? 'text-orange-500' : 'text-green-500'
              }`}>{transaction.riskScore}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4 text-muted-foreground" />
              <span className={`font-mono font-medium ${
                transaction.maliScore >= 80 ? 'text-red-500' :
                transaction.maliScore >= 60 ? 'text-orange-500' : 'text-green-500'
              }`}>{transaction.maliScore}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Signals</span>
          <div className="flex items-center gap-2 text-sm mt-1">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{transaction.detectionRules.length} rules triggered</span>
          </div>
        </div>

        <hr className="border-border" />

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Assigned To</span>
          <div className="flex items-center gap-2 text-sm mt-1">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{assignedTo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
