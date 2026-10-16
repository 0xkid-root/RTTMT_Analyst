import { SignalSeverity, SignalType, RuleCategory } from '../../types/detection';
import {
  Zap,
  TrendingUp,
  Smartphone,
  ShieldAlert,
  Compass,
  Store,
  Moon,
  Globe,
  Activity,
  Layers,
  Radio,
  Fingerprint
} from 'lucide-react';

interface SeverityBadgeProps {
  severity: SignalSeverity | string;
  size?: 'sm' | 'md';
}

export function SeverityBadge({ severity, size = 'sm' }: SeverityBadgeProps) {
  const sevUpper = (severity || 'LOW').toUpperCase();

  const styles: Record<string, string> = {
    CRITICAL: 'bg-red-500/10 text-red-400 border-red-500/30',
    HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    MEDIUM: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    LOW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  };

  const currentStyle = styles[sevUpper] || styles.LOW;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded tracking-wider border font-mono ${sizeClasses} ${currentStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        sevUpper === 'CRITICAL' ? 'bg-red-400 animate-pulse' :
        sevUpper === 'HIGH' ? 'bg-orange-400' :
        sevUpper === 'MEDIUM' ? 'bg-yellow-400' : 'bg-emerald-400'
      }`} />
      {sevUpper}
    </span>
  );
}

interface SignalTypeBadgeProps {
  type: SignalType | string;
  showIcon?: boolean;
}

export function SignalTypeBadge({ type, showIcon = true }: SignalTypeBadgeProps) {
  const getIcon = () => {
    switch (type) {
      case 'HIGH_VELOCITY': return <Zap className="w-3 h-3 text-amber-400" />;
      case 'UNUSUAL_AMOUNT': return <TrendingUp className="w-3 h-3 text-red-400" />;
      case 'NEW_DEVICE': return <Smartphone className="w-3 h-3 text-cyan-400" />;
      case 'IP_RISK': return <ShieldAlert className="w-3 h-3 text-purple-400" />;
      case 'IMPOSSIBLE_TRAVEL': return <Compass className="w-3 h-3 text-rose-400" />;
      case 'MERCHANT_RISK': return <Store className="w-3 h-3 text-blue-400" />;
      case 'OFF_HOURS_ACTIVITY': return <Moon className="w-3 h-3 text-indigo-400" />;
      case 'GEO_MISMATCH': return <Globe className="w-3 h-3 text-teal-400" />;
      default: return <Radio className="w-3 h-3 text-muted-foreground" />;
    }
  };

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-muted/40 border border-border text-foreground">
      {showIcon && getIcon()}
      <span>{type.replace(/_/g, ' ')}</span>
    </span>
  );
}

interface RuleCategoryBadgeProps {
  category: RuleCategory | string;
}

export function RuleCategoryBadge({ category }: RuleCategoryBadgeProps) {
  const getIcon = () => {
    switch (category) {
      case 'VELOCITY': return <Activity className="w-3 h-3 text-amber-400" />;
      case 'AMOUNT_ANOMALY': return <TrendingUp className="w-3 h-3 text-red-400" />;
      case 'DEVICE_INTELLIGENCE': return <Fingerprint className="w-3 h-3 text-cyan-400" />;
      case 'GEOLOCATION': return <Globe className="w-3 h-3 text-emerald-400" />;
      case 'NETWORK_REPUTATION': return <ShieldAlert className="w-3 h-3 text-purple-400" />;
      case 'BEHAVIORAL': return <Layers className="w-3 h-3 text-indigo-400" />;
      default: return <Activity className="w-3 h-3 text-muted-foreground" />;
    }
  };

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-secondary/50 border border-border text-secondary-foreground">
      {getIcon()}
      <span>{category.replace(/_/g, ' ')}</span>
    </span>
  );
}

interface StatusBadgeProps {
  enabled: boolean;
}

export function StatusBadge({ enabled }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border ${
        enabled
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          : 'bg-muted/30 text-muted-foreground border-border'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${enabled ? 'bg-emerald-400' : 'bg-muted-foreground'}`} />
      {enabled ? 'ENABLED' : 'DISABLED'}
    </span>
  );
}
