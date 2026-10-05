import { InvestigationDetailsPage } from '@/features/investigations/components/InvestigationDetailsPage';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function InvestigationDetailsRoute({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <InvestigationDetailsPage investigationId={resolvedParams.id} />;
}
