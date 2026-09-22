import { AuthLayout } from '@/features/auth/components/AuthLayout';

export default function RootAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
