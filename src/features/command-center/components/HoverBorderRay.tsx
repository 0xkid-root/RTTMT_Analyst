import { useEffect, useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HoverBorderRayProps {
  borderRadius?: string;
}

export function HoverBorderRay({ borderRadius = 'rounded-xl' }: HoverBorderRayProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  if (isReducedMotion) return null;

  return (
    <div 
      className={cn(
        "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        borderRadius
      )}
      style={{
        border: '1px solid transparent',
        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
      }}
    >
      <div 
        className="absolute inset-[-100%] text-primary"
        style={{ 
          animation: 'spin 3s linear infinite',
          background: 'conic-gradient(from 0deg, transparent 0 340deg, currentColor 360deg)' 
        }}
      />
    </div>
  );
}
