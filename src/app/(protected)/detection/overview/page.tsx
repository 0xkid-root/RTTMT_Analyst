import { DetectionOverviewPage } from '@/features/detection/components/overview/DetectionOverviewPage';

export const metadata = {
  title: 'Detection Overview | RTMT Risk Intelligence',
  description: 'Real-time telemetry, signal ingestion velocity, and detection rules performance monitoring.',
};

export default function Page() {
  return <DetectionOverviewPage />;
}
