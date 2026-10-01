import Image from 'next/image';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function AuthLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 font-bold text-2xl tracking-tight text-foreground", className)}>
      <Image 
        src="/rttmt_logo-removebg-preview.png" 
        alt="RTTMT Logo" 
        width={64} 
        height={64} 
        className="object-contain"
      />
      <span>RTTMT</span>
    </div>
  );
}
