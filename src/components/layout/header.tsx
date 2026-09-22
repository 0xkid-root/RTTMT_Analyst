import { Search, Bell, UserCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 max-w-xl flex items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Global search (Transactions, Merchants, Alerts...)"
            className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger"></span>
        </button>
        <div className="h-6 w-px bg-border mx-2"></div>
        <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <UserCircle className="h-6 w-6" />
          <span>Analyst</span>
        </button>
      </div>
    </header>
  );
}
