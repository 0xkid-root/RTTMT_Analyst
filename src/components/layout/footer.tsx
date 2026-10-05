import { ShieldCheck, Activity, TerminalSquare } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50 bg-background pt-4 pb-4 px-6 text-sm shrink-0">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground">
        
        {/* Left Side: System Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success border border-success/20">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-medium text-xs">All Systems Operational</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/30 border border-border/50">
            <Activity className="w-4 h-4 text-primary" />
            <span className="font-medium text-xs">AI Engine V-3.4 Active</span>
          </div>
        </div>

        {/* Middle: Copyright */}
        <div className="text-xs">
          &copy; {new Date().getFullYear()} RTMT Intelligence Platform. All rights reserved.
        </div>

        {/* Right Side: Links & Terminal */}
        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-xs font-medium">
            <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
            <a href="#" className="hover:text-foreground transition-colors">Support API</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-black/40 border border-border/30 text-[10px] font-mono shadow-inner">
            <TerminalSquare className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-success">&gt; ping: 12ms</span>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
