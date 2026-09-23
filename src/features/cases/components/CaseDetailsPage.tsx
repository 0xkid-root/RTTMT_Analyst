'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCaseStore } from '@/features/cases/store/useCaseStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Hash, Clock, User, AlertCircle, Fingerprint, MapPin, Search } from 'lucide-react';

export function CaseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const caseId = resolvedParams.id;
  
  const caseData = useCaseStore(state => state.getCase(caseId));
  const updateStatus = useCaseStore(state => state.updateCaseStatus);

  if (!caseData) {
    return (
      <div className="flex-1 overflow-auto p-6 max-w-[1600px] mx-auto w-full text-center">
        <h1 className="text-2xl font-bold mt-12 mb-4">Case Not Found</h1>
        <p className="text-muted-foreground mb-8">The requested case {caseId} does not exist or has been removed.</p>
        <Button onClick={() => router.push('/cases/queue')}>Return to Case Queue</Button>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-500';
      case 'High': return 'text-orange-500';
      case 'Medium': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  const handleResolve = () => {
    updateStatus(caseData.id, 'CLOSED');
    alert('Case status updated to CLOSED. You can verify it in the Closed Cases queue.');
    router.push('/cases/closed');
  };

  const handleAction = (action: string) => {
    alert(`${action} functionality will be implemented in a future update.`);
  };

  return (
    <div className="flex-1 overflow-auto p-6 max-w-[1600px] mx-auto w-full flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Cases
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight font-mono">{caseData.id}</h1>
            <span className="px-2.5 py-1 rounded bg-primary/10 text-primary text-xs font-semibold tracking-wide">
              {caseData.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xl font-medium mt-1">{caseData.title}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleAction('Escalate Case')} className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10">Escalate</Button>
          <Button variant="default" onClick={handleResolve} disabled={caseData.status === 'CLOSED'}>
            Resolve Case
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Source Transaction Details */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-4 border-b border-border pb-3 flex items-center gap-2">
              <Search className="w-4 h-4" /> Source Transaction
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Transaction ID</span>
                <span className="font-mono text-sm font-medium">{caseData.sourceTransactionId}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Created At</span>
                <span className="text-sm font-medium">
                  {new Date(caseData.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Type</span>
                <span className="text-sm font-medium">{caseData.type}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Priority</span>
                <span className={`text-sm font-bold ${getPriorityColor(caseData.priority)}`}>{caseData.priority}</span>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background border border-border rounded-md text-muted-foreground">
                  <Hash className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Amount</div>
                  <div className="text-lg font-bold">₹{(caseData.sourceTransaction ? caseData.sourceTransaction.amount : 125000).toLocaleString('en-IN')}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background border border-border rounded-md text-muted-foreground">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Merchant</div>
                  <div className="text-sm font-semibold">{caseData.sourceTransaction ? caseData.sourceTransaction.merchant : 'Demo Merchant'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background border border-border rounded-md text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Location</div>
                  <div className="text-sm font-semibold">{caseData.sourceTransaction ? caseData.sourceTransaction.location : 'Mumbai'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detection Rules */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-4 border-b border-border pb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Detection Rules Triggered
            </h3>
            
            {caseData.detectionSignals.length > 0 ? (
              <div className="space-y-2">
                {caseData.detectionSignals.map((rule, i) => (
                  <div key={i} className="flex items-center justify-between bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-semibold text-red-500">{rule}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No detection rules associated with this case.</p>
            )}
          </div>

          {/* Description & Notes */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-4 border-b border-border pb-3 flex items-center gap-2">
              <Fingerprint className="w-4 h-4" /> Investigation Details
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Case Description</h4>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">{caseData.description}</p>
              </div>
              
              {caseData.initialNotes && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Initial Notes</h4>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap p-4 bg-muted/30 rounded-lg border border-border">{caseData.initialNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-4 border-b border-border pb-3">
              Case Assignments
            </h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Assigned Analyst</span>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                    {caseData.assignedTo.charAt(0)}
                  </div>
                  {caseData.assignedTo}
                </div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Created By</span>
                <span className="text-sm font-medium">{caseData.createdBy}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              Actions
            </h3>
            <Button variant="secondary" className="w-full justify-start gap-2" onClick={() => handleAction('Add Note')}>
              <Clock className="w-4 h-4" /> Add Note
            </Button>
            <Button variant="secondary" className="w-full justify-start gap-2" onClick={() => handleAction('Add Evidence')}>
              <Fingerprint className="w-4 h-4" /> Add Evidence
            </Button>
            <Button variant="secondary" className="w-full justify-start gap-2" onClick={() => handleAction('Investigate further')}>
              <Search className="w-4 h-4" /> Investigate
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
