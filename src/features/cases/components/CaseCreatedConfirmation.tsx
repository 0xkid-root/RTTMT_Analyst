import { Case } from '../types/case';
import { CheckCircle2, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface CaseCreatedConfirmationProps {
  caseData: Case;
}

export function CaseCreatedConfirmation({ caseData }: CaseCreatedConfirmationProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 max-w-2xl mx-auto">
      <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Case Created Successfully</h2>
      <p className="text-muted-foreground text-center mb-8">
        The investigation case has been created and assigned.
      </p>

      <div className="w-full bg-card border border-border rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <span className="font-mono text-lg font-bold text-primary">{caseData.id}</span>
          </div>
          <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide">
            {caseData.status}
          </span>
        </div>
        
        <div className="p-5 space-y-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Title</div>
            <div className="font-medium">{caseData.title}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Priority</div>
              <div className={`font-semibold ${
                caseData.priority === 'Critical' ? 'text-red-500' :
                caseData.priority === 'High' ? 'text-orange-500' :
                caseData.priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'
              }`}>{caseData.priority}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Type</div>
              <div className="font-medium">{caseData.type}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Assigned To</div>
              <div className="font-medium">{caseData.assignedTo}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Source Transaction</div>
              <div className="font-mono text-sm">{caseData.sourceTransactionId}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full sm:w-auto">
        <Button 
          variant="outline" 
          className="flex-1 sm:flex-none"
          onClick={() => router.back()}
        >
          Back to Transaction
        </Button>
        <Button 
          className="flex-1 sm:flex-none gap-2"
          onClick={() => alert(`Navigating to ${caseData.id} details page...`)}
        >
          View Case <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
