import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  trend?: number;
  isNegativeGood?: boolean;
}

import { HoverBorderRay } from '@/features/command-center/components/HoverBorderRay';
import { useRef, useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function SummaryCard({ title, value, trend, isNegativeGood = false }: SummaryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isReducedMotion || !cardRef.current || e.pointerType !== 'mouse') return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div 
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={cn(
        "relative group overflow-hidden bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between",
        "transition-all duration-300 motion-safe:hover:-translate-y-[1px] motion-safe:hover:bg-foreground/[0.02] motion-safe:hover:border-foreground/15 motion-safe:hover:shadow-[-8px_0_24px_-4px_rgba(0,0,0,0.4)]"
      )}
    >
      {!isReducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: 'radial-gradient(150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.04), transparent 70%)'
          }}
        />
      )}
      <HoverBorderRay />
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="text-sm font-medium text-muted-foreground mb-2">{title}</div>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold font-mono text-foreground">{value}</div>
          {trend !== undefined && (
            <div className={cn(
              "flex items-center text-xs font-medium",
              trend === 0 ? 'text-muted-foreground' :
              (trend > 0 ? (isNegativeGood ? 'text-red-500' : 'text-green-500') : (isNegativeGood ? 'text-green-500' : 'text-red-500'))
            )}>
              {trend > 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : trend < 0 ? <ArrowDownRight className="w-3 h-3 mr-0.5" /> : <Minus className="w-3 h-3 mr-0.5" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface LiveTransactionsSummaryProps {
  stats: {
    transactionsPerMin: number;
    highRisk: number;
    critical: number;
    alerts: number;
    blocked: number;
  };
}

export function LiveTransactionsSummary({ stats }: LiveTransactionsSummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
      <SummaryCard title="Transactions / min" value={stats.transactionsPerMin.toLocaleString()} trend={4.2} />
      <SummaryCard title="High Risk" value={stats.highRisk.toLocaleString()} trend={1.5} isNegativeGood />
      <SummaryCard title="Critical" value={stats.critical.toLocaleString()} trend={-2.1} isNegativeGood />
      <SummaryCard title="Alerts" value={stats.alerts.toLocaleString()} trend={5.4} isNegativeGood />
      <SummaryCard title="Blocked" value={stats.blocked.toLocaleString()} trend={0} />
    </div>
  );
}
