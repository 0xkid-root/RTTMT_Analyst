import { ShieldAlert } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function AuthLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 font-bold text-2xl tracking-tight text-foreground", className)}>
      <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary/10">
        <ShieldAlert className="h-6 w-6 text-primary" />
      </div>
      <span>RTMT</span>
    </div>
  );
}
