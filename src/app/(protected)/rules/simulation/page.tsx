import { StandaloneRuleSimulationPage } from '@/features/detection/components/simulation/StandaloneRuleSimulationPage';

export const metadata = {
  title: 'Rule Simulation Workbench | RTMT Risk Intelligence',
  description: 'Test and verify detection rules logic against synthetic or historical test vectors.',
};

export default function Page() {
  return <StandaloneRuleSimulationPage />;
}
