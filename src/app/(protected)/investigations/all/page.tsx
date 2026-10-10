import { InvestigationsPage } from '@/features/investigations/components/InvestigationsPage';
import { Suspense } from 'react';

export default function AllInvestigationsRoute() {
  return (
    <Suspense fallback={<div>Loading investigations...</div>}>
      <InvestigationsPage 
        title="All Investigations"
        description="View and manage all active and historical investigations across the platform."
        scope="all"
      />
    </Suspense>
  );
}
