import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { RecentCase } from '../types/command-center-types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RecentCasesTableProps {
  data: RecentCase[];
}

export function RecentCasesTable({ data }: RecentCasesTableProps) {
  return (
    <div className="bg-background border border-border rounded-xl shadow-sm h-full flex flex-col min-h-[250px]">
      <div className="p-4 border-b border-border bg-muted/10 flex justify-between items-center">
        <h3 className="font-semibold text-foreground">Recent Cases</h3>
        <button className="text-xs text-primary hover:underline font-medium">View all →</button>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground bg-background border-b border-border">
            <tr>
              <th className="px-4 py-3 font-medium">Case ID</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Merchant</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{item.id}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider whitespace-nowrap",
                    item.priority === 'CRITICAL' ? "bg-danger/20 text-danger" :
                    item.priority === 'HIGH' ? "bg-danger/20 text-danger" :
                    item.priority === 'MEDIUM' ? "bg-warning/20 text-warning" :
                    "bg-success/20 text-success"
                  )}>
                    {item.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground truncate max-w-[120px]">{item.merchant}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap border",
                    item.status === 'Investigating' ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                    item.status === 'Assigned' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                    item.status === 'Pending Review' ? "bg-warning/10 text-warning border-warning/20" :
                    item.status === 'Open' ? "bg-success/10 text-success border-success/20" :
                    "bg-muted text-muted-foreground border-border"
                  )}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
