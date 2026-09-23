'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  MonitorPlay,
  Activity,
  Compass,
  Bell,
  BellRing,
  Clock,
  Users,
  Search,
  FileSearch,
  List,
  Briefcase,
  Box,
  Save,
  FileText,
  CheckSquare,
  Building2,
  Store,
  Smartphone,
  Globe,
  BrainCircuit,
  Target,
  Share2,
  History,
  Map as MapIcon,
  Network,
  Shield,
  ShieldAlert,
  Radio,
  Fingerprint,
  Scale,
  LayoutDashboard,
  AlertTriangle,
  ListTree,
  TrendingUp,
  PieChart,
  PlayCircle,
  BarChart3,
  ArrowRightLeft,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SubItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

type Category = {
  label: string;
  icon: React.ElementType;
  href?: string;
  subItems?: SubItem[];
};

const NAV_CATEGORIES: Category[] = [
  { 
    label: 'Command Center', 
    icon: Home, 
    href: '/command-center' 
  },
  { 
    label: 'Monitor', 
    icon: MonitorPlay,
    subItems: [
      { label: 'Live Transactions', href: '/monitor/live-transactions', icon: Activity },
      { label: 'Transaction Explorer', href: '/monitor/explorer', icon: ArrowRightLeft },
    ]
  },
  { 
    label: 'Alerts', 
    icon: Bell,
    subItems: [
      { label: 'Alert Queue', href: '/alerts/queue', icon: Users },
      { label: 'My Alerts', href: '/alerts/my-alerts', icon: Bell },
      { label: 'Escalated', href: '/alerts/escalated', icon: BellRing },
      { label: 'SLA Breached', href: '/alerts/sla-breached', icon: Clock },
    ]
  },
  { 
    label: 'Investigations', 
    icon: FileSearch,
    subItems: [
      { label: 'Investigation Queue', href: '/investigations/queue', icon: List },
      { label: 'My Investigations', href: '/investigations/my-investigations', icon: Search },
    ]
  },
  { 
    label: 'Cases', 
    icon: Briefcase,
    subItems: [
      { label: 'Case Queue', href: '/cases/queue', icon: Box },
      { label: 'My Cases', href: '/cases/my-cases', icon: Save },
      { label: 'Pending Review', href: '/cases/pending', icon: FileText },
      { label: 'Closed Cases', href: '/cases/closed', icon: CheckSquare },
    ]
  },
  { 
    label: 'Entities', 
    icon: Building2,
    subItems: [
      { label: 'Customers', href: '/entities/customers', icon: Users },
      { label: 'Merchants', href: '/entities/merchants', icon: Store },
      { label: 'Accounts', href: '/entities/accounts', icon: List },
      { label: 'Devices', href: '/entities/devices', icon: Smartphone },
      { label: 'Entity Search', href: '/entities/search', icon: Search },
    ]
  },
  { 
    label: 'Intelligence', 
    icon: Globe,
    subItems: [
      { label: 'Entity 360', href: '/intelligence/entity-360', icon: Target },
      { label: 'Link Analysis', href: '/intelligence/link-analysis', icon: Share2 },
      { label: 'Behavioral Analysis', href: '/intelligence/behavioral', icon: History },
      { label: 'Velocity Analysis', href: '/intelligence/velocity', icon: Activity },
      { label: 'Geographic Analysis', href: '/intelligence/geographic', icon: MapIcon },
      { label: 'Network Intelligence', href: '/intelligence/network', icon: Network },
      { label: 'Website Intelligence', href: '/intelligence/website', icon: Shield },
    ]
  },
  { 
    label: 'Detection', 
    icon: BrainCircuit,
    subItems: [
      { label: 'Detection Overview', href: '/detection/overview', icon: Activity },
      { label: 'Detection Signals', href: '/detection/signals', icon: Radio },
      { label: 'Triggered Rules', href: '/detection/rules', icon: List },
      { label: 'Detection Patterns', href: '/detection/patterns', icon: Fingerprint },
    ]
  },
  { 
    label: 'Risk & MALi', 
    icon: Scale,
    subItems: [
      { label: 'Risk Overview', href: '/risk/overview', icon: LayoutDashboard },
      { label: 'MALi Analysis', href: '/risk/mali', icon: Activity },
      { label: 'Risk Factors', href: '/risk/factors', icon: AlertTriangle },
      { label: 'Risk History', href: '/risk/history', icon: History },
    ]
  },
  { 
    label: 'Rules', 
    icon: ListTree,
    subItems: [
      { label: 'Rule Performance', href: '/rules/performance', icon: TrendingUp },
      { label: 'Rule Hits', href: '/rules/hits', icon: List },
      { label: 'False Positive Analysis', href: '/rules/false-positives', icon: PieChart },
      { label: 'Rule Simulation', href: '/rules/simulation', icon: PlayCircle },
    ]
  },
  { 
    label: 'Analytics', 
    icon: BarChart3,
    subItems: [
      { label: 'Transactions', href: '/analytics/transactions', icon: ArrowRightLeft },
      { label: 'Risk & Fraud', href: '/analytics/risk-fraud', icon: ShieldAlert },
      { label: 'Alerts', href: '/analytics/alerts', icon: Bell },
      { label: 'Cases', href: '/analytics/cases', icon: Briefcase },
    ]
  },
];

import { ChevronLeft } from 'lucide-react';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  
  // Track expanded state for each category by its label
  // By default, expand categories that match the active path
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    NAV_CATEGORIES.forEach(cat => {
      if (cat.subItems) {
        // Expand by default if any child is the currently active path
        const isActive = cat.subItems.some(sub => pathname.startsWith(sub.href));
        initialState[cat.label] = isActive;
      }
    });
    return initialState;
  });

  const toggleCategory = (label: string) => {
    setExpanded(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <aside className={`fixed inset-y-0 left-0 bg-sidebar border-r border-sidebar-border z-20 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className={`flex h-16 shrink-0 items-center border-b border-sidebar-border ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-sidebar-foreground overflow-hidden whitespace-nowrap">
          <ShieldAlert className="h-6 w-6 text-primary shrink-0" />
          {!isCollapsed && <span>RTMT</span>}
        </div>
      </div>
      
      <nav className={`flex-1 overflow-y-auto py-4 flex flex-col gap-1 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        {NAV_CATEGORIES.map((category) => {
          
          if (!category.subItems) {
            // Direct Link (e.g. Command Center)
            const isActive = pathname.startsWith(category.href || '/fake-href');
            return (
              <Link
                key={category.label}
                href={category.href!}
                title={isCollapsed ? category.label : undefined}
                className={cn(
                  "flex items-center gap-3 py-2 rounded-md text-sm font-medium transition-colors mb-1",
                  isCollapsed ? "justify-center px-0" : "px-3",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <category.icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>{category.label}</span>}
              </Link>
            );
          }

          // Collapsible Category
          const isExpanded = expanded[category.label];
          // Check if any child is active
          const hasActiveChild = category.subItems.some(sub => pathname.startsWith(sub.href));

          return (
            <div key={category.label} className="mb-1 flex flex-col">
              <button
                onClick={() => {
                  if (isCollapsed && onToggle) {
                    onToggle(); // Auto-expand when clicking a category icon while collapsed
                  }
                  toggleCategory(category.label);
                }}
                title={isCollapsed ? category.label : undefined}
                className={cn(
                  "flex items-center justify-between py-2 rounded-md text-sm font-semibold transition-colors w-full group",
                  isCollapsed ? "justify-center px-0" : "px-3",
                  hasActiveChild ? "text-sidebar-foreground" : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <category.icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>{category.label}</span>}
                </div>
                {!isCollapsed && (
                  isExpanded ? (
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  ) : (
                    <ChevronRight className="h-4 w-4 opacity-70" />
                  )
                )}
              </button>
              
              {isExpanded && !isCollapsed && (
                <div className="flex flex-col mt-1 mb-1 ml-5 pl-4 border-l border-sidebar-border space-y-1">
                  {category.subItems.map((subItem) => {
                    const isChildActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                          isChildActive 
                            ? "bg-sidebar-accent/50 text-sidebar-accent-foreground" 
                            : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30"
                        )}
                      >
                        <subItem.icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        {subItem.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground flex items-center justify-center">
        {!isCollapsed && <span>v1.0.0-foundation</span>}
      </div>

      <button 
        onClick={onToggle}
        className="absolute -right-3 top-8 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-background text-sidebar-foreground shadow-md hover:bg-sidebar-accent transition-all hover:scale-110"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
}
