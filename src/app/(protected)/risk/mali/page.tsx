import { MaliAnalysisPage } from '@/features/mali/components/MaliAnalysisPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MALi Analysis - RTMT',
  description: 'Transaction risk analysis and evaluation module.',
};

export default function MaliRoute() {
  return <MaliAnalysisPage />;
}
