import { Button } from '@/components/ui/button';
import { Pause, Play, RefreshCw, Activity } from 'lucide-react';

interface LiveTransactionsHeaderProps {
  isPaused: boolean;
  onTogglePause: () => void;
  onRefresh: () => void;
  transactionsPerMinute: number;
}

export function LiveTransactionsHeader({ isPaused, onTogglePause, onRefresh, transactionsPerMinute }: LiveTransactionsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1 text-foreground flex items-center gap-2">
          Live Transactions
          {!isPaused && (
            <span className="relative flex h-3 w-3 ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </h1>
        <p className="text-muted-foreground text-sm">
          Real-time transaction monitoring and risk detection
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-md shadow-sm">
          <Activity className={`w-4 h-4 ${isPaused ? 'text-muted-foreground' : 'text-red-500'}`} />
          <span className="text-sm font-medium">
            {isPaused ? 'STREAM PAUSED' : 'LIVE'}
          </span>
          <span className="text-muted-foreground text-xs ml-2 border-l border-border pl-2">
            {transactionsPerMinute.toLocaleString()} txn/min
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onTogglePause}
            className={isPaused ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" : ""}
          >
            {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
            {isPaused ? 'Resume Live' : 'Pause Stream'}
          </Button>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
