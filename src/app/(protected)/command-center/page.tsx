import { CommandCenterPage } from '@/features/command-center/components/CommandCenterPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Command Center | RTMT',
  description: 'Real-time risk and threat monitoring across the RTMT environment.',
};

export default function Page() {
  return <CommandCenterPage />;
}
