import { AlertTriangle } from 'lucide-react';

interface DetectionSignalsProps {
  signals: string[];
}

export function DetectionSignals({ signals }: DetectionSignalsProps) {
  if (!signals || signals.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
          Detection Signals
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {signals.map((signal, idx) => (
          <div key={idx} className="bg-muted/30 border border-border rounded-lg p-3 flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <span className="font-medium text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                {signal}
              </span>
              <span className="text-[10px] font-mono bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded">
                HIGH
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Rule triggered by anomaly detection engine during transaction analysis.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
