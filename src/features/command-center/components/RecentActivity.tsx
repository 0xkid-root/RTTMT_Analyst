import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { RecentEvent } from '../types/command-center-types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RecentActivityProps {
  data: RecentEvent[];
}

export function RecentActivity({ data }: RecentActivityProps) {
  return (
    <div className="bg-background border border-border rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/10">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No recent activity
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((event, index) => (
              <div key={event.id} className="relative flex gap-4">
                
                {/* Timeline line */}
                {index !== data.length - 1 && (
                  <div className="absolute left-[19px] top-6 bottom-[-16px] w-[2px] bg-border/50" />
                )}
                
                <div className="flex flex-col items-center gap-1">
                  <div className="text-[10px] font-medium text-muted-foreground mt-0.5">{event.time}</div>
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      event.status === 'error' ? 'bg-danger' :
                      event.status === 'warning' ? 'bg-warning' :
                      event.status === 'success' ? 'bg-success' :
                      'bg-info'
                    )}
                  />
                </div>
                
                <div className="flex-1 pb-1">
                  <div className="text-xs font-semibold text-foreground/70 mb-0.5">{event.type}</div>
                  <div className="text-sm text-foreground">{event.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
