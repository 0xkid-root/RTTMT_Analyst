import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  trend?: number;
  isNegativeGood?: boolean;
}

function SummaryCard({ title, value, trend, isNegativeGood = false }: SummaryCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
      <div className="text-sm font-medium text-muted-foreground mb-2">{title}</div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold font-mono text-foreground">{value}</div>
        {trend !== undefined && (
          <div className={`flex items-center text-xs font-medium ${
            trend === 0 ? 'text-muted-foreground' :
            (trend > 0 ? (isNegativeGood ? 'text-red-500' : 'text-green-500') : (isNegativeGood ? 'text-green-500' : 'text-red-500'))
          }`}>
            {trend > 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : trend < 0 ? <ArrowDownRight className="w-3 h-3 mr-0.5" /> : <Minus className="w-3 h-3 mr-0.5" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}

interface LiveTransactionsSummaryProps {
  stats: {
    transactionsPerMin: number;
    highRisk: number;
    critical: number;
    alerts: number;
    blocked: number;
  };
}

export function LiveTransactionsSummary({ stats }: LiveTransactionsSummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <SummaryCard title="Transactions / min" value={stats.transactionsPerMin.toLocaleString()} trend={4.2} />
      <SummaryCard title="High Risk" value={stats.highRisk.toLocaleString()} trend={1.5} isNegativeGood />
      <SummaryCard title="Critical" value={stats.critical.toLocaleString()} trend={-2.1} isNegativeGood />
      <SummaryCard title="Alerts" value={stats.alerts.toLocaleString()} trend={5.4} isNegativeGood />
      <SummaryCard title="Blocked" value={stats.blocked.toLocaleString()} trend={0} />
    </div>
  );
}
