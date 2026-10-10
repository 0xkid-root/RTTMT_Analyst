import { Suspense } from 'react';
import { RiskHistoryPage } from '@/features/risk-history/components/RiskHistoryPage';

export default function RiskHistoryRoute() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground flex items-center justify-center h-full">Loading risk history...</div>}>
      <RiskHistoryPage />
    </Suspense>
  );
}
