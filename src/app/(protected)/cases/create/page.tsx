import { Suspense } from 'react';
import { CreateCasePage } from '@/features/cases/components/CreateCasePage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <CreateCasePage />
    </Suspense>
  );
}
