import { Suspense } from 'react';
import { MyCasesPage } from '@/features/cases/components/MyCasesPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading cases...</div>}>
      <MyCasesPage />
    </Suspense>
  );
}
