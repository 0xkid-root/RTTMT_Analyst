import { Search, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';

interface LiveTransactionsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  autoScroll: boolean;
  onToggleAutoScroll: () => void;
}

function CustomSelect({ options, value, onChange, placeholder }: { options: {value: string, label: string}[], value: string, onChange: (v: string) => void, placeholder: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

  return (
    <div className="relative" ref={ref}>
      <button 
        type="button"
        className="flex items-center justify-between gap-2 bg-background border border-border hover:bg-muted/50 transition-colors rounded-md px-3 py-1.5 text-sm min-w-[140px]"
        onClick={() => setOpen(!open)}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0" />
      </button>
      {open && (
        <div className="absolute top-full mt-1.5 w-full bg-card border border-border rounded-md shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-muted/80 ${value === opt.value ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground'}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function LiveTransactionsFilters({
  searchTerm,
  onSearchChange,
  autoScroll,
  onToggleAutoScroll
}: LiveTransactionsFiltersProps) {
  // Mock state for filters since they weren't wired up in the original
  const [riskFilter, setRiskFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const riskOptions = [
    { value: "", label: "Risk Level: All" },
    { value: "CRITICAL", label: "Critical" },
    { value: "HIGH", label: "High" },
    { value: "MEDIUM", label: "Medium" },
    { value: "LOW", label: "Low" }
  ];

  const statusOptions = [
    { value: "", label: "Status: All" },
    { value: "CLEAR", label: "Clear" },
    { value: "REVIEW", label: "Review" },
    { value: "ALERT", label: "Alert" },
    { value: "BLOCKED", label: "Blocked" }
  ];

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
          <CustomSelect 
            options={riskOptions} 
            value={riskFilter} 
            onChange={setRiskFilter} 
            placeholder="Risk Level: All"
          />
          
          <CustomSelect 
            options={statusOptions} 
            value={statusFilter} 
            onChange={setStatusFilter} 
            placeholder="Status: All"
          />

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
