import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import type { PriorityActivity as PriorityActivityType } from '../types/command-center-types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PriorityActivityProps {
  data: PriorityActivityType[];
}

export function PriorityActivity({ data }: PriorityActivityProps) {
  return (
    <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-border bg-muted/10">
        <h3 className="font-semibold text-foreground">Priority Activity</h3>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No priority activity
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="p-3 rounded-lg border border-border/60 bg-muted/10 flex flex-col gap-2 relative">
              
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider",
                      item.riskLevel === 'CRITICAL' ? "bg-danger/10 text-danger" :
                      item.riskLevel === 'HIGH' ? "bg-danger/10 text-danger" :
                      item.riskLevel === 'MEDIUM' ? "bg-warning/10 text-warning" :
                      "bg-muted text-muted-foreground"
                    )}
                  >
                    {item.riskLevel}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">{item.timestamp}</span>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-foreground">{item.type}</p>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.merchant}</span>
                  <span className="font-medium text-foreground/70">{item.location}</span>
                </div>
              </div>
              
            </div>
          ))
        )}
      </div>
    </div>
  );
}
