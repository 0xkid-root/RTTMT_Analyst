import { ArrowUpRight, CheckCircle2, AlertCircle, Ban, Search } from 'lucide-react';
import type { TransactionActivitySummary } from '../types/command-center-types';

interface TransactionActivityProps {
  data: TransactionActivitySummary;
}

export function TransactionActivity({ data }: TransactionActivityProps) {
  const total = data.successful + data.underReview + data.declined + data.riskFlagged;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="bg-background border border-border rounded-xl shadow-sm p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Transaction Activity</h3>
        <span className="text-xs text-muted-foreground flex items-center">
          <ArrowUpRight className="h-3 w-3 mr-1" />
          Vol {formatNumber(total)}
        </span>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-3">
        <div className="p-3 border border-border/60 rounded-lg bg-muted/10">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="text-xs text-muted-foreground font-medium">Successful</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(data.successful)}</div>
        </div>

        <div className="p-3 border border-border/60 rounded-lg bg-muted/10">
          <div className="flex items-center gap-2 mb-1">
            <Search className="h-4 w-4 text-info" />
            <span className="text-xs text-muted-foreground font-medium">Under Review</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(data.underReview)}</div>
        </div>

        <div className="p-3 border border-border/60 rounded-lg bg-muted/10">
          <div className="flex items-center gap-2 mb-1">
            <Ban className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Declined</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(data.declined)}</div>
        </div>

        <div className="p-3 border border-border/60 rounded-lg bg-muted/10">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-danger" />
            <span className="text-xs text-muted-foreground font-medium">Risk Flagged</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(data.riskFlagged)}</div>
        </div>
      </div>
    </div>
  );
}
