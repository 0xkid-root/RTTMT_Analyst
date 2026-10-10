import { InvestigationsPage } from '@/features/investigations/components/InvestigationsPage';
import { Suspense } from 'react';

export default function MyInvestigationsRoute() {
  return (
    <Suspense fallback={<div>Loading investigations...</div>}>
      <InvestigationsPage 
        title="My Investigations"
        description="Manage the investigations assigned directly to your queue."
        scope="my"
      />
    </Suspense>
  );
}
