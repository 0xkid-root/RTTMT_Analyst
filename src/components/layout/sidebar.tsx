'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TerminalSquare,
  ArrowRightLeft,
  BellRing,
  Briefcase,
  Store,
  Users,
  ShieldAlert,
  ListTree,
  Activity,
  BrainCircuit,
  BarChart3,
  Settings
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/command-center', label: 'Command Center', icon: TerminalSquare },
  { href: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/alerts', label: 'Alerts', icon: BellRing },
  { href: '/cases', label: 'Cases', icon: Briefcase },
  { href: '/merchants', label: 'Merchants', icon: Store },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/detection', label: 'Detection', icon: ShieldAlert },
  { href: '/rules', label: 'Rules', icon: ListTree },
  { href: '/mali', label: 'MALi', icon: Activity },
  { href: '/intelligence', label: 'Intelligence', icon: BrainCircuit },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border z-20 flex flex-col">
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-sidebar-foreground">
          <ShieldAlert className="h-6 w-6 text-primary" />
          <span>RTMT</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground">
        v1.0.0-foundation
      </div>
    </aside>
  );
}
