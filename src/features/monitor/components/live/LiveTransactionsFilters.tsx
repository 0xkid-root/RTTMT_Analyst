import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LiveTransactionsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  autoScroll: boolean;
  onToggleAutoScroll: () => void;
}

export function LiveTransactionsFilters({
  searchTerm,
  onSearchChange,
  autoScroll,
  onToggleAutoScroll
}: LiveTransactionsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border p-3 rounded-xl mb-4">
      <div className="flex-1 flex items-center gap-4 w-full">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search transaction ID / merchant / account"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <div className="hidden lg:flex items-center gap-2">
          <select className="bg-background border border-border rounded-md px-3 py-1.5 text-sm">
            <option value="">Risk Level: All</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          
          <select className="bg-background border border-border rounded-md px-3 py-1.5 text-sm">
            <option value="">Status: All</option>
            <option value="CLEAR">Clear</option>
            <option value="REVIEW">Review</option>
            <option value="ALERT">Alert</option>
            <option value="BLOCKED">Blocked</option>
          </select>

          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground cursor-pointer" htmlFor="auto-scroll">
            Auto-scroll
          </label>
          <button 
            id="auto-scroll"
            onClick={onToggleAutoScroll}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${autoScroll ? 'bg-primary' : 'bg-muted'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${autoScroll ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
