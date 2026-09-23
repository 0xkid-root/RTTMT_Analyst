import { CaseDetailsPage } from '@/features/cases/components/CaseDetailsPage';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <CaseDetailsPage params={params} />;
}
