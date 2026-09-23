'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { mockHistoricalTransactions } from '@/features/monitor/data/mockTransactions';
import { Transaction } from '@/features/monitor/types/transaction';
import { Case, CaseType, CasePriority, Evidence } from '@/features/cases/types/case';

import { SourceTransactionCard } from '@/features/cases/components/SourceTransactionCard';
import { CaseInformationForm } from '@/features/cases/components/CaseInformationForm';
import { DetectionSignals } from '@/features/cases/components/DetectionSignals';
import { EvidenceSection } from '@/features/cases/components/EvidenceSection';
import { InvestigationNotes } from '@/features/cases/components/InvestigationNotes';
import { CaseSummary } from '@/features/cases/components/CaseSummary';
import { CaseCreatedConfirmation } from '@/features/cases/components/CaseCreatedConfirmation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function CreateCasePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const txnId = searchParams.get('txnId');

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<CaseType>('Transaction Fraud');
  const [priority, setPriority] = useState<CasePriority>('Medium');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('Current Analyst');
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [initialNotes, setInitialNotes] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdCase, setCreatedCase] = useState<Case | null>(null);

  useEffect(() => {
    if (txnId) {
      let found = mockHistoricalTransactions.find(t => t.id === txnId);
      
      // Fallback: If it's a live transaction not in the mock array, generate a dummy one for the UI
      if (!found) {
        found = {
          id: txnId,
          timestamp: new Date().toISOString(),
          merchant: 'Demo Merchant',
          merchantId: 'M-9999',
          amount: 125000,
          currency: 'INR',
          paymentMethod: 'UPI',
          transactionType: 'PAYMENT',
          location: 'Mumbai',
          riskScore: 92,
          maliScore: 88,
          riskLevel: 'CRITICAL',
          status: 'REVIEW',
          detectionRules: ['Velocity Anomaly', 'Device Mismatch'],
          deviceId: 'DEV-99999',
          ipAddress: '192.168.1.1',
          accountReference: 'ACC-99999'
        };
      }

      setTransaction(found);
      // Default priority based on risk level
      if (found.riskLevel === 'CRITICAL') setPriority('Critical');
      else if (found.riskLevel === 'HIGH') setPriority('High');
      else if (found.riskLevel === 'MEDIUM') setPriority('Medium');
      else setPriority('Low');
    }
    setLoading(false);
  }, [txnId]);

  const handleAddEvidence = (ev: Evidence) => {
    setEvidenceList(prev => [...prev, ev]);
  };

  const handleRemoveEvidence = (id: string) => {
    setEvidenceList(prev => prev.filter(e => e.id !== id));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Case title is required.';
    if (!description.trim()) newErrors.description = 'Case description is required.';
    if (!assignedTo) newErrors.assignedTo = 'Assigned analyst is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) {
      // Scroll to top to show errors if needed
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!transaction) return;

    const newCase: Case = {
      id: `CASE-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      title,
      type,
      priority,
      status: 'OPEN',
      description,
      sourceTransactionId: transaction.id,
      assignedTo,
      createdAt: new Date().toISOString(),
      createdBy: 'Current Analyst',
      detectionSignals: transaction.detectionRules,
      evidence: evidenceList,
      initialNotes,
    };

    setCreatedCase(newCase);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    if (title || description || initialNotes || evidenceList.length > 0) {
      if (confirm('You have unsaved case information. Are you sure you want to leave?')) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading transaction data...</div>;
  }

  if (!transaction && !createdCase) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Transaction Not Found</h2>
        <p className="text-muted-foreground mb-4">No transaction ID was provided or the transaction does not exist.</p>
        <Button onClick={() => router.push('/monitor/live-transactions')}>Back to Monitor</Button>
      </div>
    );
  }

  if (createdCase) {
    return (
      <div className="flex-1 overflow-auto p-6 max-w-[1600px] mx-auto w-full">
        <CaseCreatedConfirmation caseData={createdCase} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6 max-w-[1600px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={handleCancel}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl font-bold tracking-tight">Create Investigation Case</h1>
          <p className="text-muted-foreground">Create a case from this transaction for further investigation.</p>
        </div>
        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Main Area */}
        <div className="lg:col-span-2 space-y-6">
          <SourceTransactionCard transaction={transaction!} />
          <CaseInformationForm 
            title={title} setTitle={setTitle}
            type={type} setType={setType}
            priority={priority} setPriority={setPriority}
            description={description} setDescription={setDescription}
            assignedTo={assignedTo} setAssignedTo={setAssignedTo}
            errors={errors}
          />
          <DetectionSignals signals={transaction!.detectionRules} />
          <EvidenceSection 
            evidenceList={evidenceList}
            onAddEvidence={handleAddEvidence}
            onRemoveEvidence={handleRemoveEvidence}
          />
          <InvestigationNotes 
            notes={initialNotes}
            setNotes={setInitialNotes}
          />

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
            <Button variant="secondary" onClick={() => alert('Draft saved (UI only)')}>Save as Draft</Button>
            <Button variant="default" className="px-8" onClick={handleCreate}>Create Case</Button>
          </div>
        </div>

        {/* Right / Summary Area */}
        <div className="lg:col-span-1 hidden lg:block">
          <CaseSummary 
            type={type}
            priority={priority}
            transaction={transaction}
            assignedTo={assignedTo}
          />
        </div>
      </div>
    </div>
  );
}
