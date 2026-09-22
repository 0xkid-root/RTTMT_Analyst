import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password | RTMT',
  description: 'Reset your RTMT platform password.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
