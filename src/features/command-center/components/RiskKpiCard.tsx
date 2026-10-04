import { ReactNode, useEffect, useState, useRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { HoverBorderRay } from './HoverBorderRay';

function useAnimatedNumber(value: number, duration: number = 700) {
  const [displayValue, setDisplayValue] = useState(value);
  const valueRef = useRef(0);
  const targetValueRef = useRef(value);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(value);
      valueRef.current = value;
      targetValueRef.current = value;
      return;
    }

    const startValue = isFirstRender.current ? 0 : valueRef.current;
    const endValue = value;

    if (startValue === endValue && !isFirstRender.current) return;

    targetValueRef.current = value;
    isFirstRender.current = false;

    const startTime = performance.now();
    let frameId: number;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startValue + (endValue - startValue) * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        valueRef.current = endValue;
      }
    }

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  return Math.round(displayValue);
}

interface RiskKpiCardProps {
  title: string;
  value: number;
  subtext?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  trendTone?: 'positive' | 'negative' | 'warning' | 'neutral';
  icon?: ReactNode;
  index?: number;
  isLive?: boolean;
  liveTone?: 'success' | 'danger' | 'warning' | 'neutral';
}

export function RiskKpiCard({
  title,
  value,
  subtext,
  trendDirection = 'neutral',
  trendTone = 'neutral',
  icon,
  index = 0,
  isLive = false,
  liveTone = 'success'
}: RiskKpiCardProps) {
  const animatedValue = useAnimatedNumber(value);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const prevValue = useRef(value);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;

    if (value !== prevValue.current && prevValue.current !== undefined) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 500);
      prevValue.current = value;
      return () => clearTimeout(timer);
    }
    prevValue.current = value;
  }, [value, isReducedMotion]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isReducedMotion || !cardRef.current || e.pointerType !== 'mouse') return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const cardStyle: React.CSSProperties = {
    animationFillMode: 'backwards',
    animationDelay: isReducedMotion ? '0ms' : `${index * 60}ms`,
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    animationDuration: '400ms',
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={cn(
        "bg-background border border-border rounded-xl p-4 flex flex-col justify-between group relative overflow-hidden",
        "transition-all duration-300",
        !isReducedMotion && "hover:-translate-y-[1px] hover:bg-foreground/[0.02] hover:border-foreground/15",
        !isReducedMotion && "hover:shadow-[-8px_0_24px_-4px_rgba(0,0,0,0.4)] shadow-sm",
        !isReducedMotion && "animate-in fade-in slide-in-from-bottom-2"
      )}
      style={cardStyle}
    >
      {!isReducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: 'radial-gradient(150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.04), transparent 70%)'
          }}
        />
      )}

      {/* Traveling Border Ray */}
      <HoverBorderRay />

      <div className="flex items-center gap-3 mb-2 relative z-10">
        {icon && (
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center bg-muted transition-transform",
            !isReducedMotion ? "duration-300 group-hover:scale-[1.03]" : ""
          )}>
            {icon}
          </div>
        )}
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {isLive && !isReducedMotion && (
            <div className="relative flex h-1.5 w-1.5">
              {isUpdating && (
                <span className={cn(
                  "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                  liveTone === 'success' ? "bg-success" :
                    liveTone === 'danger' ? "bg-danger" :
                      liveTone === 'warning' ? "bg-warning" : "bg-primary"
                )} />
              )}
              <span className={cn(
                "relative inline-flex rounded-full h-1.5 w-1.5 animate-pulse",
                liveTone === 'success' ? "bg-success" :
                  liveTone === 'danger' ? "bg-danger" :
                    liveTone === 'warning' ? "bg-warning" : "bg-primary"
              )} />
            </div>
          )}
          {isLive && isReducedMotion && (
            <span className={cn(
              "h-1.5 w-1.5 rounded-full",
              liveTone === 'success' ? "bg-success" :
                liveTone === 'danger' ? "bg-danger" :
                  liveTone === 'warning' ? "bg-warning" : "bg-primary"
            )} />
          )}
        </div>
      </div>

      <div className="relative z-10">
        <div className={cn(
          "text-2xl font-bold tracking-tight transition-colors tabular-nums",
          !isReducedMotion ? "duration-500" : "",
          isUpdating && !isReducedMotion ? "text-primary" : "text-foreground"
        )}>
          {animatedValue.toLocaleString()}
        </div>

        {subtext && (
          <div className="mt-2 flex items-center text-xs font-medium">
            <span
              className={cn(
                "mr-1 transition-colors",
                !isReducedMotion ? "duration-300" : "",
                trendTone === 'positive' ? "text-success" :
                  trendTone === 'negative' ? "text-danger" :
                    trendTone === 'warning' ? "text-warning" :
                      "text-muted-foreground"
              )}
            >
              {trendDirection === 'up' && '↑ '}
              {trendDirection === 'down' && '↓ '}
              {subtext}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
