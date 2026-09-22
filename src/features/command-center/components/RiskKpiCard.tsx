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
  trend?: 'up' | 'down' | 'neutral' | 'good';
  icon?: ReactNode;
}

export function RiskKpiCard({ title, value, subtext, trend, icon }: RiskKpiCardProps) {
  return (
    <div className="bg-background border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-2">
        {icon && (
          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted">
            {icon}
          </div>
        )}
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      
      <div>
        <div className="text-2xl font-bold text-foreground tracking-tight">{value}</div>
        
        {subtext && (
          <div className="mt-2 flex items-center text-xs font-medium">
            <span
              className={cn(
                "mr-1",
                trend === 'up' ? "text-danger" : 
                trend === 'down' ? "text-success" : 
                trend === 'good' ? "text-success" :
                "text-muted-foreground"
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
