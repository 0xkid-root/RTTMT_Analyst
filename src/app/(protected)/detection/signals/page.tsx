import { DetectionSignalsPage } from '@/features/detection/components/signals/DetectionSignalsPage';

export const metadata = {
  title: 'Detection Signals & Findings | RTMT Risk Intelligence',
  description: 'Technical findings and risk signals emitted in real time by the detection rules engine.',
};

export default function Page() {
  return <DetectionSignalsPage />;
}
