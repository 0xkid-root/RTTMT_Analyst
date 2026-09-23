import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TransactionExplorerHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1 text-foreground">
          Transaction Explorer
        </h1>
        <p className="text-muted-foreground text-sm">
          Search, filter and investigate transaction activity
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}
