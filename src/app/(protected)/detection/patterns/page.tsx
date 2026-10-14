import { DetectionPatternsPage } from '@/features/detection/components/patterns/DetectionPatternsPage';

export const metadata = {
  title: 'Detection Patterns & Signatures | RTMT Risk Intelligence',
  description: 'Correlated multi-event signatures and behavioral clusters identified by composite detection heuristics.',
};

export default function Page() {
  return <DetectionPatternsPage />;
}
