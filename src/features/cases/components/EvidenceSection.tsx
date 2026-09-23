import { useState } from 'react';
import { Evidence, EvidenceType } from '../types/case';
import { Plus, X, Link as LinkIcon, FileText, MonitorSmartphone, Globe, Store, User, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EvidenceSectionProps {
  evidenceList: Evidence[];
  onAddEvidence: (e: Evidence) => void;
  onRemoveEvidence: (id: string) => void;
}

const EVIDENCE_TYPES: EvidenceType[] = [
  'Transaction', 'Device', 'IP Address', 'Merchant', 'Account', 'Document', 'Other'
];

export function EvidenceSection({ evidenceList, onAddEvidence, onRemoveEvidence }: EvidenceSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [type, setType] = useState<EvidenceType>('Transaction');
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (!reference) return;
    onAddEvidence({
      id: `EV-${Date.now()}`,
      type,
      reference,
      description,
      addedAt: new Date().toISOString()
    });
    setReference('');
    setDescription('');
    setIsAdding(false);
  };

  const getIcon = (t: EvidenceType) => {
    switch (t) {
      case 'Transaction': return <Hash className="w-4 h-4" />;
      case 'Device': return <MonitorSmartphone className="w-4 h-4" />;
      case 'IP Address': return <Globe className="w-4 h-4" />;
      case 'Merchant': return <Store className="w-4 h-4" />;
      case 'Account': return <User className="w-4 h-4" />;
      case 'Document': return <FileText className="w-4 h-4" />;
      default: return <LinkIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
          Evidence & Investigation Context
        </h3>
        {!isAdding && (
          <Button variant="outline" size="sm" onClick={() => setIsAdding(true)} className="h-8 text-xs flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Evidence
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="bg-muted/30 border border-border rounded-lg p-4 mb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">Evidence Type</label>
              <select 
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                value={type}
                onChange={(e) => setType(e.target.value as EvidenceType)}
              >
                {EVIDENCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Reference ID / Value</label>
              <input 
                type="text" 
                placeholder="e.g. DEV-82931"
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Description</label>
            <input 
              type="text" 
              placeholder="e.g. Device has been associated with 7 high-risk transactions."
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button variant="default" size="sm" onClick={handleAdd} disabled={!reference}>
              Save Evidence
            </Button>
          </div>
        </div>
      )}

      {evidenceList.length === 0 && !isAdding ? (
        <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-lg">
          No evidence added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {evidenceList.map(ev => (
            <div key={ev.id} className="flex items-start justify-between bg-background border border-border rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-md text-muted-foreground mt-0.5">
                  {getIcon(ev.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{ev.type}</span>
                    <span className="text-sm font-mono font-medium">{ev.reference}</span>
                  </div>
                  {ev.description && <p className="text-sm text-foreground/80 mt-1">{ev.description}</p>}
                </div>
              </div>
              <button 
                onClick={() => onRemoveEvidence(ev.id)}
                className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                title="Remove evidence"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
