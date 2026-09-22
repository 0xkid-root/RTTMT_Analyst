import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { RecentAlert } from '../types/command-center-types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RecentAlertsTableProps {
  data: RecentAlert[];
}

export function RecentAlertsTable({ data }: RecentAlertsTableProps) {
  return (
    <div className="bg-background border border-border rounded-xl shadow-sm h-full flex flex-col min-h-[250px]">
      <div className="p-4 border-b border-border bg-muted/10 flex justify-between items-center">
        <h3 className="font-semibold text-foreground">Recent Alerts</h3>
        <button className="text-xs text-primary hover:underline font-medium">View all →</button>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground bg-background border-b border-border">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Risk</th>
              <th className="px-4 py-3 font-medium">Merchant</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {data.map((alert) => (
              <tr key={alert.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{alert.id}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider whitespace-nowrap",
                    alert.riskLevel === 'CRITICAL' ? "bg-danger/20 text-danger" :
                    alert.riskLevel === 'HIGH' ? "bg-warning/20 text-warning" :
                    alert.riskLevel === 'MEDIUM' ? "bg-warning/20 text-warning" :
                    "bg-success/20 text-success"
                  )}>
                    {alert.riskLevel}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground truncate max-w-[120px]">{alert.merchant}</td>
                <td className="px-4 py-3 font-medium">₹ {alert.amount.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{alert.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
