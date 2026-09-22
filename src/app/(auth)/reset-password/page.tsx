import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password | RTMT',
  description: 'Create a new RTMT platform password.',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
