import type { RiskDistributionSummary } from '../types/command-center-types';

interface RiskDistributionProps {
  data: RiskDistributionSummary;
}

export function RiskDistribution({ data }: RiskDistributionProps) {
  return (
    <div className="bg-background border border-border rounded-xl shadow-sm p-4 h-full flex flex-col">
      <h3 className="font-semibold text-foreground mb-4">Risk Distribution</h3>
      
      <div className="flex-1 flex flex-col justify-center space-y-4">
        
        {/* Progress Bar */}
        <div className="flex h-3 w-full rounded-full overflow-hidden bg-muted">
          <div style={{ width: `${data.low}%` }} className="bg-muted-foreground/30 h-full transition-all" />
          <div style={{ width: `${data.medium}%` }} className="bg-warning h-full transition-all" />
          <div style={{ width: `${data.high}%` }} className="bg-danger/70 h-full transition-all" />
          <div style={{ width: `${data.critical}%` }} className="bg-danger h-full transition-all" />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
              <span className="text-muted-foreground">Low</span>
            </div>
            <span className="font-medium">{data.low}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-warning" />
              <span className="text-muted-foreground">Medium</span>
            </div>
            <span className="font-medium">{data.medium}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-danger/70" />
              <span className="text-muted-foreground">High</span>
            </div>
            <span className="font-medium">{data.high}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
              <span className="text-muted-foreground">Critical</span>
            </div>
            <span className="font-medium">{data.critical}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
