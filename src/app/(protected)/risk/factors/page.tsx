import { Suspense } from 'react';
import { RiskFactorsPage } from '@/features/risk-factors/components/RiskFactorsPage';

export default function RiskFactorsRoute() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground flex items-center justify-center h-full">Loading risk factors...</div>}>
      <RiskFactorsPage />
    </Suspense>
  );
}
