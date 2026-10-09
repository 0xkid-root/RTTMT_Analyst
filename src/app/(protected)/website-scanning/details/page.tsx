import React from 'react';
import { WebsiteIntelligence } from '@/features/website-intelligence/components/WebsiteIntelligence';

export const metadata = {
  title: 'Website Details | RTMT Analyst',
  description: 'View detailed intelligence on scanned merchant websites.',
};

export default function WebsiteDetailsPage() {
  return (
    <div className="h-full w-full overflow-y-auto ">
      <WebsiteIntelligence />
    </div>
  );
}
