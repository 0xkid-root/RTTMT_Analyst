import { InvestigationsPage } from '@/features/investigations/components/InvestigationsPage';

export default function MyInvestigationsRoute() {
  return (
    <InvestigationsPage 
      title="My Investigations"
      description="Manage the investigations assigned directly to your queue."
      scope="my"
    />
  );
}
