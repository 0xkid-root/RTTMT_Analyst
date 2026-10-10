'use client';

import { MaliAnalysisResult } from '../types/mali';
import { RiskBadge } from '../../monitor/components/shared/RiskBadge';
import { X, Network, FileText, CheckCircle2, ShieldAlert, Activity, ArrowUpRight, ArrowDownRight, Clock, History } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MaliTransactionDrawerProps {
  transaction: MaliAnalysisResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MaliTransactionDrawer({ transaction, isOpen, onClose }: MaliTransactionDrawerProps) {
  const router = useRouter();
  
  if (!transaction) return null;

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer - Updated to sm:w-[600px] or larger */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[650px] bg-sidebar border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* A. Sticky header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-sidebar sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold">MALi Analysis Details</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm font-mono text-muted-foreground" title="Transaction ID">Txn: {transaction.id}</span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-sm font-mono text-muted-foreground" title="Evaluation ID">Eval: {transaction.evaluationId}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-sidebar/50">
          
          {/* B. Risk summary */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1 font-medium flex items-center gap-2">
                  MALi Score
                  <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold">
                    Illustrative
                  </span>
                </div>
                <div className="flex items-end gap-3">
                  <div className={`text-5xl font-bold font-mono tracking-tighter ${
                    transaction.maliScore >= transaction.configuredThresholds.critical ? 'text-destructive' : 
                    transaction.maliScore >= transaction.configuredThresholds.high ? 'text-red-500' :
                    transaction.maliScore >= transaction.configuredThresholds.medium ? 'text-orange-500' : 
                    'text-emerald-500'
                  }`}>
                    {transaction.maliScore}
                  </div>
                  <div className="mb-1 text-muted-foreground">/ 100</div>
                </div>
              </div>
              <div className="text-right">
                <RiskBadge level={transaction.riskLevel} />
                <div className="text-xs text-muted-foreground mt-2 flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(transaction.evaluationTimestamp).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Status: <span className="font-medium text-foreground">{transaction.scoringStatus}</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-border/60" />

          {/* C. Score explanation */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2">
              <Network className="w-4 h-4" /> Score Explanation
            </h3>
            
            {transaction.contributingFeatures.length > 0 ? (
              <div className="space-y-3">
                {transaction.contributingFeatures.map((feature, idx) => (
                  <div key={idx} className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-foreground">{feature.name}</div>
                        <div className="text-sm text-muted-foreground mt-0.5">{feature.explanation}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="flex items-center gap-1 font-mono text-sm font-medium">
                          {feature.direction === 'increase' ? (
                            <ArrowUpRight className="w-4 h-4 text-destructive" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                          )}
                          {feature.contribution > 0 ? '+' : ''}{feature.contribution} pts
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          feature.severity === 'high' || feature.severity === 'critical' ? 'bg-destructive/10 text-destructive' :
                          feature.severity === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                          'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {feature.severity}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm bg-muted/30 p-2 rounded border border-border/50">
                      <div>
                        <span className="text-muted-foreground block text-xs mb-0.5">Observed Value</span>
                        <span className="font-mono text-foreground">{feature.observedValue}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-0.5">Expected Baseline</span>
                        <span className="font-mono text-foreground">{feature.expectedBaseline || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg border border-border text-center">
                No specific feature contributions available for this evaluation.
              </div>
            )}
          </div>

          {/* D. Supporting signals */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Supporting Signals
            </h3>
            
            {transaction.supportingSignals.length > 0 ? (
              <div className="grid gap-3">
                {transaction.supportingSignals.map((signal, idx) => (
                  <div key={idx} className="bg-card border border-border rounded-lg p-3 flex gap-3 items-start">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${signal.contributedToScore ? 'text-primary' : 'text-muted-foreground/50'}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-sm">{signal.name}</div>
                        <div className="flex gap-2 text-xs">
                          <span className="font-mono text-muted-foreground">{signal.version}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{signal.description}</div>
                      <div className="mt-2 text-xs flex items-center gap-2">
                        <span className="text-muted-foreground">Observed:</span>
                        <span className="font-mono text-foreground bg-muted px-1.5 py-0.5 rounded">{signal.observedValue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No supporting signals observed.</div>
            )}
          </div>

          <hr className="border-border/60" />

          {/* E. Feature evidence */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" /> Feature Evidence
            </h3>
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left py-2 px-4 font-medium text-muted-foreground w-1/3">Feature</th>
                    <th className="text-left py-2 px-4 font-medium text-muted-foreground">Observed Value</th>
                    <th className="text-left py-2 px-4 font-medium text-muted-foreground">Baseline / Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transaction.featureEvidence.map((ev, idx) => (
                    <tr key={idx} className="hover:bg-muted/20">
                      <td className="py-2 px-4 font-medium">{ev.label}</td>
                      <td className="py-2 px-4 font-mono">
                        {ev.isMissingData ? (
                          <span className="text-muted-foreground italic">Missing Data</span>
                        ) : (
                          ev.value
                        )}
                      </td>
                      <td className="py-2 px-4 font-mono text-muted-foreground">{ev.baseline || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* F. Model and version traceability */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4" /> Model Traceability
              </h3>
              <div className="bg-card rounded-lg border border-border p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model</span>
                  <span className="font-mono font-medium">{transaction.modelName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model Version</span>
                  <span className="font-mono text-foreground">{transaction.modelVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Feature Set</span>
                  <span className="font-mono text-foreground">{transaction.featureSetVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Signal Rules</span>
                  <span className="font-mono text-foreground">{transaction.signalVersions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Thresholds</span>
                  <span className="font-mono text-foreground">{transaction.thresholdVersion}</span>
                </div>
              </div>
            </div>

            {/* G. Evaluation details */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" /> Evaluation Details
              </h3>
              <div className="bg-card rounded-lg border border-border p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Execution Status</span>
                  <span className={`font-medium ${
                    transaction.executionStatus === 'SUCCESS' ? 'text-emerald-500' : 
                    transaction.executionStatus === 'ERROR' ? 'text-destructive' : 'text-orange-500'
                  }`}>
                    {transaction.executionStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">High Threshold</span>
                  <span className="font-mono text-foreground">{transaction.configuredThresholds.high}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Critical Threshold</span>
                  <span className="font-mono text-foreground">{transaction.configuredThresholds.critical}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created At</span>
                  <span className="font-mono text-foreground">{new Date(transaction.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Evaluated At</span>
                  <span className="font-mono text-foreground">{new Date(transaction.evaluationTimestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-border/60" />

          {/* H. Previous evaluations */}
          <div className="space-y-4 pb-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <History className="w-4 h-4" /> Previous Evaluations
              </span>
              <button className="text-primary hover:underline text-[10px]" onClick={() => alert('Navigate to Risk History')}>
                View History
              </button>
            </h3>
            
            {transaction.previousEvaluations && transaction.previousEvaluations.length > 0 ? (
              <div className="flex flex-col gap-2">
                {transaction.previousEvaluations.map((prev, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-card border border-border rounded p-3 text-sm">
                    <div>
                      <div className="font-mono text-xs text-muted-foreground mb-1">{prev.evaluationId}</div>
                      <div className="text-xs">{new Date(prev.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-mono font-medium text-lg">{prev.maliScore}</div>
                      <RiskBadge level={prev.riskLevel as any} className="scale-90" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground bg-card border border-border border-dashed p-4 rounded-lg text-center">
                No previous risk evaluations available for this entity.
              </div>
            )}
          </div>
          
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-border bg-sidebar flex gap-3 shrink-0">
          <button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors" 
            onClick={() => alert('Investigation workflow started')}
          >
            Investigate
          </button>
          <button 
            className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors" 
            onClick={() => router.push(`/cases/create?txnId=${transaction.id}`)}
          >
            Create Case
          </button>
        </div>
      </div>
    </>
  );
}
