'use client';

import { useRouter } from 'next/navigation';
import { Case } from '../types/case';
import { Hash, User, Clock, AlertCircle } from 'lucide-react';

interface CasesTableProps {
  cases: Case[];
  emptyMessage?: string;
}

export function CasesTable({ cases, emptyMessage = 'No cases found.' }: CasesTableProps) {
  const router = useRouter();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-green-500 bg-green-500/10 border-green-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'IN_REVIEW': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'PENDING_REVIEW': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'ESCALATED': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'RESOLVED': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'CLOSED': return 'text-muted-foreground bg-muted/50 border-border';
      default: return 'text-foreground bg-muted border-border';
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col flex-1 min-h-[500px]">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="px-4 py-3 font-medium">Case ID</th>
              <th className="px-4 py-3 font-medium">Case Title</th>
              <th className="px-4 py-3 font-medium">Source Transaction</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium text-center">Priority</th>
              <th className="px-4 py-3 font-medium">Assigned To</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {cases.map(c => (
              <tr 
                key={c.id} 
                onClick={() => router.push(`/cases/${c.id}`)}
                className="cursor-pointer transition-colors hover:bg-muted/50"
              >
                <td className="px-4 py-3 whitespace-nowrap font-mono font-medium text-primary">
                  {c.id}
                </td>
                <td className="px-4 py-3 min-w-[200px] max-w-[300px]">
                  <div className="font-medium truncate">{c.title}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Hash className="w-3.5 h-3.5" />
                    <span className="font-mono">{c.sourceTransactionId}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {c.type}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider border ${getPriorityColor(c.priority)}`}>
                    {c.priority.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <User className="w-3.5 h-3.5" />
                    {c.assignedTo}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider border ${getStatusColor(c.status)}`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
            
            {cases.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground text-lg flex-col items-center justify-center">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
