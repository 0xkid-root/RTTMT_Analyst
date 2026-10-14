import { DetectionRulesPage } from '@/features/detection/components/rules/DetectionRulesPage';

export const metadata = {
  title: 'Detection Rules Management | RTMT Risk Intelligence',
  description: 'Configure, calibrate, and simulate conditions used to detect anomalies across real-time transaction streams.',
};

export default function Page() {
  return <DetectionRulesPage />;
}
