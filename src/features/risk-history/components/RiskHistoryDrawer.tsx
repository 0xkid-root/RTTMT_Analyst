'use client';

import { RiskHistoryRecord } from '../types/risk-history';
import { X, Network, FileText, ArrowUpRight, ArrowDownRight, Clock, Info, ShieldAlert, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { RiskBadge } from '../../monitor/components/shared/RiskBadge';

interface RiskHistoryDrawerProps {
  record: RiskHistoryRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RiskHistoryDrawer({ record, isOpen, onClose }: RiskHistoryDrawerProps) {
  const router = useRouter();
  
  if (!record) return null;

  const scoreChange = record.scoreChange;
  const isIncrease = scoreChange !== null && scoreChange > 0;
  const hasChange = scoreChange !== null && scoreChange !== 0;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[500px] bg-sidebar border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-sidebar sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Historical Evaluation
              <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold border border-primary/20">
                Mock Data
              </span>
            </h2>
            <div className="text-sm font-mono text-muted-foreground mt-1">Eval: {record.evaluationId}</div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-sidebar/50">
          
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1 font-medium">Risk Score</div>
                <div className="flex items-end gap-2">
                  <div className="text-4xl font-bold font-mono tracking-tighter">
                    {record.currentScore}
                  </div>
                  <div className="mb-1 text-muted-foreground">/ 100</div>
                </div>
              </div>
              <div className="text-right">
                <RiskBadge level={record.currentRiskLevel as any} />
                <div className="text-xs text-muted-foreground mt-2 flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(record.timestamp).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 py-3 border-t border-border/50 mt-4">
              <div className="flex-1">
                <span className="block text-xs text-muted-foreground uppercase font-semibold mb-1">Previous Score</span>
                <span className="font-mono text-lg font-medium">{record.previousScore !== null ? record.previousScore : 'N/A'}</span>
              </div>
              <div className="flex-1 border-l border-border/50 pl-4">
                <span className="block text-xs text-muted-foreground uppercase font-semibold mb-1">Score Change</span>
                {hasChange ? (
                  <div className={`flex items-center gap-1 font-mono text-lg font-medium ${
                    isIncrease ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {isIncrease ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    {isIncrease ? '+' : ''}{scoreChange} pts
                  </div>
                ) : (
                  <div className="font-mono text-lg font-medium text-muted-foreground">0 pts</div>
                )}
              </div>
            </div>
            
            {record.previousRiskLevel && record.previousRiskLevel !== record.currentRiskLevel && (
              <div className="mt-2 text-sm bg-orange-500/10 text-orange-500 p-2 rounded border border-orange-500/20 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Risk level changed from <strong>{record.previousRiskLevel}</strong> to <strong>{record.currentRiskLevel}</strong>
              </div>
            )}
            
            {record.evaluationStatus !== 'SUCCESS' && (
              <div className="mt-2 text-sm bg-destructive/10 text-destructive p-2 rounded border border-destructive/20 flex items-center gap-2">
                <Info className="w-4 h-4" />
                {record.evaluationStatus}: {record.failureReason || 'Evaluation completed with errors or fallback.'}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4" /> Model & Version History
            </h3>
            <div className="bg-card rounded-lg border border-border p-3 space-y-2 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted-foreground">Model Version</span>
                <span className="font-mono">{record.modelVersion}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted-foreground">Feature Set</span>
                <span className="font-mono">{record.featureSetVersion}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted-foreground">Signal Rules</span>
                <span className="font-mono">{record.signalVersions}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted-foreground">Thresholds</span>
                <span className="font-mono">{record.thresholdVersion}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Latency</span>
                <span className="font-mono text-muted-foreground">{record.evaluationLatencyMs ? `${record.evaluationLatencyMs}ms` : 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2">
              <Network className="w-4 h-4" /> Related Context
            </h3>
            <div className="bg-card rounded-lg border border-border p-3 space-y-2 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono text-xs">{record.transactionId}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="p-4 border-t border-border bg-sidebar flex gap-3 shrink-0">
          <button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors" 
            onClick={() => router.push(`/risk/mali?search=${record.transactionId}`)}
          >
            View MALi Analysis
          </button>
          <button 
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors" 
            onClick={() => router.push(`/risk/factors?search=${record.transactionId}`)}
          >
            View Factors
          </button>
        </div>
      </div>
    </>
  );
}
