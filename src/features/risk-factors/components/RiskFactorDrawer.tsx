'use client';

import { RiskFactor } from '../types/risk-factor';
import { X, Network, FileText, ArrowUpRight, ArrowDownRight, Clock, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RiskFactorDrawerProps {
  factor: RiskFactor | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RiskFactorDrawer({ factor, isOpen, onClose }: RiskFactorDrawerProps) {
  const router = useRouter();
  
  if (!factor) return null;

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
              Factor Details
              <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold border border-primary/20">
                Mock Data
              </span>
            </h2>
            <div className="text-sm font-mono text-muted-foreground mt-1">ID: {factor.id}</div>
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
                <h3 className="text-xl font-bold text-foreground">{factor.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{factor.category} Category</p>
              </div>
              <span className={`text-xs font-bold uppercase px-2 py-1 rounded border ${
                factor.severity === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                factor.severity === 'high' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                factor.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                'bg-green-500/10 text-green-500 border-green-500/20'
              }`}>
                {factor.severity}
              </span>
            </div>

            <div className="text-sm text-foreground bg-muted/30 p-3 rounded-lg border border-border/50 mb-4 flex gap-3">
              <Info className="w-5 h-5 text-muted-foreground shrink-0" />
              {factor.explanation}
            </div>

            <div className="flex items-center gap-4 py-2 border-t border-border/50">
              <div className="flex-1">
                <span className="block text-xs text-muted-foreground uppercase font-semibold mb-1">Contribution</span>
                <div className={`flex items-center gap-1 font-mono text-lg font-medium ${
                  factor.direction === 'increase' ? 'text-orange-500' : 'text-green-500'
                }`}>
                  {factor.direction === 'increase' ? (
                    <ArrowUpRight className="w-5 h-5" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5" />
                  )}
                  {factor.direction === 'increase' ? '+' : '-'}{factor.contribution} pts
                </div>
              </div>
              <div className="flex-1 border-l border-border/50 pl-4">
                <span className="block text-xs text-muted-foreground uppercase font-semibold mb-1">Evaluated</span>
                <div className="text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  {new Date(factor.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" /> Evidence & Values
            </h3>
            
            <div className="bg-card rounded-lg border border-border p-4 shadow-sm grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground block text-xs mb-1">Observed Value</span>
                <span className="font-mono text-foreground font-medium">{factor.observedValue}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs mb-1">Expected Baseline</span>
                <span className="font-mono text-foreground">{factor.expectedBaseline || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2">
              <Network className="w-4 h-4" /> Related Context
            </h3>
            
            <div className="bg-card rounded-lg border border-border p-3 space-y-3 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono">{factor.transactionId}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted-foreground">Feature Set</span>
                <span className="font-mono">v1.8.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Model</span>
                <span className="font-mono text-xs">mali-transaction-risk (v2.4.1)</span>
              </div>
            </div>
          </div>

        </div>

        <div className="p-4 border-t border-border bg-sidebar flex gap-3 shrink-0">
          <button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors" 
            onClick={() => router.push(`/risk/mali`)}
          >
            View Transaction
          </button>
        </div>
      </div>
    </>
  );
}
