import { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RiskKpiCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
}

export function RiskKpiCard({ title, value, subtext, trend, icon }: RiskKpiCardProps) {
  return (
    <div className="bg-background border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-muted-foreground/60">{icon}</div>}
      </div>
      
      <div>
        <div className="text-2xl font-bold text-foreground tracking-tight">{value}</div>
        
        {subtext && (
          <div className="mt-1 flex items-center text-xs font-medium">
            <span
              className={cn(
                "mr-1",
                trend === 'up' ? "text-danger" : trend === 'down' ? "text-success" : "text-muted-foreground"
              )}
            >
              {subtext}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
