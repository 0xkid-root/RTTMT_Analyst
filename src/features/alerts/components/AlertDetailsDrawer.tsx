import { Alert } from '../types/alert';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Hash, User, Clock, AlertTriangle, Building, AlertCircle, Calendar } from 'lucide-react';
import { getSeverityColor, getStatusColor, getSlaColor, formatSla } from './alerts-columns';

interface AlertDetailsDrawerProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AlertDetailsDrawer({ alert, isOpen, onClose }: AlertDetailsDrawerProps) {
  if (!alert) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto border-border bg-card p-0">
        
        {/* Header section */}
        <div className="p-6 border-b border-border bg-muted/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-sm text-primary font-medium">{alert.id}</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider border ${getSeverityColor(alert.severity)}`}>
                  {alert.severity.toUpperCase()}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider border ${getStatusColor(alert.status)}`}>
                  {alert.status.replace('_', ' ')}
                </span>
              </div>
              <SheetTitle className="text-xl flex items-center gap-2">
                {alert.escalated && <AlertTriangle className="w-5 h-5 text-orange-500" />}
                {alert.title}
              </SheetTitle>
              <SheetDescription className="mt-2 text-sm">
                {alert.description}
              </SheetDescription>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Button size="sm" variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Acknowledge
            </Button>
            <Button size="sm" variant="outline">
              Assign to me
            </Button>
            <Button size="sm" variant="outline" className="border-orange-500/30 text-orange-500 hover:bg-orange-500/10">
              Escalate
            </Button>
            <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
              Create Case
            </Button>
            <Button size="sm" variant="outline" className="border-green-500/30 text-green-500 hover:bg-green-500/10">
              Resolve
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Alert Overview */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Alert Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Created</div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {new Date(alert.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Assigned To</div>
                <div className="flex items-center gap-1.5 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {alert.assignedTo || <span className="text-muted-foreground italic">Unassigned</span>}
                </div>
              </div>
            </div>
          </section>

          {/* Transaction & Merchant */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Source Transaction</h3>
            <div className="bg-muted/20 border border-border rounded-lg p-4 grid grid-cols-2 gap-y-4 gap-x-4">
              {alert.transactionId && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Transaction ID</div>
                  <div className="flex items-center gap-1.5 text-sm font-mono text-primary cursor-pointer hover:underline">
                    <Hash className="w-3.5 h-3.5" />
                    {alert.transactionId}
                  </div>
                </div>
              )}
              {alert.amount && alert.currency && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Amount</div>
                  <div className="text-sm font-medium">
                    {alert.amount.toLocaleString('en-US', { style: 'currency', currency: alert.currency })}
                  </div>
                </div>
              )}
              <div>
                <div className="text-xs text-muted-foreground mb-1">Merchant</div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Building className="w-3.5 h-3.5 text-muted-foreground" />
                  {alert.merchantName}
                  <span className="text-xs text-muted-foreground font-mono">({alert.merchantId})</span>
                </div>
              </div>
              {alert.paymentMethod && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Payment Method</div>
                  <div className="text-sm">{alert.paymentMethod}</div>
                </div>
              )}
            </div>
          </section>

          {/* Risk Signals */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Risk Signals</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/20 border border-border rounded-lg">
                <div className="text-sm font-medium">Risk Score</div>
                <div className="text-lg font-bold text-orange-500">{alert.riskScore} / 100</div>
              </div>
              <div className="p-3 bg-muted/20 border border-border rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Triggered Rule</div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{alert.ruleId}</span>
                  <span className="text-sm font-medium">{alert.ruleName}</span>
                </div>
              </div>
            </div>
          </section>

          {/* SLA Tracking */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">SLA Tracking</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Target Resolution</div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  {new Date(alert.slaTargetTime).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Status</div>
                <div className={`flex items-center gap-1.5 text-sm ${getSlaColor(alert.slaStatus)}`}>
                  {alert.slaStatus === 'BREACHED' ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  {formatSla(alert)}
                </div>
              </div>
            </div>
          </section>

          {/* Activity Timeline (Placeholder structure) */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Activity Timeline</h3>
            <div className="relative pl-4 border-l-2 border-muted space-y-6">
              
              {alert.escalatedAt && (
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-card bg-orange-500" />
                  <div className="text-sm">
                    <span className="font-medium">Escalated</span> to {alert.escalatedTo}
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {new Date(alert.escalatedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                    {alert.escalationReason && (
                      <div className="text-sm text-muted-foreground mt-1 p-2 bg-muted/20 rounded border border-border">
                        "{alert.escalationReason}"
                      </div>
                    )}
                  </div>
                </div>
              )}

              {alert.assignedAt && (
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-card bg-primary" />
                  <div className="text-sm">
                    <span className="font-medium">Assigned</span> to {alert.assignedTo}
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {new Date(alert.assignedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </div>
                </div>
              )}

              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-card bg-muted-foreground" />
                <div className="text-sm">
                  <span className="font-medium">Alert Created</span> by System
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {new Date(alert.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
              </div>

            </div>
          </section>

        </div>
      </SheetContent>
    </Sheet>
  );
}
