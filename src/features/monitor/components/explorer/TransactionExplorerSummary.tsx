interface TransactionExplorerSummaryProps {
  totalCount: number;
  totalAmount: number;
  highRiskCount: number;
  criticalCount: number;
}

export function TransactionExplorerSummary({ totalCount, totalAmount, highRiskCount, criticalCount }: TransactionExplorerSummaryProps) {
  return (
    <div className="flex flex-wrap gap-6 mb-4 px-1 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Found:</span>
        <span className="font-semibold">{totalCount.toLocaleString()} transactions</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Total Amount:</span>
        <span className="font-semibold font-mono">₹{(totalAmount / 10000000).toFixed(2)} Cr</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">High Risk:</span>
        <span className="font-semibold text-orange-500">{highRiskCount.toLocaleString()}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Critical:</span>
        <span className="font-semibold text-red-500">{criticalCount.toLocaleString()}</span>
      </div>
    </div>
  );
}
