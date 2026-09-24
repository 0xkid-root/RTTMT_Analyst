import { Suspense } from 'react';
import { CaseQueuePage } from '@/features/cases/components/CaseQueuePage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading queue...</div>}>
      <CaseQueuePage />
    </Suspense>
  );
}
