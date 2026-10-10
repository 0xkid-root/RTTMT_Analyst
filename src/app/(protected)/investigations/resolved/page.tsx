import { InvestigationsPage } from '@/features/investigations/components/InvestigationsPage';
import { Suspense } from 'react';

export default function ResolvedInvestigationsRoute() {
  return (
    <Suspense fallback={<div>Loading investigations...</div>}>
      <InvestigationsPage 
        title="Resolved Investigations"
        description="Historical log of all successfully closed and resolved investigations."
        scope="resolved"
      />
    </Suspense>
  );
}
