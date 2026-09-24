import { Alert } from '../types/alert';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { User, Clock, AlertTriangle, Building, AlertCircle, Calendar, ArrowRight, FileText, MapPin } from 'lucide-react';
import { getSeverityColor, getStatusColor, getSlaColor, formatSla } from './alerts-columns';
import Link from 'next/link';

interface AlertDetailsDrawerProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AlertDetailsDrawer({ alert, isOpen, onClose }: AlertDetailsDrawerProps) {
  if (!alert) return null;

  // Derive actions based on status
  const isNew = alert.status === 'NEW';
  const isAck = alert.status === 'ACKNOWLEDGED';
  const isInProgress = alert.status === 'IN_PROGRESS';
  const isResolved = alert.status === 'RESOLVED';

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-[500px] overflow-y-auto border-border bg-card p-0">
        
        {/* 1. Header & 2. Status / SLA Summary */}
        <div className="p-6 border-b border-border bg-card sticky top-0 z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-sm text-primary font-medium">{alert.id}</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider border ${getSeverityColor(alert.severity)}`}>
              {alert.severity.toUpperCase()}
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider border ${getStatusColor(alert.status)}`}>
              {alert.status.replace('_', ' ')}
            </span>
          </div>
          
          <SheetTitle className="text-xl flex items-start gap-2 mb-2">
            {alert.escalated && <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />}
            <span>{alert.title}</span>
          </SheetTitle>
          <SheetDescription className="text-sm mb-4">
            {alert.description}
          </SheetDescription>

          {/* Operational Status Row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm bg-muted/30 p-3 rounded-lg border border-border">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground mr-1 text-xs uppercase tracking-wider font-semibold">SLA</span>
              <span className={`font-medium ${getSlaColor(alert.slaStatus)} flex items-center gap-1`}>
                {alert.slaStatus === 'BREACHED' ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                {alert.slaStatus.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground mr-2 text-xs uppercase tracking-wider font-semibold">Time</span>
              <span className={`font-medium ${alert.slaStatus === 'BREACHED' ? 'text-red-500' : ''}`}>
                {alert.slaStatus === 'BREACHED' ? `${formatSla(alert)} overdue` : `${formatSla(alert)} remaining`}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground mr-2 text-xs uppercase tracking-wider font-semibold">Assigned</span>
              <span className="font-medium">{alert.assignedTo || 'Unassigned'}</span>
            </div>
          </div>

          {/* 3. Status-Aware Actions */}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            {isNew && (
              <Button size="sm" variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Acknowledge
              </Button>
            )}
            
            {!isResolved && (
              <Button size="sm" variant="outline" className="border-border hover:bg-muted">
                Assign to me
              </Button>
            )}

            {!isResolved && (
              <>
                <Button size="sm" variant="outline" className="border-orange-500/30 text-orange-500 hover:bg-orange-500/10">
                  Escalate
                </Button>
                {!alert.caseId && (
                  <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                    Create Case
                  </Button>
                )}
              </>
            )}

            {(isAck || isInProgress) && (
              <Button size="sm" variant="outline" className="border-green-500/30 text-green-500 hover:bg-green-500/10">
                Resolve
              </Button>
            )}
            
            {isResolved && (
              <Button size="sm" variant="outline" className="border-border hover:bg-muted">
                Reopen Alert
              </Button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-8">
          
          {/* 4. Alert Overview */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Alert Overview</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
              <div>
                <div className="text-muted-foreground text-xs mb-1">Created</div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {new Date(alert.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs mb-1">Assigned To</div>
                <div className="flex items-center gap-1.5 font-medium">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {alert.assignedTo || <span className="text-muted-foreground italic font-normal">Unassigned</span>}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs mb-1">Alert Type</div>
                <div className="font-medium">{alert.alertType || 'System Alert'}</div>
              </div>
            </div>
          </section>

          {/* 5. Source Transaction */}
          {alert.transactionId && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Source Transaction</h3>
                <Link href={`/monitor/explorer?tx=${alert.transactionId}`}>
                  <Button variant="link" size="sm" className="h-auto p-0 text-primary text-xs">
                    View Transaction <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="bg-muted/20 border border-border rounded-lg p-3.5 grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs mb-1">Transaction ID</div>
                  <div className="font-mono text-primary">{alert.transactionId}</div>
                </div>
                {alert.amount && alert.currency && (
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Amount</div>
                    <div className="font-medium">{alert.amount.toLocaleString('en-US', { style: 'currency', currency: alert.currency })}</div>
                  </div>
                )}
                {alert.paymentMethod && (
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Payment Method</div>
                    <div>{alert.paymentMethod}</div>
                  </div>
                )}
                {alert.location && (
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Location</div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" /> {alert.location}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 6. Merchant / Account Context */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Merchant / Account</h3>
              <Button variant="link" size="sm" className="h-auto p-0 text-primary text-xs">
                View Merchant <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="bg-muted/20 border border-border rounded-lg p-3.5 grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
              <div>
                <div className="text-muted-foreground text-xs mb-1">Merchant Name</div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Building className="w-3.5 h-3.5 text-muted-foreground" />
                  {alert.merchantName}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs mb-1">Merchant ID</div>
                <div className="font-mono text-muted-foreground">{alert.merchantId}</div>
              </div>
              {alert.accountId && (
                <div>
                  <div className="text-muted-foreground text-xs mb-1">Account / Ref</div>
                  <div className="font-mono">{alert.accountId}</div>
                </div>
              )}
              {alert.accountStatus && (
                <div>
                  <div className="text-muted-foreground text-xs mb-1">Account Status</div>
                  <div className="font-medium">{alert.accountStatus}</div>
                </div>
              )}
            </div>
          </section>

          {/* 7. Risk Signals */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Risk Signals</h3>
            <div className="space-y-3">
              <div className="p-3 bg-muted/20 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Risk Score</div>
                  <div className={`text-lg font-bold ${alert.riskScore > 80 ? 'text-red-500' : 'text-orange-500'}`}>
                    {alert.riskScore} <span className="text-sm text-muted-foreground font-normal">/ 100</span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${alert.riskScore > 80 ? 'bg-red-500' : 'bg-orange-500'}`} 
                    style={{ width: `${Math.min(Math.max(alert.riskScore, 0), 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="p-3.5 bg-muted/20 border border-border rounded-lg text-sm">
                <div className="text-muted-foreground text-xs mb-1.5">Triggered Rule</div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-mono text-xs bg-muted border border-border px-1.5 py-0.5 rounded text-muted-foreground">{alert.ruleId}</span>
                  <span className="font-medium">{alert.ruleName}</span>
                </div>
                
                {alert.riskIndicators && alert.riskIndicators.length > 0 && (
                  <div>
                    <div className="text-muted-foreground text-xs mb-2">Signals:</div>
                    <ul className="space-y-2">
                      {alert.riskIndicators.map((indicator, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5 text-lg leading-none">•</span>
                          <span className="text-foreground">{indicator}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 8. SLA Tracking */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">SLA Tracking</h3>
            <div className="bg-muted/20 border border-border rounded-lg p-3.5 grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
              <div>
                <div className="text-muted-foreground text-xs mb-1">Target Resolution</div>
                <div className="font-medium">
                  {new Date(alert.slaTargetTime).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs mb-1">SLA Status</div>
                <div className={`font-medium ${getSlaColor(alert.slaStatus)}`}>
                  {alert.slaStatus.replace('_', ' ')}
                </div>
              </div>
            </div>
          </section>

          {/* 9. Escalation */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Escalation</h3>
            {!alert.escalated ? (
              <div className="text-sm text-muted-foreground font-medium">Not Escalated</div>
            ) : (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3.5 grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                <div>
                  <div className="text-orange-500/70 text-xs mb-1">Escalated To</div>
                  <div className="font-medium text-orange-400">{alert.escalatedTo}</div>
                </div>
                <div>
                  <div className="text-orange-500/70 text-xs mb-1">Escalated At</div>
                  <div className="font-medium text-orange-400">
                    {alert.escalatedAt && new Date(alert.escalatedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-orange-500/70 text-xs mb-1">Reason</div>
                  <div className="text-orange-100">{alert.escalationReason}</div>
                </div>
              </div>
            )}
          </section>

          {/* 10. Linked Case */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Linked Case</h3>
            {!alert.caseId ? (
              <div className="bg-muted/20 border border-border rounded-lg p-4 flex items-center">
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" /> No case created
                </div>
              </div>
            ) : (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-primary">{alert.caseId}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold border border-primary/20 bg-primary/10 text-primary">
                      {alert.caseStatus}
                    </span>
                  </div>
                  <div className="text-sm font-medium">{alert.caseTitle}</div>
                </div>
                <Link href={`/cases/${alert.caseId}`}>
                  <Button variant="outline" size="sm" className="h-8 text-primary border-primary/30 hover:bg-primary/10">
                    View Case <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </section>

          {/* 11. Activity Timeline */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Activity Timeline</h3>
            <div className="relative pl-3 border-l-2 border-border space-y-6">
              
              {[{ 
                id: 'generated',
                time: alert.createdAt, 
                color: 'bg-muted-foreground',
                content: (
                  <>
                    <span className="font-medium text-foreground">Alert Generated</span>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {new Date(alert.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 bg-muted/30 border border-border rounded p-1.5 inline-block">
                      Rule triggered: <span className="font-mono">{alert.ruleId}</span>
                    </div>
                  </>
                )
              },
              ...(alert.acknowledgedAt ? [{
                id: 'ack',
                time: alert.acknowledgedAt,
                color: 'bg-blue-500',
                content: (
                  <>
                    <span className="font-medium text-foreground">Acknowledged</span>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {new Date(alert.acknowledgedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </>
                )
              }] : []),
              ...(alert.assignedAt ? [{
                id: 'assigned',
                time: alert.assignedAt,
                color: 'bg-primary',
                content: (
                  <>
                    <span className="font-medium text-foreground">Assigned</span> to {alert.assignedTo}
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {new Date(alert.assignedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </>
                )
              }] : []),
              ...(alert.escalatedAt ? [{
                id: 'escalated',
                time: alert.escalatedAt,
                color: 'bg-orange-500',
                content: (
                  <>
                    <span className="font-medium text-foreground">Escalated</span> to {alert.escalatedTo}
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {new Date(alert.escalatedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </>
                )
              }] : []),
              ...(alert.resolvedAt ? [{
                id: 'resolved',
                time: alert.resolvedAt,
                color: 'bg-green-500',
                content: (
                  <>
                    <span className="font-medium text-foreground">Resolved</span>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {new Date(alert.resolvedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </>
                )
              }] : [])
              ]
              .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
              .map(event => (
                <div key={event.id} className="relative">
                  <div className={`absolute -left-[17px] top-1 h-2.5 w-2.5 rounded-full border-2 border-card ${event.color}`} />
                  <div className="text-sm">
                    {event.content}
                  </div>
                </div>
              ))}

            </div>
          </section>

        </div>
      </SheetContent>
    </Sheet>
  );
}
