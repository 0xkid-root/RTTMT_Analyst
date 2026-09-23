import { CaseType, CasePriority } from '../types/case';
import { AlertCircle } from 'lucide-react';

interface CaseInformationFormProps {
  title: string;
  setTitle: (val: string) => void;
  type: CaseType;
  setType: (val: CaseType) => void;
  priority: CasePriority;
  setPriority: (val: CasePriority) => void;
  description: string;
  setDescription: (val: string) => void;
  assignedTo: string;
  setAssignedTo: (val: string) => void;
  errors: Record<string, string>;
}

const CASE_TYPES: CaseType[] = [
  'Transaction Fraud', 'Payment Fraud', 'Account Takeover', 
  'Money Laundering', 'Suspicious Activity', 'Merchant Risk', 'Other'
];

const PRIORITIES: CasePriority[] = ['Low', 'Medium', 'High', 'Critical'];

const ANALYSTS = ['Current Analyst', 'Ananya Sharma', 'Rahul Verma', 'Priya Singh', 'Arjun Mehta'];

export function CaseInformationForm({
  title, setTitle, type, setType, priority, setPriority,
  description, setDescription, assignedTo, setAssignedTo, errors
}: CaseInformationFormProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
          Case Information
        </h3>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium flex items-center justify-between">
            Case Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full bg-background border ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-primary'} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1`}
            placeholder="e.g. Suspicious high-value UPI transaction"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          {errors.title && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> {errors.title}
            </p>
          )}
        </div>

        {/* Type & Priority Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center justify-between">
              Case Type <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={type}
              onChange={e => setType(e.target.value as CaseType)}
            >
              {CASE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center justify-between">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              className={`w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium ${
                priority === 'Critical' ? 'text-red-500' :
                priority === 'High' ? 'text-orange-500' :
                priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'
              }`}
              value={priority}
              onChange={e => setPriority(e.target.value as CasePriority)}
            >
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium flex items-center justify-between">
            Case Description <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`w-full bg-background border ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-primary'} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 min-h-[100px] resize-y`}
            placeholder="Describe why this transaction requires investigation..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> {errors.description}
            </p>
          )}
        </div>

        {/* Assigned Analyst */}
        <div className="space-y-1.5 md:w-1/2">
          <label className="text-sm font-medium flex items-center justify-between">
            Assigned Analyst <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
          >
            {ANALYSTS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

      </div>
    </div>
  );
}
