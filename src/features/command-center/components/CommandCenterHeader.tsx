import { RefreshCw, Clock, Database } from 'lucide-react';

export function CommandCenterHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Command Center</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time risk and threat monitoring across the RTMT environment.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-md text-sm shadow-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <select className="bg-transparent outline-none cursor-pointer font-medium text-foreground">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-md text-sm shadow-sm font-medium">
          <Database className="h-4 w-4 text-primary" />
          Production
        </div>

        <button className="flex items-center justify-center bg-background border border-border h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
