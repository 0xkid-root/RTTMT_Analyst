'use client';

import { useDetectionStore } from '../../store/useDetectionStore';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';

export function RuleDeleteConfirmModal() {
  const { ruleToDelete, isDeleteConfirmOpen, cancelDeleteRule, confirmDeleteRule } = useDetectionStore();

  if (!isDeleteConfirmOpen || !ruleToDelete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Delete Detection Rule
            </h3>
            <span className="font-mono text-xs text-muted-foreground">
              {ruleToDelete.id}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to remove <strong className="text-foreground">{ruleToDelete.name}</strong> from the active detection registry? This action will halt future signal emission from this rule.
        </p>

        <div className="p-3 bg-muted/30 border border-border rounded-lg text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Category:</span>
            <span className="font-medium text-foreground">{ruleToDelete.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">24h Hits Recorded:</span>
            <span className="font-mono text-foreground">{ruleToDelete.stats.hits24h}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={cancelDeleteRule}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={confirmDeleteRule}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete Rule
          </Button>
        </div>
      </div>
    </div>
  );
}
