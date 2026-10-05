import { InvestigationsPage } from '@/features/investigations/components/InvestigationsPage';

export default function AllInvestigationsRoute() {
  return (
    <InvestigationsPage 
      title="All Investigations"
      description="View and manage all active and historical investigations across the platform."
      scope="all"
    />
  );
}
