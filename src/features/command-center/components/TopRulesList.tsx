import { Lock, Monitor, Globe, Shield, Users } from 'lucide-react';
import { Fragment } from 'react';
import { HoverBorderRay } from './HoverBorderRay';
import type { RuleTrigger } from '../types/command-center-types';

interface TopRulesListProps {
  data: RuleTrigger[];
}

export function TopRulesList({ data }: TopRulesListProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'lock': return <Lock className="h-4 w-4 text-muted-foreground" />;
      case 'monitor': return <Monitor className="h-4 w-4 text-muted-foreground" />;
      case 'globe': return <Globe className="h-4 w-4 text-muted-foreground" />;
      case 'shield': return <Shield className="h-4 w-4 text-muted-foreground" />;
      case 'users': return <Users className="h-4 w-4 text-muted-foreground" />;
      default: return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="relative group overflow-hidden bg-background border border-border rounded-xl p-4 h-full flex flex-col min-h-[220px] transition-all duration-300 motion-safe:hover:-translate-y-[1px] motion-safe:hover:bg-foreground/[0.02] motion-safe:hover:border-foreground/15 shadow-sm motion-safe:hover:shadow-[-8px_0_24px_-4px_rgba(0,0,0,0.4)]">
      <HoverBorderRay />
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="font-semibold text-foreground">Top Triggered Rules</h3>
        <button className="text-xs text-primary hover:underline font-medium">View all →</button>
      </div>

      <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-4 items-center relative z-10">
        <div className="col-span-2 text-xs font-medium text-muted-foreground">Rule Name</div>
        <div className="text-xs font-medium text-muted-foreground text-right">Hits (24h)</div>

        {data.map((rule) => (
          <Fragment key={rule.id}>
            <div className="flex justify-center">{getIcon(rule.iconType)}</div>
            <div className="font-medium text-foreground text-sm truncate pr-2">{rule.ruleName}</div>
            <div className="text-right text-muted-foreground text-sm">{rule.hits24h.toLocaleString()}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
