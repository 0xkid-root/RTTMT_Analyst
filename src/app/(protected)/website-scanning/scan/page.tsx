import { WebsiteScanner } from '@/features/website-intelligence/components/WebsiteScanner';

export const metadata = {
  title: 'Website Intelligence | RTMT Analyst',
  description: 'Scan and analyze merchant websites for risk indicators.',
};

export default function WebsiteIntelligencePage() {
  return (
    <div className="h-full w-full overflow-y-auto">
      <WebsiteScanner />
    </div>
  );
}
