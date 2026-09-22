import { Lock, Monitor, Globe, Shield, Users } from 'lucide-react';
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
    <div className="bg-background border border-border rounded-xl shadow-sm p-4 h-full flex flex-col min-h-[220px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-foreground">Top Triggered Rules</h3>
        <button className="text-xs text-primary hover:underline font-medium">View all →</button>
      </div>

      <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-3 items-center text-sm">
        <div className="col-span-2 text-xs font-medium text-muted-foreground">Rule Name</div>
        <div className="text-xs font-medium text-muted-foreground text-right">Hits (24h)</div>

        {data.map((rule) => (
          <div key={rule.id} className="col-span-3 grid grid-cols-subgrid items-center py-1">
            <div className="flex justify-center">{getIcon(rule.iconType)}</div>
            <div className="font-medium text-foreground truncate pr-2">{rule.ruleName}</div>
            <div className="text-right text-muted-foreground">{rule.hits24h.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
