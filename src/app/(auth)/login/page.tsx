import { LoginForm } from '@/features/auth/components/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | RTMT',
  description: 'Sign in to access the RTMT platform.',
};

export default function LoginPage() {
  return <LoginForm />;
}
