import { RiskOverviewPage } from '@/features/mali/components/RiskOverviewPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Risk Overview - RTMT',
  description: 'Risk scoring performance and distribution.',
};

export default function RiskOverviewRoute() {
  return <RiskOverviewPage />;
}
