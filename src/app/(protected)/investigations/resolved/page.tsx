import { InvestigationsPage } from '@/features/investigations/components/InvestigationsPage';

export default function ResolvedInvestigationsRoute() {
  return (
    <InvestigationsPage 
      title="Resolved Investigations"
      description="Historical log of all successfully closed and resolved investigations."
      scope="resolved"
    />
  );
}
